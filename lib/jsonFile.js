var fs = require('fs');
function updateJson(filePath,key,value,callback){
    fs.readFile(filePath,function(err,data){
        if(err){
            console.error(err);
        }
        var json = data.toString();
        json = JSON.parse(json);
        json[key] = value;
        var str = JSON.stringify(json, null, 2);
        fs.writeFile(filePath,str,function(err){
            if(err){
                console.error(err);
            } else {
                callback();
            }
        })
    })
}
module.exports = {
    updateJson,
}