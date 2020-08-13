const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

/* clear();
console.log(
    chalk.green(
        figlet.textSync('GBG-CLI', { horizontalLayout: 'full' })
    )
) */

program
    .version(require('../package.json').version)
program
    .usage('<command>')
program
    .command('list')
    .description('模板列表')
    .alias('l')
    .action(() => {
        require('../lib/list')()
    })
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