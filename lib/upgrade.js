const exec = require('child_process').exec;
const co = require('co');
const chalk = require('chalk');
const ora = require('ora');
module.exports = () => {
    co(function* () {
        let cmdStr = `npm install gbg-cli -g`;
        const spinner = ora(chalk.red('更新......')).start();
        setTimeout(() => {
            spinner.color = 'yellow';
            spinner.text = chalk.red('更新中......');
        }, 1000);
        yield (function () {
            return new Promise(function (resolve, reject) {
                exec(cmdStr, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error)
                        process.exit();
                    }
                    resolve()
                })
            })
        })()
        // 处理指定文件夹
        spinner.succeed(chalk.green('更新完成'))
        process.exit()
    })
}