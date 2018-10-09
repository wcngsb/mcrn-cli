#!/usr/bin/env node
const program = require('commander');
const which = require('which');
const { findNpm, runCmd } = require('../lib/helper')
const init = require('../lib/init')

program
  .version('0.1.0')
  .description('美菜项目构建工具')

program
    .command('init <name>')
    .usage('')
    .description('初始化一个项目，默认最新版本' )
    .option('-v, --versioninit <versioninit>', '指定版本号')
    .option('-t, --template <template>', '指定模板')
    .action(function(name, options){
        init(name, options.versioninit, options.template);
    })

    
program
    .command('update')
    .description('升级 mcrn-cli 至最新版本' )
    .action(function() {
        runCmd(which.sync(findNpm()), ['install' ,'mcrn-cli', '-g'],(code) => {
            if(!code) {
                console.log('success,have fun !!!')
            } else {
                console.log(code)
            }
        })
    })

program.parse(process.argv);




