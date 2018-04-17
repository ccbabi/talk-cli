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
    const handler = (err, stats) => {
      if (err) {
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
        process.exit(1)
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error(info.errors.join(''))
        process.exit(1)
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings.join(''))
        process.exit(1)
      }
      if (option.watch) {
        console.log(`${new Date().toLocaleString()}: 打包完成`)
      } else {
        console.log('打包完成')
      }
    }

    if (option.watch) {
      compiler.watch({}, handler)
    } else {
      compiler.run(handler)
    }
  }).start()
}
