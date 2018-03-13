const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isPlainObject = require('is-plain-object')
const entryInfos = require('./webpack-entry')
const constant = require('../config/constant')
const config = require('../config')

function getEntry () {
  return entryInfos.reduce((webpackEntry, entryInfo) => {
    const { entryExists, pageName, entry } = entryInfo
    if (entryExists) webpackEntry[pageName] = entry
    return webpackEntry
  }, {})
}

function getHtmlPlugins () {
  return entryInfos.reduce((plugins, entryInfo) => {
    const { entryExists, template, templateExists, pageName } = entryInfo
    let htmlOption

    if (!entryExists && !templateExists) return plugins

    htmlOption = {
      title: pageName,
      filename: process.NODE_ENV === constant.DEVELOPMENT ? `${pageName}.html` : `html/${pageName}.html`,
      minify: false
    }

    if (templateExists) {
      htmlOption.template = template
    }

    if (!entryExists) {
      htmlOption.inject = false
    } else {
      htmlOption.chunks = [pageName]
    }

    plugins.push(new HtmlWebpackPlugin(htmlOption))

    return plugins
  }, [])
}

function getAppPlugins () {
  const plugin = []
  if (isPlainObject(config.provide)) {
    plugin.push(new webpack.ProvidePlugin(config.provide))
  }
  if (isPlainObject(config.define)) {
    plugin.push(new webpack.DefinePlugin(config.define))
  }
  return plugin
}

module.exports = {
  entry: getEntry(),
  htmlPlugins: getHtmlPlugins(),
  appPlugins: getAppPlugins()
}
