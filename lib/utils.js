const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer');
const chalk = require('chalk');
const CLI = require('clui'),
    Spinner = CLI.Spinner;
const config = require('../template/list.json')
module.exports = {
    config: config,
    /**
     * 初始化导航
     * @returns {*}
     */
    createQuestion() {
        const questions = [
            {
                type: 'input',
                name: 'filename',
                message: '请输入要创建的文件名：',
                validate: function (value) {
                    var pass = value.match(/\w+/);
                    if (pass) {
                        return true;
                    }
                    return '请输入正确的文件名称(数字文字下划线)';
                }
            },
            {
                type: 'rawlist',
                name: 'templName',
                message: '请选择模板?',
                choices: config
            },
            {
                type: 'rawlist',
                name: 'jsType',
                message: '请选择语言类型?',
                choices: ['javascript', 'typescript']
            },
        ];
        return inquirer.prompt(questions)
    },
    /**
     * 复制模板文件
     * @param name
     */
    copyTempl(name, templName = null) {
        let countdown = new Spinner('努力加载中，请稍后...  ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
        countdown.start();
        let desPath = path.join(__dirname, '../template/' + templName)
        let desName = name
        this.copyDir(desPath, desName)
        console.log(chalk.red(`\n请运行:\n cd ${name} \n😗请开心的撸码吧😗`));
        countdown.stop()
    },
    /**
     * 复制
     * @param src
     * @param dist
     * @param callback
     */
    copyDir(src, dist, callback) {
        const oPath = path;
        const StaticPath = process.cwd();
        fs.access(dist, function (err) {
            if (err) {
                // 目录不存在时创建目录
                fs.mkdirSync(dist, { recursive: true });
            }
            _copy(null, src, dist);
        });

        const _copy = (err, src, dist) => {
            if (err) {
                callback(err);
            } else {
                let dir = fs.readdirSync(src, 'utf-8');
                for (let j of dir) {
                    var _src = src + '/' + j;
                    var _dist = dist + '/' + j;
                    let stat = fs.statSync(_src);
                    if (stat.isDirectory()) {
                        this.copyDir(_src, _dist, callback);
                    } else {
                        fs.writeFileSync(_dist, fs.readFileSync(_src, { encoding: 'utf-8' }));
                    }
                }
            }
        }
    }
};
