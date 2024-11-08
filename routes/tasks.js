import pkg from 'pg';
const { Pool } = pkg;
import express from 'express';

const router = express.Router();

const pool = new Pool({
    user: 'suonica',
    host: 'localhost',
    database: 'aedion_tasks',
    password: 'ashryver',
    port: 5433,
});

function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/tasks', checkAuth, async (req, res) => {
    try {
        const all_tasks = await pool.query('SELECT * FROM tasks');
        res.json(all_tasks.rows);
    } catch (err) {
        console.error(err);
        res.send('Ошибка при получении задач.');
    }
});

router.get('/tasks/done', checkAuth, async (req, res) => {
    try {
        const user = req.session.user;
        const user_tasks = await pool.query('SELECT * FROM tasks WHERE user_id = (SELECT id FROM users WHERE username = $1)', [user]);
        res.json(user_tasks.rows);
        const all_tasks = await pool.query('SELECT * FROM tasks');
        // res.json(all_tasks.rows); TODO
    } catch (err) {
        console.error(err);
        res.send('Ошибка при получении задач.');
    }
});

router.post('/tasks', checkAuth, async (req, res) => {
    const { title, description } = req.body;
    const user = req.session.user;

    try {
        const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        const userId = userIdQuery.rows[0].id;
        await pool.query('INSERT INTO tasks (title, answer) VALUES ($1, $2)', [title, description]);
        // TODO insert into user_to_task
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при добавлении задачи.');
    }
});

router.put('/tasks/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        await pool.query('UPDATE tasks SET title = $1, answer = $2, status = $3 WHERE id = $4', [title, description, status, id]);
        res.send('Задача обновлена.');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при обновлении задачи.');
    }
});

router.put('/tasks/:id/status', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, id]);
        res.send('Статус задачи обновлен.');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при обновлении статуса задачи.');
    }
});

router.delete('/tasks/:id/undo', checkAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM user_to_task WHERE task_id = $1', [id]);
        res.send('Задача удалена из выполненных задач пользователя.');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при удалении задачи из выполненных.');
    }
});

router.delete('/tasks/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.send('Задача удалена.');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при удалении задачи.');
    }
});

export default router;
