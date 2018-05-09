const defaultConfig = require('./default')
const getFileConfig = require('./file')

let dirty = false
let config = {
  ...defaultConfig
}

module.exports = {
  getConfig (key) {
    return key ? config[key] : config
  },

  setConfig (cfg) {
    if (dirty) {
      config = {
        ...config,
        ...cfg
      }
    } else {
      config = {
        ...config,
        ...getFileConfig(cfg.__projectPath),
        ...cfg
      }
      dirty = true
    }
  }
}
