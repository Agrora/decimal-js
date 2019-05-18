
module.exports = {
    globals: {
        'ts-jest': {
            isolatedModules: false,
            babelConfig: false,
            tsConfig: '<rootDir>/tsconfig.json'
        }
    },
    roots: ['<rootDir>/tests'],
    coverageReporters: ['text', 'lcov'],
    transform: {"\\.ts$": "ts-jest"},
    testRegex: "\\.test\\.ts$",
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    moduleFileExtensions: ["ts", "js", "json", "node"]
};
