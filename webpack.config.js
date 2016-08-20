'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'whatwg-fetch',
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.(ttf|woff|eot|css)$/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.json?$/,
        loader: 'json'
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
