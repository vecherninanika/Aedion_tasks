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
        console.log(`Токена не хватает`);
        return res.status(401).send('Токена не хватает');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log(`Токена не хватает`);
        return res.status(401).send('Токена не хватает');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        console.log('ERROR:', err.message);
        return res.status(403).send(err.message);
      }
      next();
    })
}


router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    } else {
        res.redirect('/login');
    }
});


router.get('/tasks/todo', authenticateToken, async (req, res) => {
    const user = req.session.user;
    try {
        const tasks = await pool.query('SELECT t.* FROM tasks t LEFT JOIN user_to_task ut ON t.id = ut.task_id AND ut.user_id = $1 WHERE ut.task_id IS NULL;', [user.id]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.get('/tasks/done', authenticateToken, async (req, res) => {
    const user = req.session.user;
    try {
        const user_tasks = await pool.query('SELECT t.*, ut.task_status FROM user_to_task ut JOIN users u ON ut.user_id = u.id JOIN tasks t ON ut.task_id = t.id where u.username=$1;', [user.username]);
        res.json(user_tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.post('/tasks/:id/answer', authenticateToken, async (req, res) => {
    const { answer } = req.body;
    const { id } = req.params;
    const user = req.session.user;
    try {
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
        await pool.query('DELETE FROM user_to_task WHERE task_id = $1', [id]);
        res.status(204).send('Задача удалена из выполненных задач пользователя.');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при удалении задачи из выполненных.');
    }
});

export default router;



// status does not work with redirect. how to test it if even unauthorized returns 302?
// tests for bad things, like unauthorized
// delete user after registration test
// tests coverage
