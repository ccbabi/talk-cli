const config = require('../config')
const opt = require('../config/option')
const hooks = require('./webpack-hook')
const helper = require('./webpack-helper')
const logger = require('../lib/logger')

const pageName = opt.get('page')

if (pageName !== 'nav' && !~helper.navPages.indexOf(pageName)) {
  logger.error('Oops, 打开的页面不存在！')
  process.exit(1)
}

module.exports = {
  contentBase: false,
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
  index: `${pageName}.html`,
  ...hooks
}
