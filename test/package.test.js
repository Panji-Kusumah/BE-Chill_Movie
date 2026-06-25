const request = require('supertest');
const { app, server } = require('../src/app');
const db = require('../src/config/database');
const { generateTestToken } = require('./helpers/testHelper');

describe('Package API Endpoints', () => {
    let authToken;
    beforeAll(async () => {
        authToken = generateTestToken();
    });
    afterAll(async () => {
        await db.end();
        await new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });
    describe('GET /api/packages', () => {
        it('should get all packages with auth', async () => {
            const res = await request(app)
                .get('/api/packages')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
        });
        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/packages');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('GET /api/package/:id', () => {
        it('should get package by id with auth', async () => {
            const res = await request(app)
                .get('/api/package/1')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/package/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('POST /api/package', () => {
        it('should return 401 without auth', async () => {
            const newPackage = {
                nama_paket: 'Test Package',
                harga: 99000,
                durasi: 30
            };
            const res = await request(app)
                .post('/api/package')
                .send(newPackage);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});