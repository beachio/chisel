const express = require('express');
const path = require('path');

let port = process.env.PORT || 9000;

let server = new express();

server.use('/', express.static(path.resolve(__dirname, '../dist')));

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
);

server.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening at http://localhost:%s/", port);
});