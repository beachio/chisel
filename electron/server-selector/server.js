const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const history = require('connect-history-api-fallback');


const config = require('./webpack.dev.config');

const port = process.env.PORT || 9900;

const server = new express();

server.use(history());

const compiler = webpack(config);
server.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}));
server.use(webpackHotMiddleware(compiler));


server.listen(port, error => {
  if (error) {
    console.error(error);
    return;
  }

  console.info("==> Listening at http://localhost:%s/", port);
});
