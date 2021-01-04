const webpack = require('webpack');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const baseWebpackConfig = require('./webpack.base.config');


process.env.NODE_ENV = 'development';

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    })
  ],
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
