const request = require('supertest');
const { app, server } = require('../src/app');
const db = require('../src/config/database');
const { generateTestToken } = require('./helpers/testHelper');

describe('Genre API Endpoints', () => {
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

    describe('GET /api/genres', () => {
        it('should get all genres with auth', async () => {
            const res = await request(app)
                .get('/api/genres')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
        });

        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/genres');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/genre/:id', () => {
        it('should get genre by id with auth', async () => {
            const res = await request(app)
                .get('/api/genre/1')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/genre/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/genre', () => {
        it('should create genre with auth', async () => {
            const newGenre = {
                nama_genre: 'Test Genre'
            };
            const res = await request(app)
                .post('/api/genre')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newGenre);
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without auth', async () => {
            const newGenre = { nama_genre: 'Test' };
            const res = await request(app)
                .post('/api/genre')
                .send(newGenre);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/genre/:id', () => {
        it('should return 401 without auth', async () => {
            const res = await request(app).delete('/api/genre/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});