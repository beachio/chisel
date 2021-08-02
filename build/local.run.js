const express = require('express');
const path = require('path');
const program = require('commander');


program.option('--appId [appId]', 'the app Id of the app.');
program.option('--serverURL [serverURL]', 'the server url.');
program.option('--JSkey [JSkey]', 'the JS key.');
program.option('--RESTkey [RESTkey]', 'the REST key.');
program.option('--port [port]', 'the port to run Chisel');

program.parse(process.argv);
const options = program.opts();

const port            = options.port || process.env.PORT || 9000;
const configServerURL = options.serverURL;
const configAppId     = options.appId;
const configJSkey     = options.JSkey;
const configRESTkey   = options.RESTkey;


const server = new express();

server.use('/', express.static(path.resolve(__dirname, '../dist')));

server.get('/chisel-config.json', (req, res) => {
  const response = {configServerURL, configAppId, configJSkey, configRESTkey};
  return res.json(response);
});

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
);

server.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info(`==> Listening at http://localhost:${port}/`);
});
