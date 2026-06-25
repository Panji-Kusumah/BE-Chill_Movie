const request = require('supertest');
const { app, server } = require('../src/app');
const db = require('../src/config/database');
const { generateTestToken } = require('./helpers/testHelper');

describe('Movie API Endpoints', () => {
    let createdMovieId;
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
    describe('GET /api/movies', () => {
        it('should get all movies with auth', async () => {
            const res = await request(app)
                .get('/api/movies')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
        });
        it('should return 401 without auth token', async () => {
            const res = await request(app).get('/api/movies');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('GET /api/movie/:id', () => {
        it('should get movie by id with auth', async () => {
            const res = await request(app)
                .get('/api/movie/1')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should return 404 for non-existent movie', async () => {
            const res = await request(app)
                .get('/api/movie/99999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
        it('should return 401 without auth token', async () => {
            const res = await request(app).get('/api/movie/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('POST /api/movie', () => {
        it('should create new movie with auth', async () => {
            const newMovie = {
                title: 'Test Movie for Delete',
                description: 'Test description',
                release_year: 2024,
                rating: 8.0,
                duration: 120,
                poster_url: 'https://example.com/poster.jpg',
                genre_ids: [1]
            };
            const res = await request(app)
                .post('/api/movie')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newMovie);
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('movie_id');
            createdMovieId = res.body.data.movie_id;
        });
        it('should return 401 without auth token', async () => {
            const newMovie = {
                title: 'Test Movie',
                description: 'Test',
                release_year: 2024,
                rating: 8.0,
                duration: 120,
                poster_url: 'https://example.com/poster.jpg'
            };
            const res = await request(app)
                .post('/api/movie')
                .send(newMovie);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('PATCH /api/movie/:id', () => {
        it('should update movie with auth', async () => {
            const movieIdToUpdate = createdMovieId || 1;
            const updateData = {
                title: 'Updated Movie Title',
                description: 'Updated description',
                release_year: 2024,
                rating: 9.0,
                duration: 120,
                poster_url: 'https://example.com/poster.jpg'
            };
            const res = await request(app)
                .patch(`/api/movie/${movieIdToUpdate}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should return 401 without auth token', async () => {
            const updateData = { title: 'Updated' };
            const res = await request(app)
                .patch('/api/movie/1')
                .send(updateData);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
    describe('DELETE /api/movie/:id', () => {
        it('should delete movie with auth', async () => {
            const movieIdToDelete = createdMovieId || 1;
            const res = await request(app)
                .delete(`/api/movie/${movieIdToDelete}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should return 404 when deleting non-existent movie', async () => {
            const res = await request(app)
                .delete('/api/movie/99999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
        it('should return 401 without auth token', async () => {
            const res = await request(app).delete('/api/movie/1');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});