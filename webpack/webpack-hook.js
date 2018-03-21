const fs = require('fs')
const bodyParser = require('body-parser')
const connectMockMiddleware = require('connect-mock-middleware')
const httpProxyMiddleware = require('http-proxy-middleware')
const serveStatic = require('serve-static')
const relative = require('../lib/relative')
const config = require('../config')
const opt = require('../config/option')
const logger = require('../lib/logger')

const mockDir = relative.cwd(config.mockDir)
const staticDir = relative.cwd(config.staticDir)
const proxy = opt.get('proxy')

exports.before = function (app) {
  if (!proxy && fs.existsSync(mockDir)) {
    logger.info('Mock服务已开启')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(connectMockMiddleware(mockDir, {
      prefix: config.context,
      callback: config.callback
    }))
  }

  if (proxy && config.target) {
    logger.info('联调模式已开启')
    app.use(config.context, httpProxyMiddleware({
      target: config.target,
      changeOrigin: config.changeOrigin,
      secure: !!config.https
    }))
  }
}

exports.after = function (app) {
  if (fs.existsSync(staticDir)) {
    app.use(config.static, serveStatic(staticDir))
  }
}
