module.exports = {
  appId: "com.beachio.chisel-cms",
  productName: "Chisel CMS",
  files: [
    "dist/**/*",
    "electron/electron.js",
    {
      from: "electron/server-selector/build",
      to: "server-selector"
    },
    "!node_modules/**/*",
    "node_modules/electron-is-dev/**/*"
  ],
  directories: {
    output: 'electron/build',
    buildResources: 'electron/build-resources'
  },
  extraMetadata: {
    main: "electron/electron.js"
  },
  linux: {
    category: "Network",
    icon: "icon.png"
  },
  nsis: {
    oneClick: false
  }
};