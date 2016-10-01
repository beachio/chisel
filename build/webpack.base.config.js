const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: ['index'],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin()
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
        test: /\.json?$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
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
