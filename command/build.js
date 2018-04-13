const fs = require('fs')
const webpack = require('webpack')
const rimraf = require('rimraf')
const Pea = require('pea-js').default
const constant = require('../config/constant')
const relative = require('../lib/relative')

process.env.NODE_ENV = constant.PRODUCTION

module.exports = option => {
  const webpackConfig = require('../webpack')
  const distPath = relative.cwd('dist')
  const distExists = fs.existsSync(distPath)
  const ctrl = new Pea()

  ctrl.use(next => {
    if (!distExists) return next()
    rimraf(distPath, next)
  }).use(() => {
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

      console.log('=^_^=')
    })
  }).start()
}
