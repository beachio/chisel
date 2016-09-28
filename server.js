const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config');


let app = new express();
let port = 3000;

let compiler = webpack(config);
app.use(webpackDevMiddleware(compiler,
  {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening on port %s, open http://localhost:%s/", port, port);
});
