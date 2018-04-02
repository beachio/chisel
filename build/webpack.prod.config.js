const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const StatsPlugin = require('stats-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');


module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.css'
    })
    /*new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    })*/
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
