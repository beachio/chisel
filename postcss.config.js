module.exports = ({file, options, env}) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: [
    require('postcss-flexibility'),
    require('postcss-flexbugs-fixes'),
    require('autoprefixer'),
    require('precss')
  ]
});