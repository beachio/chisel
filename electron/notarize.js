require('dotenv').config();
const {notarize} = require('electron-notarize');
const electronBuilderConfig = require('./electron-builder.js');

exports.default = async context => {
  const {electronPlatformName, appOutDir} = context;
  if (electronPlatformName !== 'darwin')
    return;

  const appName = context.packager.appInfo.productFilename;
  console.log('STARTING NOTARIZATION');

  return await notarize({
    appBundleId: electronBuilderConfig.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
    ascProvider: process.env.APPLE_PROVIDER
  });
};
