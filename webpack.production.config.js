'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    'whatwg-fetch',
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[hash].min.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(ttf|woff|eot|css)$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'client'),
        exclude: /node_modules/
      },
      {
        test: /\.json?$/,
        loader: 'json'
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
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      assets:     'src/assets',
      components: 'src/components',
      containers: 'src/containers',
      ducks:      'src/ducks',
      middleware: 'src/middleware',
      models:     'src/models',
      store:      'src/store',
      utils:      'src/utils'
    },
    extensions: ['', '.js', '.jsx']
  },
  postcss: function () {
    return [
      require('autoprefixer')(),
      require('postcss-nested-props')(),
      require('precss')(),
      require('postcss-font-magician')()
    ];
  }
};
