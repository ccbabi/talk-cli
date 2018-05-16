const fs = require('fs')
const ora = require('ora')
const downGitRepo = require('download-git-repo')
const execa = require('execa')
const inquirer = require('inquirer')

const templates = {
  'static': 'ccbabi/talk-template-static',
  'vue': 'ccbabi/talk-template-vue'
}

module.exports = (template, project, option) => {
  const logger = require('../lib/logger')
  const relative = require('../lib/relative')
  let message

  if (!templates[template]) {
    logger.warning(`Oops, ${template} 不存在！`)
    process.exit(1)
  }

  project = project || '.'

  if (fs.existsSync(project)) {
    message = project === '.'
    ? '要在当前目录初始化模板吗？'
    : `目录 ${project} 已存在，继续生成？`

    inquirer.prompt([{
      type: 'confirm',
      name: 'answers',
      message
    }]).then(({ answers }) => {
      if (answers) downTemplate()
    }).catch(err => {
      throw err
    })
  } else {
    downTemplate()
  }

  function downTemplate () {
    const spinner = ora().start('[1/2] 正在初始化模板...')
    downGitRepo(templates[template], relative.cwd(project), { clone: option.clone }, err => {
      if (err) {
        logger.error(err)
        process.exit(1)
      }
      spinner.succeed('[1/2] 已完成模板初始化')
      setTimeout(install, 0)
    })
  }

  function install () {
    const spinner = ora().start('[2/2] 正在安装依赖...')
    execa(
      'npm',
      ['install', '--registry=https://registry.npm.taobao.org'],
      { cwd: relative.cwd(project) }
    ).then(() => {
      spinner.succeed('[2/2] 已完成依赖安装')
    })
  }
}
