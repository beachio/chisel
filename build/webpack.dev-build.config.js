const webpack = require('webpack');
const merge = require('webpack-merge');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const baseWebpackConfig = require('./webpack.base.config');


module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: './'
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      'collections': true,
      'shorthands': true
    }),
    new ExtractTextPlugin({
      filename: '[name].min.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$|\.global\.sss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      },
      {
        test: /^((?!\.global).)*\.sss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        })
      }
    ]
  }
});
