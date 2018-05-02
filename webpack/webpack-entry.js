const fs = require('fs')
const path = require('path')
const relative = require('../lib/relative')
const logger = require('../lib/logger')
const { getConfig } = require('../config')

const config = getConfig()
let exists = false
let entryInfos

const pagesRoot = relative.cwd(config.__projectPath, 'src', 'pages')
if (!fs.existsSync(pagesRoot)) {
  logger.error(`Oops, ${pagesRoot} 目录不存在！`)
  process.exit(1)
}

entryInfos = fs.readdirSync(pagesRoot).reduce((entryInfos, dirName) => {
  entryInfos.push(genEntryInfo(path.join(pagesRoot, dirName)))
  return entryInfos
}, [])

function genEntryInfo (pageName) {
  const templateExtensions = ['html', 'pug', 'ejs', 'hbs']
  const entryExtensions = ['js', 'ts']

  let template, templateExists, templateExtension
  let entry, entryExists, entryExtension

  while (!templateExists && templateExtensions.length) {
    templateExtension = templateExtensions.shift()
    template = relative.cwd(`${pageName}/index.${templateExtension}`)
    templateExists = fs.existsSync(template)
  }

  while (!entryExists && entryExtensions.length) {
    entryExtension = entryExtensions.shift()
    entry = relative.cwd(`${pageName}/index.${entryExtension}`)
    entryExists = fs.existsSync(entry)
  }

  if (!exists) {
    exists = entryExists || templateExists
  }

  return {
    pageName: path.basename(pageName),
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
