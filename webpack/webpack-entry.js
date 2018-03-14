const fs = require('fs')
const path = require('path')
const relative = require('../lib/relative')
const logger = require('../lib/logger')
const config = require('../config')

let exists = false
let entryInfos

if (config.multiple) {
  const pagesRoot = relative.cwd('src', 'pages')
  if (!fs.existsSync(pagesRoot)) {
    logger.error(`Oops, ${pagesRoot} 目录不存在！`)
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
  const entryExists = fs.existsSync(entry)
  const templateExists = fs.existsSync(template)

  if (!exists) {
    exists = entryExists || templateExists
  }

  return {
    pageName: dir === 'src' ? 'index' : path.basename(dir),
    entry,
    entryExists,
    template,
    templateExists
  }
}

if (!exists) {
  console.log('')
  logger.error('Oops, 没有找到入口')
  console.log('')
  process.exit(1)
}

module.exports = entryInfos
