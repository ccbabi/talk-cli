const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ReloadPlugin = require('reload-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const helper = require('./webpack-helper')
const config = require('../config')
const constant = require('../config/constant')
const relative = require('../lib/relative')

const assetsPath = relative.cwd('src/assets')

const plugins = [
  ...helper.htmlPlugins,
  ...helper.appPlugins,
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: process.env.NODE_ENV === constant.DEVELOPMENT,
    allChunks: true
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.ModuleConcatenationPlugin()
]

if (!config.multiple) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  )
}

// 只有一个页面，不提取公共JS
if (config.multiple && helper.navPages && helper.navPages.length > 1) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: helper.navPages
    })
  )
}

if (process.env.NODE_ENV !== constant.PRODUCTION) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
  if (fs.existsSync(assetsPath)) {
    plugins.push(
      new CopyWebpackPlugin({
        context: assetsPath,
        from: '**/*',
        toType: 'dir'
      })
    )
  }
  if (config.multiple) {
    plugins.push(new ReloadPlugin())
  }
} else {
  plugins.push(new webpack.ProgressPlugin())

  if (config.uglify) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        },
        output: {
          beautify: false,
          comments: false
        },
        ie8: config.multiple
      })
    )
  }
}

module.exports = plugins
