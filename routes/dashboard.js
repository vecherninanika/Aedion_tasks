import express from 'express';
import { pool } from '../app.js'


const router = express.Router();


function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
}


router.get('/dashboard', authenticateToken, (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    } else {
        res.status(401).redirect('/login');
    }
});


router.get('/tasks/todo', checkAuth, authenticateToken, async (req, res) => {
    const user = req.session.user;
    try {
        const tasks = await pool.query('SELECT t.* FROM tasks t LEFT JOIN user_to_task ut ON t.id = ut.task_id AND ut.user_id = $1 WHERE ut.task_id IS NULL;', [user.id]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.get('/tasks/done', checkAuth, async (req, res) => {
    const user = req.session.user;
    try {
        const user_tasks = await pool.query('SELECT t.*, ut.task_status FROM user_to_task ut JOIN users u ON ut.user_id = u.id JOIN tasks t ON ut.task_id = t.id where u.username=$1;', [user.username]);
        res.json(user_tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send('Ошибка при получении задач.');
    }
});

router.post('/tasks/:id/answer', checkAuth, async (req, res) => {
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


router.delete('/tasks/:id/undo', checkAuth, async (req, res) => {
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



// jwt
// status does not work with redirect. how to test it if even unauthorized returns 302?
// tests for bad things, like unauthorized
// delete user after registration test
// tests coverage
