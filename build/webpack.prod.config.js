const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const StatsPlugin = require('stats-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');


process.env.NODE_ENV = 'production';

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    })
    /*new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    })*/
  ],
  output: {
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.css$|\.global\.sss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /^((?!\.global).)*\.sss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: "[name]---[local]---[hash:base64:5]"
              },
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
});
