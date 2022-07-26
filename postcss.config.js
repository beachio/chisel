module.exports = ({file, options, env}) => {
  const res = {
    plugins: []
  };

  let extname;
  if (file.extname)
    extname = file.extname;
  else
    extname = file.substring(file.lastIndexOf('.'));

  if (extname === '.sss') {
    res.parser = 'sugarss';
    res.plugins.push(require('postcss-nested'));
    res.plugins.push(require('postcss-advanced-variables'));
  }

  res.plugins.push(
    require('postcss-flexbugs-fixes'),
    require('autoprefixer')
  );

  if (env == 'production')
    res.plugins.push(require('cssnano')({
      preset: ['default', {
        discardEmpty: false,
      }]
    }));

  return res;
};
