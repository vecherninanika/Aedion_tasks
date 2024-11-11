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

router.get('/role', checkAuth, async (req, res) => {
    const user = req.session.user;
    try {
        const userRoleQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        res.json(userRoleQuery);
    } catch (err) {
        console.error(err);
    }
});

router.get('/tasks', checkAuth, async (req, res) => {
    try {
        const all_tasks = await pool.query('SELECT * FROM tasks;');
        res.json(all_tasks.rows);
    } catch (err) {
        console.error(err);
        res.send('Ошибка при получении задач.');
    }
});

router.get('/tasks/todo', checkAuth, async (req, res) => {
    const user = req.session.user;
    try {
        const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        const userId = userIdQuery.rows[0].id;
        const tasks = await pool.query('SELECT t.* FROM tasks t LEFT JOIN user_to_task ut ON t.id = ut.task_id AND ut.user_id = $1 WHERE ut.task_id IS NULL;', [userId]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.send('Ошибка при получении задач.');
    }
});

router.get('/tasks/done', checkAuth, async (req, res) => {
    const user = req.session.user;
    try {
        const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        const userId = userIdQuery.rows[0].id;
        const user_tasks = await pool.query('SELECT t.task_text, t.answer, ut.task_status FROM user_to_task ut JOIN users u ON ut.user_id = u.id JOIN tasks t ON ut.task_id = t.id where u.username="$1";', [user]);
        res.json(user_tasks.rows);
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

router.post('/tasks/:id/answer', checkAuth, async (req, res) => {
    const { answer } = req.body;
    const { id } = req.params;
    const user = req.session.user;

    try {
        const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        const userId = userIdQuery.rows[0].id;
        const taskAnswerQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
        const taskAnswer = taskAnswerQuery.rows[0].answer;
        const task_status = taskAnswer == answer ? 1 : 0;
        await pool.query('INSERT INTO user_to_task (user_id, task_id, task_status) VALUES ($1, $2, $3);', [userId, id, task_status]);
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
    const { id } = req.params;
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

// admin can edit
// edit profile