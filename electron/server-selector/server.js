const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const config = require('./webpack.dev.config');


const port = process.env.PORT || 9900;

const server = new WebpackDevServer(
  webpack(config),
  {
    static: path.join(__dirname, './static/'),
    historyApiFallback: true,
    dev: {
      publicPath: config.output.publicPath
    }
  }
);

server.listen(port, 'localhost', error => {
  if (error) {
    console.error(error);
    return;
  }
});
