const relative = require('../lib/relative')

module.exports = {
  contentBase: relative.cwd('dist'),
  stats: {
    colors: true
  },
  inline: true,
  hot: true,
  overlay: {
    warnings: true,
    errors: true
  },
  noInfo: true
}
