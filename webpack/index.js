const relative = require('../lib/relative')
const plugins = require('../webpack/webpack-plugins')
const helper = require('../webpack/webpack-helper')
const module_ = require('../webpack/webpack-module')
const other = require('../webpack/webpack-other')
const config = require('../config')

const cmdModules = relative.cmd('node_modules')
const cwdModules = relative.cwd('node_modules')

module.exports = {
  entry: helper.entry,
  output: {
    path: relative.cwd('dist'),
    filename: 'js/[name].js',
    publicPath: config.multiple ? '../' : './'
  },
  module: module_,
  plugins,
  resolve: {
    modules: [ cmdModules, cwdModules ],
    mainFields: ['main'],
    alias: {
      '@': relative.cwd('src'),
      ...config.alias
    },
    extensions: ['.js', '.vue', '.jsx', '.ts', '.tsx']
  },
  resolveLoader: {
    modules: [ cmdModules, cwdModules ]
  },
  ...other
}
