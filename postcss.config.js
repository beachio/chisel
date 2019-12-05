module.exports = ({file, options, env}) => {
  const res = {
    plugins: [
      require('postcss-flexibility'),
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')
    ]
  };

  if (env == 'production')
    res.plugins.unshift(require('cssnano'));

  if (file.extname === '.sss') {
    res.parser = 'sugarss';
    res.plugins.push(require('precss'));
  }

  return res;
};