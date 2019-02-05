module.exports = {
  appId: "com.beachio.chisel-cms",
  asar: false,
  files: [
    "dist/**/*",
    //"!node_modules/**/*"
  ],
  directories: {
    output: 'electron-build'
  },
  extraMetadata: {
    main: "dist/electron.js"
  }
};