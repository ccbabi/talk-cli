const ExtractTextPlugin = require('extract-text-webpack-plugin')
const relative = require('../lib/relative')
const config = require('../config')
const constant = require('../config/constant')

module.exports = function (loaderName, isVue) {
  const loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: config.minimize && process.env.NODE_ENV === constant.PRODUCTION
    }
  }, {
    loader: 'postcss-loader',
    options: {
      config: {
        path: relative.cmd('postcss.config.js')
      },
      sourceMap: true
    }
  }]

  if (loaderName && loaderName !== 'css') {
    loaders.push({
      loader: `${loaderName}-loader`
    })
  }

  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: isVue ? 'vue-style-loader' : 'style-loader'
  })
}
