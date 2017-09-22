const webpack = require('webpack');
const merge = require('webpack-merge');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');


module.exports = merge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  entry: ['webpack-hot-middleware/client?reload=true'],
  plugins: [
    new LodashModuleReplacementPlugin({
      'collections': true,
      'shorthands': true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.global\.sss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /^((?!\.global).)*\.sss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: "[name]---[local]---[hash:base64:5]",
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
});
