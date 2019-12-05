module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: {
          version: '3.3',
          proposals: true
        }
      }
    ],
    "@babel/preset-react"
  ],

  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",

    ["@babel/plugin-proposal-decorators", {legacy: true}],
    ["@babel/plugin-proposal-class-properties", {loose: true}],

    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    ["@babel/plugin-transform-runtime", {useESModules: true}],

    "babel-plugin-lodash",
    "react-hot-loader/babel"
  ]
};
