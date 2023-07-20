module.exports = (ctx) => ({
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'postcss-nested': {},
    // 'postcss-cssnext': {
      // browsers: ['last 2 versions', '> 5%'],
      // 'cssnano': ctx.env === 'production' ? {} : false
    // },
  },
});