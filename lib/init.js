const chalk = require('chalk');
const path = require('path');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const co = require('co');
const Utils = require('./utils');
const check = require('./check-version');
module.exports = () => {
    clear()
    check(() => {
        console.log(
            chalk.green(
                figlet.textSync('NCC-CLI', { horizontalLayout: 'full' })
            )
        )
        Utils.createQuestion().then(res => {
            let projectName = path.join(process.cwd(), res.filename)
            let templName = res.templName + '-' + (res.jsType === 'typescript' ? 'ts' : 'js')
            console.log('project info: ', res)
            Utils.copyTempl(projectName, templName)
            /*  return
            let gitPath = Utils.getTempInfo(res.templName)
            Utils.gitClone(gitPath, projectName) */
        })
    })
}