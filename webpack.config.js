const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dst')
  }
};
