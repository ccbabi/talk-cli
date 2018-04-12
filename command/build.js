const fs = require('fs')
const webpack = require('webpack')
const rimraf = require('rimraf')
const Pea = require('pea-js').default
const constant = require('../config/constant')
const logger = require('../lib/logger')
const relative = require('../lib/relative')

process.env.NODE_ENV = constant.PRODUCTION

module.exports = option => {
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

    const compiler = webpack(webpackConfig)
    const pattern = option.watch ? 'watch' : 'run'
    compiler[pattern]((err, stats) => {
      if (err) {
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
        process.exit(1)
      }

      const info = stats.toJson()

      if (stats.hasErrors()) {
        console.error(info.errors)
        console.error(info.errorDetails)
        process.exit(1)
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings)
        process.exit(1)
      }

      logger.success('打包完成')
    })
  }).start()
}
