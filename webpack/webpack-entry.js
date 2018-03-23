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
  const templateExtensions = ['hbs', 'pug', 'html']
  const entryExtensions = ['ts', 'js']

  let template, templateExists, templateExtension
  let entry, entryExists, entryExtension

  while (!templateExists && templateExtensions.length) {
    templateExtension = templateExtensions.shift()
    template = relative.cwd(`${dir}/index.${templateExtension}`)
    templateExists = fs.existsSync(template)
  }

  while (!entryExists && entryExtensions.length) {
    entryExtension = entryExtensions.shift()
    entry = relative.cwd(`${dir}/index.${entryExtension}`)
    entryExists = fs.existsSync(entry)
  }

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
  logger.error('Oops, 没有找到页面！')
  console.log('')
  process.exit(1)
}

module.exports = entryInfos
