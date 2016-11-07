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
      template: 'src/index.pug',
      inject: true,
      filename: 'index.html',
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.pug$/,
        loader: 'pug'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 3000,
          name: 'assets/images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 3000,
          name: 'assets/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
  },
  postcss: function () {
    return [
      require('postcss-flexibility'),
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')(),
      require('precss')()
    ];
  }
};
