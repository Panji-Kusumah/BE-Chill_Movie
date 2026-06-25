const request = require('supertest');
const { app, server } = require('../src/app');
const db = require('../src/config/database');
const { generateTestToken } = require('./helpers/testHelper');

describe('Authentication API Endpoints', () => {
    const uniqueEmail = `test_jest_${Date.now()}@gmail.com`;
    const uniqueUsername = `jestuser_${Date.now()}`;
    const registerPayload = {
        fullname: 'Jest Test User',
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'password123'
    };
    let authToken = '';
    afterAll(async () => {
        await db.end();
        await new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(registerPayload);
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('email', uniqueEmail);
        });
        it('should fail if email already exists', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(registerPayload);
            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
        });
        it('should fail if fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ fullname: 'Test' });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe('POST /api/auth/login', () => {
        it('should login successfully and return token', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: uniqueEmail,
                    password: 'password123'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            authToken = res.body.data.token;
        });
        it('should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: uniqueEmail,
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
        it('should fail with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@gmail.com',
                    password: 'password123'
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('GET /api/auth/verify-email', () => {
        it('should return error for invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/verify-email?token=invalidtoken123');
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe('GET /api/users/profile (Protected Route)', () => {
        it('should get profile with valid token', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(uniqueEmail);
        });
        it('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/users/profile');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});