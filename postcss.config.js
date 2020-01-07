module.exports = ({file, options, env}) => {
  const res = {
    plugins: []
  };

  if (file.extname === '.sss') {
    res.parser = 'sugarss';
    res.plugins.push(require('precss'));
  }

  res.plugins.push(
    require('postcss-flexibility'),
    require('postcss-flexbugs-fixes'),
    require('autoprefixer')
  );

  if (env == 'production')
    res.plugins.push(require('cssnano'));

  return res;
};