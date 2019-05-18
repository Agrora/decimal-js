
module.exports = {
    globals: {
        'ts-jest': {
            isolatedModules: false,
            babelConfig: false,
            tsConfig: '<rootDir>/tsconfig.json'
        }
    },
    roots: ['<rootDir>/tests'],
    collectCoverage: true,
    coverageReporters: ['text'],
    transform: {"\\.ts$": "ts-jest"},
    testRegex: "\\.test\\.ts$",
    snapshotResolver: '<rootDir>/jest.snapshot-resolver.js',
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    moduleFileExtensions: ["ts", "js", "json", "node"]
};
