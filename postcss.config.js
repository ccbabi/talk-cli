const config = require('./config')

module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: config.browsers })
  ]
}
