import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../app.js';
import { secretKey } from '../app.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use(cookieParser());


function setAuthToken(res, token) {
  res.cookie('token', token, {
    maxAge: 3600000, // Токен живет 1 час
    httpOnly: false,
  });
}


function generateToken(username, role) {
    return jwt.sign({ username, role }, secretKey, { expiresIn: '1800s' });
}

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const role = 'user';
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);
        res.redirect('/login');
    } catch (err) {
        res.status(400).send('Ошибка при регистрации.');
        console.error(err);
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userQuery.rows.length > 0) {
            const user = userQuery.rows[0];
            req.session.user = user;
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateToken(user.username, user.role);
                console.log('token created: ', token);

                setAuthToken(res, token);
                res.redirect('/dashboard');
            } else {
                res.status(400).send('Неверный пароль.');
            }
        } else {
            res.status(400).send('Неверное имя пользователя.');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при авторизации.');
    }
});


router.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
});

export default router;
