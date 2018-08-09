#!/usr/bin/env node
const program = require('commander');
const which = require('which');
const path = require('path');
const os = require('os');
const homeDir = os.homedir()
const LocalPath = `${homeDir}/.mcrn`;
const { findNpm, runCmd, readLine } = require('../lib/helper')
const { download } = require('../lib/downloader')
const { updateJson } = require('../lib/jsonFile')
const chalk = require('chalk');
const { lasted: lastedRelease } =  require('../config/env')
const logo = require('../lib/logo')
var fs = require('fs'); 

program
  .version('0.1.0', '-v, --version')
  .description('美菜项目构建工具')

program
    .command('init')
    .option('-v, --version', '指定版本号')
    .usage('')
    .description('初始化一个项目，默认最新版本' )
    .action(function(option){
        readLine('确定在这里新建一个项目吗？ y/n',(data) => {
            if(fs.existsSync(`${process.cwd()}/package.json`)){
                console.log(`${process.cwd()} \n\n 此目录项目已经存在请先移除现有工程\n\n`)
                return;
            }
            if (data.toLocaleUpperCase().slice(0,1) === 'Y') {
                download(lastedRelease, LocalPath, path.basename(lastedRelease), (cachePath) => {
                    runCmd(which.sync('unzip'), [ '-o', cachePath ,'-d', process.cwd()],(code) => {

                            require('child_process').execSync(`${findNpm()} config set sentrycli_cdnurl http://192.168.248.112:8083/sentry`)
                            runCmd(which.sync(findNpm()), ['install'],(code) => {
                                if(!code) {
                                    const defaultName = process.cwd().slice(process.cwd().lastIndexOf('/') + 1)
                                    updateJson(`${process.cwd()}/package.json`,'name',defaultName,() => {
                                       console.log('\n\n\n package.json更新完毕')
                                       updateJson(`${process.cwd()}/src/config/app.json`,'name',defaultName,() => {
                                            console.log('\n\n\nconfig/app.json更新完毕')
                                            console.log(chalk.bold.cyan(logo),'\n')
                                        })
                                    })
                                    
                                    
                                } else {
                                    console.log(code)
                                }
                            })
                });
            });
            }
        });
    })

program
    .command('upgrade')
    .description('升级 mcrn-cli' )
    .action(function() {
        runCmd(which.sync(findNpm()), ['install' ,'mcrn-cli'],(code) => {
            if(!code) {
                console.log('success,have fun !!!')
            } else {
                console.log(code)
            }
        })
    })

program.parse(process.argv);




