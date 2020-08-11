const program = require('commander');
const packageInfo = require('../package.json');
const chalk = require('chalk');
const figlet = require('figlet');
console.log('test111')

console.log(
    chalk.green(
        figlet.textSync('GBG-CLI', { horizontalLayout: 'full' })
    )
)

program
	.version(packageInfo.version)