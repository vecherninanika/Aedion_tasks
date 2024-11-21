// import request from 'supertest';
// import express from 'express';
// import { pool } from '../app.js';
// import router from '../routes/admin.js';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config({path: '../.env'});
// const app = express();
// app.use(express.json());
// app.use('/', router);

// const TOKEN_SECRET = process.env.TOKEN_SECRET;
// let index;

// const generateToken = (user) => {
//     return jwt.sign(user, TOKEN_SECRET);
// };

// describe('Admin Router', () => {
//     let token;
// // 
//     beforeAll(async () => {
//       await pool.query("INSERT INTO users (username, password, role) VALUES ('adminuser', 'password', 'admin');");
//       await pool.query("INSERT INTO tasks (task_text, answer) VALUES ('Test Task', 'answer');");
//       const taskQuery = await pool.query("SELECT id FROM tasks WHERE task_text = 'Test Task';");
//       index = taskQuery.rows[0].id;
//       const user = { id: 1, username: 'adminuser', role: 'admin' };
//       token = generateToken(user);
//     });

//     afterAll(async () => {
//       await pool.query("DELETE FROM users WHERE username='adminuser';");
//       await pool.query("DELETE FROM tasks WHERE task_text='New Task';");
//       await pool.query("DELETE FROM tasks WHERE task_text='Test Task';");
//       await pool.end();
//     });

//     describe('GET /admin', () => {
//         it('should return admin.html for authenticated admin', async () => {
//             const res = await request(app)
//                 .get('/admin')
//                 .set('Authorization', `Bearer ${token}`);
//             expect(res.statusCode).toBe(200);
//             expect(res.headers['content-type']).toMatch(/html/);
//         });
//     });

//     describe('GET /tasks', () => {
//         it('should return all tasks for authenticated admin', async () => {
//             const res = await request(app)
//                 .get('/tasks')
//                 .set('Authorization', `Bearer ${token}`);
//             expect(res.statusCode).toBe(200);
//             expect(Array.isArray(res.body)).toBe(true);
//         });

//         it('should return 403 if user is not admin', async () => {
//             const nonAdminToken = generateToken({ username: 'user', role: 'user' });
//             const res = await request(app)
//                 .get('/tasks')
//                 .set('Authorization', `Bearer ${nonAdminToken}`);
//             expect(res.statusCode).toBe(403);
//             expect(res.text).toBe('Только администратор может просматривать эту страницу.');
//         });

//         it('should return 401 if token is missing', async () => {
//             const res = await request(app).get('/tasks');
//             expect(res.statusCode).toBe(401);
//             expect(res.text).toBe('Отсутствует header "Authorization"');
//         });
//     });

//     describe('POST /tasks', () => {
//         it('should add a new task and redirect to /admin', async () => {
//             const res = await request(app)
//                 .post('/tasks')
//                 .send({ task_text: 'New Task', answer: 'Answer' })
//                 .set('Authorization', `Bearer ${token}`);
//             expect(res.statusCode).toBe(302); // редирект на страницу admin
//         });

//         it('should return 400 if there is an error adding task', async () => {
//             const res = await request(app)
//                 .post('/tasks')
//                 .send({ task_text: '', answer: '' }) // Пустые данные
//                 .set('Authorization', `Bearer ${token}`);
//             expect(res.statusCode).toBe(400);
//             expect(res.text).toBe('Ошибка при добавлении задачи.');
//         });
//     });

//     describe('POST /tasks/:id', () => {
//         it('should update a task and return success message', async () => {
//             const res = await request(app)
//             .post(`/tasks/${index}`)
//             .send({ task_text: 'Updated Task', answer: 'Updated Answer' })
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.statusCode).toBe(201);
//         expect(res.text).toBe('Задача обновлена.');
//     });

//     it('should return 400 if there is an error updating task', async () => {
//         const res = await request(app)
//             .post(`/tasks/${index}`)
//             .send({ task_text: '', answer: '' }) // Пустые данные
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.statusCode).toBe(400);
//         expect(res.text).toBe('Ошибка при обновлении задачи.');
//     });
// });

// describe('DELETE /tasks/:id', () => {
//     it('should delete a task and return 204', async () => {
//         const res = await request(app)
//             .delete(`/tasks/${index}`)
//             .set('Authorization', `Bearer ${token}`);
//         expect(res.statusCode).toBe(204);
//     });

//     it('should return 403 if user is not admin', async () => {
//         const nonAdminToken = generateToken({ id: 2, username: 'user', role: 'user' });
//         const res = await request(app)
//             .delete(`/tasks/${index}`)
//             .set('Authorization', `Bearer ${nonAdminToken}`);

//         expect(res.statusCode).toBe(403);
//         expect(res.text).toBe('Только администратор может просматривать эту страницу.');
//     });

//     it('should return 401 if token is missing', async () => {
//         const res = await request(app).delete(`/tasks/${index}`);
//         expect(res.statusCode).toBe(401);
//         expect(res.text).toBe('Отсутствует header "Authorization"');
//     });
// });

// });
