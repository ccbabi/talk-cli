const fs = require('fs')
const relative = require('../lib/relative')

module.exports = path => {
  const packagePath = relative.cwd(path, './package.json')

  if (fs.existsSync(packagePath)) {
    const packageConfig = require(packagePath)
    const talkConfig = packageConfig.talk || {}
    const browserslist = packageConfig.browserslist || {}

    return {
      ...talkConfig,
      browserslist
    }
  }
  return {}
}
