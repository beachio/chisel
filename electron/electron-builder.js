require('dotenv').config();

const pkgMain = require('../package.json');

module.exports = {
  appId: "io.beach.chisel-cms",
  productName: "Chisel CMS",
  copyright: "Copyright © 2021, Beach.io",
  extraMetadata: {
    name:        pkgMain.name,
    version:     pkgMain.version,
    description: pkgMain.description,
    author:      pkgMain.author,
    license:     pkgMain.license,
    homepage:    pkgMain.homepage,
    repository:  pkgMain.repository,
    bugs:        pkgMain.bugs,

    main: "electron/electron.js"
  },
  directories: {
    output: 'electron/bin',
    buildResources: 'electron/build-resources',
    app: "electron"
  },
  files: [
    "package.json",
    "dist",
    {
      filter: "electron.js",
      to: "electron"
    },
    {
      from: "server-selector/dist",
      to: "server-selector"
    }
  ],
  mac: {
    category: "public.app-category.developer-tools",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "electron/build-resources/entitlements.mac.plist",
    entitlementsInherit: "electron/build-resources/entitlements.mac.plist",
    extendInfo: {
      'NSUserNotificationAlertStyle': 'alert'
    }
  },
  dmg: {
    sign: false
  },
  linux: {
    category: "Network"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  },
  publish: {
    provider: 'github',
    releaseType: 'draft'
  },
  asar: true,
  afterSign: "electron/notarize.js"
};