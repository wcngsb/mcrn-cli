const wget = require('wget');
var fs = require('fs'); 

function download(src, cacheDir, fileName, callBack =() => {}) {
    var _cliProgress = require('cli-progress');
    const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
    const output = `${cacheDir}/${fileName}`;

    progressBar.start(1,0)
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
    var download = wget.download(src, output);
    download.on('error', function(err) {
        console.log(err);
    });
    download.on('end', function(output) {
        progressBar.stop();
        callBack(output)
    });
    download.on('progress', function(progress) {
        progressBar.update(progress);
    });
}

module.exports = {
    download
}