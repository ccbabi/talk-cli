const fs = require('fs')
const ora = require('ora')
const downGitRepo = require('download-git-repo')
const execa = require('execa')
const getStream = require('get-stream')
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

  if (!fs.existsSync(project)) {
    downTemplate()
  }

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

  function downTemplate () {
    ora('正在初始化模板...\n').start()
    downGitRepo(templates[template], relative.cwd(project), { clone: option.clone }, err => {
      if (err) {
        logger.error(err)
        process.exit(1)
      }
      logger.success('[1/2] 已完成')
      install()
    })
  }

  function install () {
    const spinner = ora('正在安装依赖...\n').start()
    const stream = execa(
      'npm',
      ['install', '--registry=https://registry.npm.taobao.org'],
      { cwd: relative.cwd(project) }
    ).stdout

    stream.pipe(process.stdout)
    getStream(stream).then(value => {
      spinner.stop()
      logger.success('[2/2] 已完成')
      process.exit(1)
    })
  }
}
