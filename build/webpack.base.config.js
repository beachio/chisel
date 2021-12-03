const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: ['index'],
  output: {
    path: path.join(__dirname, '../dist/'),
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js'],
    fallback: {
      crypto: false
    }
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
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024
          }
        },
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024
          }
        },
        generator: {
          filename: 'assets/fonts/[name].[hash:7][ext]'
        }
      }
    ]
  },
  stats: {
    colors: true,
    chunks: false
  }
};
