const packages = ['flow-doodle-core'];

const testMatches = []
const testMatchesLint = []

packages.forEach(pkg => {
    testMatches.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
    ])
    testMatchesLint.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(js|ts|tsx)',
        // '<rootDir>/' + pkg + '/src/**/*.(test|spec|d).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
    ])
})

const base = {
    transformIgnorePatterns: [
        'node_modules/?!(@flow-doodle)',
    ],
    /*transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },*/
    moduleNameMapper: {
        '^@flow-doodle(.*)$': '<rootDir>/flow-doodle/src$1',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?)$',
    ],
    verbose: true,
};

module.exports = {
    ...base,
    projects: [
        {
            displayName: 'test',
            ...base,
            testMatch: testMatches,
        },
        {
            displayName: 'lint',
            runner: 'jest-runner-eslint',
            ...base,
            testMatch: testMatchesLint,
        },
    ],
    coverageDirectory: '<rootDir>/../coverage',
};
