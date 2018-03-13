const relative = require('../lib/relative')
const config = require('../config')
const hooks = require('./webpack-hook')

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
  noInfo: config.noInfo,
  https: config.https,
  ...hooks
}
