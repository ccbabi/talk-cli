const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const constant = require('../config/constant')

process.NODE_ENV = constant.DEVELOPMENT

module.exports = (project) => {
  const config = require('../webpack')
  const option = require('../webpack/webpack-server')

  const compiler = Webpack(config)
  const server = new WebpackDevServer(compiler, option)

  server.listen(8080, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:8080')
  })
}
