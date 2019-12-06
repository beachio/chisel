const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const {exec} = require('child_process');

const config = require('./webpack.dev.config');


const port = process.env.PORT || 9000;

const server = new WebpackDevServer(
  webpack(config),
  {
    contentBase: path.join(__dirname, '../static/'),
    historyApiFallback: true,
    hot: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }
);

server.listen(port, 'localhost', error => {
  if (error) {
    console.error(error);
    return;
  }

  if (process.env.RUN_ELECTRON)
    exec('electron .', (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log(`stdout: ${stdout}`);
      console.warn(`stderr: ${stderr}`);
    });
});
