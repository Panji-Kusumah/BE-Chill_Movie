const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files untuk uploads (consider protecting this route)
app.use('/uploads', express.static('uploads'));

// Routes
const movieRoutes = require('./routes/movieRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const genreRoutes = require('./routes/genreRoutes');
const packageRoutes = require('./routes/packageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api', movieRoutes);
app.use('/api', episodeRoutes);
app.use('/api', genreRoutes);
app.use('/api', packageRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Chill Movie API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            movies: '/api/movies',
            episodes: '/api/episodes',
            genres: '/api/genres',
            packages: '/api/packages'
        }
    });
});

// Error handling middleware (must be after all routes)
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

app.use(notFound);
app.use(errorHandler);

// Start server 
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };