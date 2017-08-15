const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');


module.exports = merge(baseWebpackConfig, {
  plugins: [
    new ExtractTextPlugin('[name].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader',
          'postcss-loader'
        ])
      },
      {
        test: /\.global\.sss$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader',
          'postcss-loader?parser=sugarss'
        ])
      },
      {
        test: /^((?!\.global).)*\.sss$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader?modules&localIdentName==[name]---[local]---[hash:base64:5]&importLoaders=1',
          'postcss-loader?parser=sugarss'
        ])
    }]
  }
});
