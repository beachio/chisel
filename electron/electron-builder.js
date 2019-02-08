module.exports = {
  appId: "com.beachio.chisel-cms",
  productName: "Chisel CMS",
  files: [
    "dist/**/*",
    "electron/electron.js",
    "!node_modules/**/*",
    "node_modules/electron-is-dev/**/*"
  ],
  directories: {
    output: 'electron/build',
    buildResources: 'electron/build-resources'
  },
  extraMetadata: {
    main: "electron/electron.js"
  }
};