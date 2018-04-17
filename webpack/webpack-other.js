const constant = require('../config/constant')

module.exports = {
  devtool: process.env.NODE_ENV === constant.DEVELOPMENT ? 'source-map' : 'none',
  target: 'web',
  externals: {
    jquery: 'jQuery',
    vue: 'Vue'
  }
}
