const request = require('supertest');
const { app, server } = require('../src/app');
const db = require('../src/config/database');
const { generateTestToken } = require('./helpers/testHelper');

describe('Episode API Endpoints', () => {

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

    describe('GET /api/episodes', () => {
        it('should get all episodes with auth', async () => {
            const res = await request(app)
                .get('/api/episodes')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
        });

        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/episodes');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/episode/:id', () => {
        it('should get episode by id with auth', async () => {
            const res = await request(app)
                .get('/api/episode/1')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/episode/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/episode/series/:seriesId', () => {
        it('should get episodes by series id with auth', async () => {
            const res = await request(app)
                .get('/api/episode/series/6')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
        });

        it('should return 401 without auth', async () => {
            const res = await request(app).get('/api/episode/series/6');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/episode', () => {
        it('should return 401 without auth', async () => {
            const newEpisode = {
                series_id: 1,
                judul_episode: 'Test',
                nomor_season: 1,
                nomor_episode: 1
            };
            const res = await request(app)
                .post('/api/episode')
                .send(newEpisode);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});