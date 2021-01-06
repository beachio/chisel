const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: ['index'],
  output: {
    path: path.join(__dirname, './dist'),
  },
  resolve: {
    modules: ['electron/server-selector/src', 'src', 'node_modules'],
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.pug'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: 'assets/images/[name].[ext]'
        },
        type: 'javascript/auto'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: 'assets/fonts/[name].[hash:7].[ext]'
        },
        type: 'javascript/auto'
      }
    ]
  },
  stats: {
    colors: true,
    chunks: false
  }
};
