var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'foxagram'
    },
    port: process.env.PORT || 3000,
    db: 'postgresql://postgres:doprocks@45.55.7.118:5432/foxagramdb',
    TOKEN_SECRET: 'coldnessbitch'
  },

  test: {
    root: rootPath,
    app: {
      name: 'foxagram'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/foxagram-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'foxagram'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/foxagram-production'
  }
};

module.exports = config[env];
