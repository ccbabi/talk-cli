const path = require('path')
const isPlainObject = require('is-plain-object')
const relative = require('../lib/relative')
const helper = require('../webpack/webpack-helper')
const plugins = require('../webpack/webpack-plugins')
const module_ = require('../webpack/webpack-module')

const { getConfig } = require('../config')

const config = getConfig()
const cmdModules = relative.cmd('node_modules')
const cwdModules = relative.cwd(config.__projectPath, 'node_modules')
const libModules = relative.cwd(config.__projectPath, 'src/lib')
const baseEntry = {}
let resolveAlias = {}

if (isPlainObject(config.alias)) {
  resolveAlias = Object.keys(config.alias).map(key => {
    return { key: relative.cwd(config.__projectPath, config.alias[key]) }
  })
}

if (config.normalizeCss) {
  baseEntry.base = ['normalize.css']
}

if (Array.isArray(config.base) && config.base.length) {
  baseEntry.base = baseEntry.base.concat(config.base)
}

module.exports = {
  entry: {
    ...helper.entry,
    ...baseEntry
  },
  output: {
    path: path.isAbsolute(config.dest)
      ? config.dest
      : relative.cwd(config.__projectPath, config.dest),
    filename: `js/[name].js${config.__env === 'production' ? '?v=[chunkhash:7]' : ''}`,
    chunkFilename: 'js/[name]-[chunkhash:7].js',
    publicPath: config.publicPath
  },
  module: module_,
  plugins,
  resolve: {
    modules: [ cmdModules, cwdModules, libModules ],
    alias: {
      '@': relative.cwd(config.__projectPath, 'src'),
      ...resolveAlias
    },
    extensions: ['.js', '.vue', '.jsx', '.ts', '.tsx']
  },
  resolveLoader: {
    modules: [ cmdModules, cwdModules ]
  },
  devtool: config.__env === 'development'
    ? 'cheap-module-eval-source-map'
    : 'none',
  externals: config.externals,
  performance: {
    hints: config.__env === 'production' ? 'warning' : false,
    maxEntrypointSize: 400000,
    maxAssetSize: 200000,
    assetFilter: assetFilename => {
      return (/\.(?:css|js)$/.test(assetFilename))
    }
  }
}
