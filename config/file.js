const fs = require('fs')
const relative = require('../lib/relative')
const packagePath = relative.cwd('./package.json')

let fileConfig

if (fs.existsSync(packagePath)) {
  const packageConfig = require(packagePath)
  const talkConfig = packageConfig.talk || {}
  const browserslist = packageConfig.browserslist || {}

  fileConfig = {
    ...talkConfig,
    browserslist
  }
} else {
  fileConfig = {}
}

module.exports = fileConfig
