const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const constant = require('../config/constant')
const config = require('../config')
const logger = require('../lib/logger')

process.NODE_ENV = constant.DEVELOPMENT

module.exports = (project) => {
  const webpackConfig = require('../webpack')
  const option = require('../webpack/webpack-server')

  const compiler = Webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, option)

  server.listen(config.port, '0.0.0.0', () => {
    logger.success(`服务器启动在：${config.https ? 'https' : 'http'}://127.0.0.1:${config.port}`)
  })
}
