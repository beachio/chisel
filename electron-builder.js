module.exports = {
  appId: "com.beachio.chisel-cms",
  files: [
    "dist/**/*",
    "!node_modules/**/*",
    "node_modules/electron-is-dev/**/*"
  ],
  directories: {
    output: 'electron-build'
  },
  extraMetadata: {
    main: "dist/electron.js"
  }
};