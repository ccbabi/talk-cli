const relative = require('../lib/relative')

const pkgPath = relative.cwd('./package.json')

const defaultConfig = {
  multiple: false
}

let packageConfig

try {
  packageConfig = require(pkgPath).talk
} catch (e) {
  packageConfig = {}
}

module.exports = {
  ...defaultConfig,
  ...packageConfig
}
