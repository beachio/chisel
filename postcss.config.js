module.exports = ({file, options, env}) => {

  if (file.extname === '.sss')
    return {
      parser: 'sugarss',
      plugins: {
        'postcss-flexibility': {},
        'postcss-flexbugs-fixes': {},
        'autoprefixer': {},
        'precss': {}
      }
    };

  else
    return {
      plugins: {
        'postcss-flexibility': {},
        'postcss-flexbugs-fixes': {},
        'autoprefixer': {}
      }
    };
};