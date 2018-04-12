const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isPlainObject = require('is-plain-object')
const entryInfos = require('./webpack-entry')
const constant = require('../config/constant')
const config = require('../config')
const relative = require('../lib/relative')

function getEntry () {
  return entryInfos.reduce((webpackEntry, entryInfo) => {
    const { entryExists, pageName, entry } = entryInfo
    if (entryExists) {
      const newEntry = [ entry ]
      if (!config.multiple) {
        newEntry.unshift('babel-polyfill')
        if (process.env.NODE_ENV === constant.DEVELOPMENT) {
          newEntry.unshift(
            'webpack/hot/only-dev-server',
            `webpack-dev-server/client?${config.https ? 'https' : 'http'}://0.0.0.0:${config.port}/`,
          )
        }
        if (process.env.NODE_ENV === constant.PRODUCTION) {
          // newEntry.unshift(relative.cmd('lib/public-path'))
        }
      }
      webpackEntry[pageName] = newEntry
    }
    return webpackEntry
  }, {})
}

function getHtmlPlugins () {
  const plugins = entryInfos.reduce((plugins, entryInfo) => {
    const { entryExists, template, templateExists, pageName } = entryInfo
    let htmlOption

    if (!entryExists && !templateExists) return plugins

    htmlOption = {
      title: pageName,
      filename: (function () {
        if (process.env.NODE_ENV === constant.DEVELOPMENT || !config.multiple) {
          return `${pageName}.html`
        }

        return `html/${pageName}.html`
      })(),
      minify: {
        removeComments: true
      }
    }

    if (templateExists) {
      htmlOption.template = template
    }

    if (!entryExists) {
      htmlOption.inject = false
    } else {
      htmlOption.chunks = ['main', 'common', pageName]
    }

    if (!config.multiple) {
      htmlOption.inject = true
      delete htmlOption.chunks
    }

    plugins.push(new HtmlWebpackPlugin(htmlOption))

    return plugins
  }, [])

  if (process.env.NODE_ENV !== constant.PRODUCTION && config.multiple) {
    plugins.push(new HtmlWebpackPlugin({
      title: '51Talk - 开发导航页',
      filename: 'nav.html',
      template: relative.cmd('template', 'nav.ejs'),
      inject: false,
      pages: getNavPages()
    }))
  }

  return plugins
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

function getNavPages () {
  return entryInfos.reduce((htmls, entryInfo) => {
    if (entryInfo.entryExists || entryInfo.templateExists) {
      htmls.push(entryInfo.pageName)
    }
    return htmls
  }, [])
}

module.exports = {
  entry: getEntry(),
  htmlPlugins: getHtmlPlugins(),
  appPlugins: getAppPlugins(),
  navPages: getNavPages()
}
