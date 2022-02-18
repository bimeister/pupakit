const randomBytes = require('randombytes');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arrayBuffer) => randomBytes(arrayBuffer.length),
  },
});
