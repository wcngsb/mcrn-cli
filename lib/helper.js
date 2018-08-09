
const which = require('which');
const chalk = require('chalk');
const childProcess = require('child_process');

function findNpm() {
    var npms = ['yarn', 'cnpm', 'npm'];
    for(var i = 0; i < npms.length; i++) {
      try {
        which.sync(npms[i]);
        console.log(chalk.cyan('use: ' + npms[i]))
        return npms[i]
      }catch(e) {   
      }
    }
    throw new Error(chalk.red('please install npm or yarn'));
  }
  

  function runCmd(cmd, args, fn) {
    args = args || [];
    var runner = childProcess.spawn(cmd, args, {
        stdio: 'inherit'
    });

    runner.on('close', function (code) {
        if (fn) {
            fn(code);
        }
    })
}

function readLine(prompt, callback) {
    process.stdout.write(prompt + ':');
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function(chunk) {
        process.stdin.pause();
        callback(chunk);
    });
}

module.exports = {
    findNpm,
    runCmd,
    readLine,
  }
