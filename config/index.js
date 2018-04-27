const defaultConfig = require('./default')
const fileConfig = require('./file')

let config = {
  ...defaultConfig,
  ...fileConfig
}

module.exports = {
  getConfig (key) {
    return key ? config[key] : config
  },

  setConfig (cfg) {
    config = { ...config, ...cfg }
  }
}
