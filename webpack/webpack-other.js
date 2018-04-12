const constant = require('../config/constant')

module.exports = {
  devtool: process.env.NODE_ENV === constant.DEVELOPMENT ? 'eval-source-map' : 'none',
  target: 'web'
}
