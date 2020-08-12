const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const exec = require('child_process').exec
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
     * 获取模板信息
     * @param name
     * @param config
     * @returns {*}
     */
    getTempInfo(name, config = this.config) {
        return config[name]
    },
    /**
     * 创建新增模板提示消息
     * @returns {*}
     */
    createGetTemlQuestion() {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: '请输入自定义模板名称：'
            },
            {
                type: 'input',
                name: 'path',
                message: '请输入自定义模板地址：',
                validate: function (value) {
                    var pass = value.match(
                        /https?:\/\//i
                    );
                    if (pass) {
                        return true;
                    }
                    return '请输入正确的Url地址(http(s)://www.xxx.com)';
                }
            }
        ];
        return inquirer.prompt(questions)
    },
    /**
     * 创建删除模板提示消息
     * @returns {*}
     */
    createDelTemlQuestion() {
        const questions = [
            {
                type: 'rawlist',
                name: 'templName',
                message: '请选择要删除的模板?',
                choices: this.formatConfig(config).slice(2),
                when: (answers) => {
                    return this.formatConfig(config).length > 2;
                }
            }
        ];
        return inquirer.prompt(questions)
    },
    /**
     * 是否覆盖已知模板
     * @returns {*}
     */
    coverOrNot() {
        const questions = [
            {
                type: 'confirm',
                name: 'flag',
                message: '模板已存在是否进行覆盖?',
                default: true
            },
        ];
        return inquirer.prompt(questions)
    },
    /**
     * 特定文件写入特定数据
     * @param path
     * @param data
     * @param type
     * @param callback
     */
    fsSpecialFile(path, data, type, callback) {
        fs.writeFile(path, data, type, callback)
    },
    /**
     * 克隆相应项目
     * @param gitUrl
     * @param projectName
     * @param branch
     */
    gitClone(gitUrl, projectName, branch = 'master') {
        let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`;
        let countdown = new Spinner('努力加载中，请稍后...  ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
        countdown.start();
        exec(cmdStr, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                process.exit();
            }
            rimraf.sync(`./${projectName}/.git`)
            console.log(chalk.red(`\n请运行:\n cd ${projectName} \n😗请开心的撸码吧😗`));
            countdown.stop()
        })
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
