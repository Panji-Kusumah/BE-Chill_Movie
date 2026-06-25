module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(uuid)/)'
    ]
};