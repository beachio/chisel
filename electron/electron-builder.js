require('dotenv').config();

const pkgMain = require('../package.json');

module.exports = {
  appId: "io.beach.chisel-cms",
  productName: "Chisel CMS",
  copyright: "Copyright © 2021, Beach.io",
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
  directories: {
    output: 'electron/bin',
    buildResources: 'electron/build-resources',
    app: "electron"
  },
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
  mac: {
    category: "public.app-category.developer-tools"
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
  asar: true
};