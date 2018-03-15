const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')
const constant = require('../config/constant')
const config = require('../config')
const logger = require('../lib/logger')
const host = require('../lib/host')

process.NODE_ENV = constant.DEVELOPMENT

module.exports = (project, option) => {
  const webpackConfig = require('../webpack')
  const devOption = require('../webpack/webpack-server')
  const helper = require('../webpack/webpack-helper')

  const pageName = option.page

  if (pageName !== 'nav' && !~helper.navPages.indexOf(pageName)) {
    logger.error('Oops, 打开的页面不存在！')
    process.exit(1)
  }
  const compiler = Webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, devOption)
  const origin = `${config.https ? 'https' : 'http'}://${host[0]}:${config.port}`
  const pathname = pageName !== 'nav' ? `/${pageName}.html` : ''

  server.listen(config.port, '0.0.0.0', () => {
    logger.success(`服务器启动在:`)
    host.forEach(h => void logger.success(`${config.https ? 'https' : 'http'}://${h}:${config.port}`));

    (option.open || option.page !== 'nav') && opn(origin + pathname)
  })
}
