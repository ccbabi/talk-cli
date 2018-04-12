const relative = require('../lib/relative')

const pkgPath = relative.cwd('./package.json')

const defaultConfig = {
  multiple: false,
  uglify: true,
  provide: null,
  define: null,
  noInfo: true,
  https: false,
  port: 1234,
  mockDir: 'mock',
  context: '/api',
  callback: 'callback',
  target: null,
  changeOrigin: true,
  static: '/static',
  staticDir: 'static',
  alias: {},
  minimize: true,
  browsers: [
    '> 1%',
    'last 2 versions',
    'ie >= 8'
  ]
}

let packageConfig

try {
  packageConfig = require(pkgPath).talk
} catch (e) {
  packageConfig = {}
}

module.exports = {
  ...defaultConfig,
  ...packageConfig
}
