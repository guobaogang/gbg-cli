const chalk = require('chalk');
const figlet = require('figlet');
const list = require('../template/list.json')
module.exports = () => {
    console.log(
        chalk.yellow.bold(`现支持模板列表:\n${chalk.green(list.map(item => item.value).join('\n'))}`),

    )
}