Chisel
=====================

> An API-first CMS for Parse Server

## Pre-requisites

First off, before you can run Chisel, you need  [our Parse Server setup](https://github.com/beachio/chisel-parse-server-starter).

There's lots of options for setting up Parse Server, from running it on your local device, to deploying to many easy to setup hosting services.

Make a note of your Parse Server URL and your App ID, you will need it to start Chisel.

# Chisel Setup Options

## Build from Repository

You can run Chisel from this Github repository.

Clone the repo

```bash
git clone <repo>
cd chisel
```

Then setup dependencies:

``` bash
# install dependencies
npm install
```

Then run:

```
# serve development build with hot reload at localhost:9000
npm run start_dev

# executes production build with minification, used by NPM method
npm local_run

# serve build for production
npm run build
```

See below how to setup connection parameters.

## Install from NPM

Parse Server is available via [NPM](https://www.npmjs.com/package/chisel-cms)

``` bash
npm install -g chisel-cms
```

to run Chisel

``` bash
chisel-cms --appId <APP_ID> --serverURL <https://YOUR_SERVER.com/parse>
```
Visit your preferred browser on http://localhost:9000

## Parameters
There are several parameters of Chisel:
- Port — server port for local run or development run.
- Parse Server URL
- Application ID — ID of application at the Parse Server
- JS key, REST key — keys for queries to the Parse Server. As a rule, JS key and REST key are not using now.

Ways of setup them (descending priority):
- Parameters of command line (for local run)
- Parameters in `process.env`
- Defaults (defined in ConnectConstants.js)

Parameter names:

| Parameter | Command line | chisel-config.json  | process.env  | Default |
| --- | --- | --- | --- | --- |
| Port | --port | – | PORT | 9000 |
| Parse Server URL | --serverURL | configServerURL | REACT_APP_SERVER_URL | http://localhost:1337/parse |
| Application ID | --appId | configAppId | REACT_APP_APP_ID | SampleAppId |
| JS key | --JSkey | configJSkey | JS_KEY | – |
| REST key | --RESTkey | configRESTkey | REST_KEY | – |


## Publishing Chisel

Chisel can be compiled and served via a Static Site hosting platform, such as our own Forge service.

If you are running Chisel from a cloned repository, you can

``` bash
npm run build
```

This will output a Build folder, which can be uploaded to a Forge site.

You could also fork Chisel and link the Github repo to your Forge site and auto-deploy from Github.

You could also push up the Chisel project folder and let Forge's Webpack build service compile and deploy the Chisel site for you

Many options to suit your workflow.
