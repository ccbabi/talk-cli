const fs = require('fs')
const path = require('path')
const relative = require('../lib/relative')
const logger = require('../lib/logger')
const config = require('../config')

let entryInfos

if (config.multiple) {
  const pagesRoot = relative.cwd('src', 'pages')
  if (!fs.existsSync(pagesRoot)) {
    logger.error(`${pagesRoot} 目录不存在！`)
    process.exit(1)
  }

  entryInfos = fs.readdirSync(pagesRoot).reduce((entryInfos, page) => {
    entryInfos.push(genEntryInfo(path.join(pagesRoot, page)))
    return entryInfos
  }, [])
} else {
  entryInfos = [genEntryInfo('src')]
}

function genEntryInfo (dir) {
  const template = relative.cwd(`${dir}/index.html`)
  const entry = relative.cwd(`${dir}/index.js`)

  return {
    pageName: dir === 'src' ? 'main' : path.basename(dir),
    entry,
    entryExists: fs.existsSync(entry),
    template,
    templateExists: fs.existsSync(template)
  }
}

module.exports = entryInfos
