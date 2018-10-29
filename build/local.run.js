const express = require('express');
const path = require('path');
const program = require('commander');


program.option('--appId [appId]', 'the app Id of the app.');
program.option('--serverURL [serverURL]', 'the server url.');
program.option('--port [port]', 'the port to run Chisel');

program.parse(process.argv);

const port            = program.port || process.env.PORT || 9000;
const configServerURL = program.serverURL;
const configAppId     = program.appId;


const server = new express();

server.use('/', express.static(path.resolve(__dirname, '../dist')));

server.get('/chisel-config.json', (req, res) => {
  const response = {configServerURL, configAppId};
  return res.json(response);
});

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
);

server.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info(`==> Listening at http://localhost:${port}/`);
});