const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')
const constant = require('../config/constant')
const config = require('../config')
const logger = require('../lib/logger')

process.NODE_ENV = constant.DEVELOPMENT

module.exports = (project, option) => {
  const webpackConfig = require('../webpack')
  const devOption = require('../webpack/webpack-server')

  const compiler = Webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, devOption)

  server.listen(config.port, '0.0.0.0', () => {
    const host = `${config.https ? 'https' : 'http'}://127.0.0.1:${config.port}`
    logger.success(`服务器启动在：${host}`)
    option.open && opn(host)
  })
}
