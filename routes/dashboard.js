import express from 'express';
import { pool } from '../app.js'
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error(`Отсутствует header "Authorization"`);
        return res.status(401).send('Отсутствует header "Authorization"');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.error(`Отсутствует токен`);
        return res.status(401).send('Отсутствует токен');
    }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        console.error('ERROR:', error.message);
        return res.status(403).send(error.message);
    }
}


router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});


router.get('/tasks/todo', authenticateToken, async (req, res) => {
    try {
        let userId;
        try {
            const user = req.session.user;
            userId = user.id;
        } catch {
            const token = req.headers['authorization'].split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const username = decoded.username;
            const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            userId = userQuery.rows[0].id;
        }
        const tasks = await pool.query('SELECT t.* FROM tasks t LEFT JOIN user_to_task ut ON t.id = ut.task_id AND ut.user_id = $1 WHERE ut.task_id IS NULL;', [userId]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.get('/tasks/done', authenticateToken, async (req, res) => {
    try {
        let userId;
        try {
            const user = req.session.user;
            userId = user.id;
        } catch {
            const token = req.headers['authorization'].split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const username = decoded.username;
            const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            userId = userQuery.rows[0].id;
        }
        const user_tasks = await pool.query('SELECT t.*, ut.task_status FROM user_to_task ut JOIN users u ON ut.user_id = u.id JOIN tasks t ON ut.task_id = t.id where u.id=$1;', [userId]);
        res.json(user_tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.post('/tasks/:id/answer', async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.session.user;
        const { answer } = req.body;
        const taskAnswerQuery = await pool.query('SELECT answer FROM tasks WHERE id = $1', [id]);
        const taskAnswer = taskAnswerQuery.rows[0].answer;
        const taskStatus = taskAnswer == answer ? 1 : 0;
        await pool.query('INSERT INTO user_to_task (user_id, task_id, task_status) VALUES ($1, $2, $3);', [user.id, id, taskStatus]);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при добавлении задачи.');
    }
});


router.delete('/tasks/:id/undo', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        let userId;
        try {
            const user = req.session.user;
            userId = user.id;
        } catch {
            const token = req.headers['authorization'].split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const username = decoded.username;
            const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            userId = userQuery.rows[0].id;
        }
        await pool.query('DELETE FROM user_to_task WHERE task_id = $1 and user_id = $2', [id, userId]);
        res.status(204).send('Задача удалена из выполненных задач пользователя.');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при удалении задачи из выполненных.');
    }
});

export default router;
