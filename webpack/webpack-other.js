const constant = require('../config/constant')

module.exports = {
  devtool: process.NODE_ENV === constant.DEVELOPMENT ? 'eval-source-map' : 'none'
}
