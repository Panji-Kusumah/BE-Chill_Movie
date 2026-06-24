module.exports = {
    testEnvironment: 'node',
    transformIgnorePatterns: [
        '/node_modules/(?!(uuid)/)'
    ],
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    moduleNameMapper: {
        '^uuid$': require.resolve('uuid')
    }
};

