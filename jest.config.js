module.exports = {
  verbose: true,
  collectCoverage: true,
  reporters: [['jest-junit', { suiteName: 'Unit Tests', outputDirectory: 'coverage' }]],
  coverageDirectory: 'coverage'
};
