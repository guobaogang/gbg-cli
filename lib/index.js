const program = require('commander');
const packageInfo = require('../package.json');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

clear();
console.log(
    chalk.green(
        figlet.textSync('GBG-CLI', { horizontalLayout: 'full' })
    )
)

program
    .version(packageInfo.version)
program
    .usage('<command>')
program
    .command('init')
    .description('初始化')
    .alias('i')
    .action(() => {
        require('../lib/init')()
    })
program.parse(process.argv)
if (!program.args.length) {
    program.help()
}