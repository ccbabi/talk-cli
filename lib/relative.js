const path = require('path')

const baseCmd = path.resolve(__dirname, '../')
const baseCwd = process.cwd()

function cmd (...rest) {
  rest.unshift(baseCmd)
  return path.resolve.apply(path, rest)
}

function cwd (...rest) {
  rest.unshift(baseCwd)
  return path.resolve.apply(path, rest)
}

module.exports = { cmd, cwd }
