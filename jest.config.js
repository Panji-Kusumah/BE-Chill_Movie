module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    moduleNameMapper: {
        '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js'
    }
};