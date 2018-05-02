const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')

module.exports = () => {
  const { getConfig } = require('../config')
  const logger = require('../lib/logger')
  const host = require('../lib/host')
  const webpackConfig = require('../webpack')
  const devOption = require('../webpack/webpack-server')

  const config = getConfig()
  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, devOption)

  server.listen(config.port, '0.0.0.0', () => {
    logger.success(`服务器启动在:`)
    host.forEach(h => void logger.success(getUrl(h)))
    config.open && opn(getUrl(host[0]))
  })

  function getUrl (host) {
    return `${config.https ? 'https' : 'http'}://${host}:${config.port}`
  }
}
