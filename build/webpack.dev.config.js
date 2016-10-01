const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.config');


module.exports = merge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  entry: ['webpack-hot-middleware/client?reload=true'],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.global\.sss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss-loader?parser=sugarss'
        ]
      },
      {
        test: /^((?!\.global).)*\.sss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&localIdentName==[name]---[local]---[hash:base64:5]&importLoaders=1',
          'postcss-loader?parser=sugarss'
        ]
      }
    ]
  }
});
