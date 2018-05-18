const { getConfig } = require('./config')
const config = getConfig()
const plugins = [
  require('autoprefixer')({ browsers: config.browsers })
]

if (config.toRem) {
  plugins.push(require('postcss-pxtorem')(config.toRemOption))
}

module.exports = { plugins }
