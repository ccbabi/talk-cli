const fs = require('fs')
const url = require('url')
const bodyParser = require('body-parser')
const connectMockMiddleware = require('connect-mock-middleware')
const httpProxyMiddleware = require('http-proxy-middleware')
const serveStatic = require('serve-static')
const isHttpUrl = require('is-http-url')
const relative = require('../lib/relative')
const { getConfig } = require('../config')
const logger = require('../lib/logger')

const config = getConfig()
const mockDir = relative.cwd(config.__projectPath, config.mockDir)
const staticDir = relative.cwd(config.__projectPath, config.staticDir)
const reIP4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
let up

exports.before = function (app) {
  if (!config.proxy && fs.existsSync(mockDir)) {
    logger.info('Mock服务已开启')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(connectMockMiddleware(mockDir, {
      prefix: config.mockContext,
      callback: config.mockCallback
    }))
  }

  if (config.proxy && config.target) {
    if (!/^https?:/.test(config.target)) {
      config.target = 'http://' + config.target
    }

    if (!isHttpUrl(config.target)) {
      logger.warning(`Oops, 指定的${config.target}无效！`)
      return
    }

    logger.info('联调模式已开启')
    up = url.parse(config.target)

    app.use(config.context, httpProxyMiddleware({
      target: config.target,
      changeOrigin: !reIP4.test(up.hostname),
      secure: false
    }))
  }
}

exports.after = function (app) {
  if (fs.existsSync(staticDir)) {
    app.use(config.staticContext, serveStatic(staticDir))
  }
}
