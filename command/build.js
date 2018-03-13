const fs = require('fs')
const Webpack = require('webpack')
const rimraf = require('rimraf')
const Pea = require('pea-js').default
const constant = require('../config/constant')
const logger = require('../lib/logger')
const relative = require('../lib/relative')

process.NODE_ENV = constant.PRODUCTION

module.exports = () => {
  const webpackConfig = require('../webpack')
  const distPath = relative.cwd('dist')
  const distExists = fs.existsSync(distPath)
  const ctrl = new Pea()

  ctrl.use(next => {
    if (!distExists) return next()

    logger.info(`正在删除 ${distPath}`)
    rimraf(distPath, next)
  }).use(() => {
    distExists && logger.info(`已删除 ${distPath}`)
    Webpack(webpackConfig, (err, stats) => {
      if (err) {
        if (err.details) {
          return logger.error(err.details)
        }
        return logger.error(err.stack || err.message || err)
      }
      if (stats.hasErrors()) {
        const info = stats.toJson()
        return logger.error(info.errors)
      }
      logger.success('打包完成')
    })
  }).start()
}
