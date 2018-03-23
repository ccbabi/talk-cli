const path = require('path')

let baseCmd = path.resolve(__dirname, '../')
let baseCwd = process.cwd()

function cmd (...rest) {
  rest.unshift(baseCmd)
  return path.resolve.apply(path, rest)
}

function cwd (...rest) {
  rest.unshift(baseCwd)
  return path.resolve.apply(path, rest)
}

function setCwd (project = '') {
  baseCwd = cwd(project)
}

module.exports = {
  cmd,
  cwd,
  setCwd
}
