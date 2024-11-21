import request from 'supertest';
import express from 'express';
import { pool } from '../app.js';
import router from '../routes/auth.js';
import session from 'express-session';
import app from '../app.js';

app.use(express.json());

app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // Сессия на 10 минут
}));

app.use('/', router);


describe('Auth Router', () => {
    beforeAll(async () => {
      await pool.query("DELETE FROM users where username='testuser1'");
    });

    afterAll(async () => {
        await pool.query("DELETE FROM users where username='testuser1'");
        await pool.end();
    });

    describe('GET /register', () => {
        it('should return register.html file', async () => {
            const res = await request(app).get('/register');
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toMatch(/html/);
        });
    });

    describe('GET /login', () => {
        it('should return login.html file', async () => {
            const res = await request(app).get('/login');
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toMatch(/html/);
        });
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });
            expect(res.statusCode).toBe(302); // редирект на страницу логина
        });

        it('should return error if user already exists', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Ошибка при регистрации.');
        });
    });

    describe('POST /login', () => {
        it('should log in the user and redirect', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });
            expect(res.statusCode).toBe(302); // редирект на страницу dashboard
        });

        it('should return error for invalid password', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    username: 'testuser1',
                    password: 'wrongpassword',
                });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Неверный пароль.');
        });

        it('should return error for invalid username', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    username: 'nonexistentuser',
                    password: 'password123',
                });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Неверное имя пользователя.');
        });
    });

    describe('GET /logout', () => {
        it('should log out the user and redirect to login', async () => {
            const res = await request(app).get('/logout');
            expect(res.statusCode).toBe(302); // редирект на страницу логина
        });
    });
});
