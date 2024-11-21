import request from 'supertest';
import express from 'express';
import { pool } from '../app.js';
import app from '../app.js';
import router from '../routes/dashboard.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config({path: '../.env'});

app.use(express.json());

app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // Сессия на 10 минут
}));

app.use('/', router);


const TOKEN_SECRET = process.env.TOKEN_SECRET;
let taskId;
let taskId1;
let userId;

const generateToken = (user) => {
    return jwt.sign(user, TOKEN_SECRET);
};

describe('Tasks Router', () => {
    let token;

    beforeAll(async () => {
        // Creating test user
        const userIdQuery = await pool.query("INSERT INTO users (username, password, role) VALUES ('test101', 'password', 'user') RETURNING id;");
        userId = userIdQuery.rows[0].id;
        // Creating test task 1
        const taskQuery = await pool.query("INSERT INTO tasks (task_text, answer) VALUES ('Test Task 1', 'answer') RETURNING id;");
        taskId = taskQuery.rows[0].id;
        // Creating test task 2, connected to user
        const task1Query = await pool.query("INSERT INTO tasks (task_text, answer) VALUES ('Test Task 2', 'answer') RETURNING id;");
        taskId1 = task1Query.rows[0].id;
        await pool.query("INSERT INTO user_to_task (user_id, task_id, task_status) VALUES ($1, $2, 0);", [userId, taskId1]);
        // Generating token
        const user = { username: 'test101', role: 'user' };
        token = generateToken(user);
    });

    afterAll(async () => {
      await pool.query("DELETE FROM tasks where task_text='Test Task 1';");
      await pool.query("DELETE FROM tasks where task_text='Test Task 2';");
      await pool.query("DELETE FROM users where username='test101';");
        await pool.end();
    });

    describe('GET /dashboard', () => {
        it('should return dashboard.html if user is logged in', async () => {
            const res = await request(app)
                .get('/dashboard')
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toMatch(/html/);
        });
    });

    describe('GET /tasks/todo', () => {
        it('should return todo tasks for authenticated user', async () => {
            const res = await request(app)
                .get('/tasks/todo')
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 401 if token is missing', async () => {
            const res = await request(app).get('/tasks/todo');
            expect(res.statusCode).toBe(401);
            expect(res.text).toBe('Отсутствует header "Authorization"');
        });
    });

    describe('GET /tasks/done', () => {
        it('should return done tasks for authenticated user', async () => {
            const res = await request(app)
                .get('/tasks/done')
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 401 if token is missing', async () => {
            const res = await request(app).get('/tasks/done');
            expect(res.statusCode).toBe(401);
            expect(res.text).toBe('Отсутствует header "Authorization"');
        });
    });

    describe('POST /tasks/:id/answer', () => {
        it('should return 400 if there is an error submitting answer', async () => {
          const res = await request(app)
              .post(`/tasks/${taskId}/answer`)
              .send({ unexisting_param: 'text' })
              .set('Authorization', `Bearer ${token}`)
              .set('Cookie', ['session=user-session']);

          expect(res.statusCode).toBe(400);
          expect(res.text).toBe('Ошибка при добавлении задачи.');
      });
  });

  describe('DELETE /tasks/:id/undo', () => {
      it('should delete the task from user tasks and return 204', async () => {
          const res = await request(app)
              .delete(`/tasks/${taskId}/undo`)
              .set('Authorization', `Bearer ${token}`)
          expect(res.statusCode).toBe(204);
      });

      it('should return 401 if token is missing', async () => {
          const res = await request(app).delete(`/tasks/${taskId1}/undo`);
          expect(res.statusCode).toBe(401);
          expect(res.text).toBe('Отсутствует header "Authorization"');
      });
  });
});
