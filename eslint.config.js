const gulpConfig = require('eslint-config-gulp');

module.exports = [
  {
    files: ["test/fixtures/*.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
