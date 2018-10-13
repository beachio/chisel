Chisel
=====================

> An API-first CMS for Parse Server

## Pre-requisites

First off, before you can run Chisel, you need a [Parse local server](https://github.com/beachio/chisel-parse-server-starter).

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

Then setup and run.

``` bash
# install dependencies
npm install
 
# serve with hot reload at localhost:3000
npm start
 
# build for production with minification
npm run build
```

To connect to remote server, you can set it URL in user's profile.

## Install from NPM

Parse Server is available via [NPM](https://www.npmjs.com/package/chisel-cms)

``` bash 
npm install -g chisel-cms
```

to run Chisel

``` bash
chisel-cms --appId <APP_ID> --serverURL <https://HEROKU_APP_NAME.herokuapp.com/parse>
```

if an authentication error

``` bash
chisel-cms --appId <APP_ID> --JSkey <clientKey> --serverURL <https://pg-app.scalabl.cloud/1/>
```

Visit your preferred browser on http://localhost:9000

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
