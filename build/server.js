const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const history = require('connect-history-api-fallback');

const config = require('./webpack.dev.config');


let server = new express();
let port = process.env.PORT || 9000;

server.use(history());

let compiler = webpack(config);
server.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}));
server.use(webpackHotMiddleware(compiler));

// serve pure static assets
server.use('/', express.static('./static'));


server.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening at http://localhost:%s/", port);
});
