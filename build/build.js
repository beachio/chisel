require('shelljs/global');
const path = require('path');
const ora = require('ora');
const webpack = require('webpack');

const webpackConfig = require('./webpack.prod.config');


let spinner = ora('building for production...');
spinner.start();

let destPath = path.resolve(__dirname, '../dist');
rm('-rf', destPath);
mkdir('-p', destPath);
cp('-R', 'static/*', destPath);

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err)
    throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n');
});
