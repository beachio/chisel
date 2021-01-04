const {merge} = require('webpack-merge');
const path = require('path');

const prodWebpackConfig = require('./webpack.prod.config');

module.exports = merge(prodWebpackConfig, {
  output: {
    path: path.join(__dirname, '../electron/dist/'),
    publicPath: './'
  },
  target: 'electron-renderer'
});