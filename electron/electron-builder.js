module.exports = {
  appId: "com.beachio.chisel-cms",
  productName: "Chisel CMS",
  files: [
    "package.json",
    {
      from: "electron/dist",
      to: "dist"
    },
    "electron/electron.js",
    {
      from: "electron/server-selector/build",
      to: "server-selector"
    },
    "!node_modules/**/*",
    "node_modules/electron-is-dev/**/*"
  ],
  directories: {
    output: 'electron/bin',
    buildResources: 'electron/build-resources'
  },
  extraMetadata: {
    main: "electron/electron.js"
  },
  linux: {
    category: "Network"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};