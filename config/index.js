const defaultConfig = require('./default')
const getFileConfig = require('./file')

let config = {
  ...defaultConfig
}

module.exports = {
  getConfig (key) {
    return key ? config[key] : config
  },

  setConfig (cfg) {
    config = {
      ...config,
      ...getFileConfig(cfg.__projectPath),
      ...cfg
    }
  }
}
