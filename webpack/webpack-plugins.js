const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ReloadPlugin = require('reload-html-webpack-plugin')
const helper = require('./webpack-helper')
const config = require('../config')
const constant = require('../config/constant')

const plugins = [
  ...helper.htmlPlugins,
  ...helper.appPlugins,
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.NODE_ENV)
    }
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: process.NODE_ENV === constant.DEVELOPMENT,
    allChunks: true
  })
]

if (process.NODE_ENV !== constant.PRODUCTION) {
  plugins.push(
    new ReloadPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  if (config.uglify) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.ProgressPlugin()
    )
  }
}

module.exports = plugins
