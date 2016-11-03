const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.dev.config');


let app = new express();
let port = process.env.PORT || 3000;

let compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}));
app.use(webpackHotMiddleware(compiler));

// serve pure static assets
app.use('/', express.static('./static'));

/*
app.get("/", (req, res) => {
  res.sendFile(__dirname + '../index.html');
});
*/

app.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening at http://localhost:%s/", port);
});
