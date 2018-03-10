const entryInfos = require('./webpack-entry')

function getEntry () {
  return entryInfos.reduce((webpackEntry, entryInfo) => {
    const { entryExists, pageName, entry } = entryInfo
    if (entryExists) webpackEntry[pageName] = entry
    return webpackEntry
  }, {})
}

module.exports = {
  entry: getEntry()
}
