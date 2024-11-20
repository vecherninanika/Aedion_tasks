import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../app.js';
import { secretKey } from '../app.js';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function generateToken(username, role) {
    return jwt.sign({username: username, role: role}, secretKey, { expiresIn: '1800s' });
}

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/register', async (req, res) => {
    const { username, full_name, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).send('Пользователь уже существует.');
        }
        const role = 'user';
        await pool.query('INSERT INTO users (username, full_name, password, role) VALUES ($1, $2, $3, $4)', [username, full_name, password, role]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при регистрации.');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (user.rows.length > 0) {
            req.session.user = user.rows[0];
            const token = generateToken(user.username, user.role);
            // res.json({ token });
            console.log(token);
            res.redirect('/dashboard');
        } else {
            res.status(400).send('Неверное имя пользователя или пароль.');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при авторизации.');
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;
