const express = require('express');
const path = require('path');
const program = require('commander');

program.option('--appId [appId]', 'the app Id of the app.');
program.option('--serverURL [serverURL]', 'the server url.');
program.option('--JSkey [JSkey]', 'the JS key.');
program.option('--RESTkey [RESTkey]', 'the REST key.');
program.option('--port [port]', 'the port to run Chisel');

program.parse(process.argv);

const port = program.port || process.env.PORT || 9000;

let configServerURL = program.serverURL || process.env.REACT_APP_CHISEL_SERVER_URL || "http://localhost:1337/parse";
let configAppId = program.appId || process.env.REACT_APP_CHISEL_APP_ID || "d5701a37cf242d5ee398005d997e4229";
let configJSkey = program.JSkey || process.env.CHISEL_JS_KEY;
let configRESTkey = program.RESTkey || process.env.CHISEL_REST_KEY;


let server = new express();

server.use('/', express.static(path.resolve(__dirname, '../dist')));

server.get('/chisel-config.json', (req, res) => {
  let response = {configServerURL, configAppId, configJSkey, configRESTkey};
  return res.json(response);
});

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
);

server.listen(port, error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening at http://localhost:%s/", port);
});