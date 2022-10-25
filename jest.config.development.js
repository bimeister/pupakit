module.exports = {
  verbose: true,
  collectCoverage: true,
  setupFiles: ['./jest.setup.js'],
  rootDir: './',
  roots: ['<rootDir>/projects/kit/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  moduleNameMapper: {
    '^@bimeister/utilities/.*$': '<rootDir>/../../node_modules/@bimeister/utilities',
  },
};
