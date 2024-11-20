import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { pool } from '../app.js'


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkRole(req, res, next) {
    const user = req.session.user;
    if (!user || user.role !== 'admin') {
        res.status(403).send('Доступ запрещен.');
    } else {
        next();
    }
}

router.get('/admin', checkRole, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});


router.get('/tasks', checkRole, async (req, res) => {
    try {
        const all_tasks = await pool.query('SELECT * FROM tasks;');
        res.json(all_tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});


router.post('/tasks', checkRole, async (req, res) => {
    const { task_text, answer } = req.body;
    try {
        await pool.query('INSERT INTO tasks (task_text, answer) VALUES ($1, $2)', [task_text, answer]);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при добавлении задачи.');
    }
});


router.post('/tasks/:id', checkRole, async (req, res) => {
    const { id } = req.params;
    const { task_text, answer } = req.body;
    try {
        await pool.query('UPDATE tasks SET task_text = $1, answer = $2 WHERE id = $3', [task_text, answer, id]);
        res.status(201).send('Задача обновлена.');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при обновлении задачи.');
    }
});


router.delete('/tasks/:id', checkRole, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send('Задача удалена.');
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при удалении задачи.');
    }
});


export default router;
