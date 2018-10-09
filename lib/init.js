
const fs = require('fs');
var path = require('path');
const prompt = require('../generator/promptSync')();
const { createFromRemoteTemplate } = require('../generator/templates')

function validateProjectName(name) {
    if (!name.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
      console.error(
        '"%s" is not a valid name for a project. Please use a valid identifier ' +
          'name (alphanumeric).',
        name
      );
      process.exit(1);
    }
  
    if (name === 'React') {
      console.error(
        '"%s" is not a valid name for a project. Please do not use the ' +
          'reserved word "React".',
        name
      );
      process.exit(1);
    }
}

function createAfterConfirmation(name, version, template) {
  
    console.log('Directory ' + name + ' already exists. Continue? [y/n]')
    const answer = prompt();
    if (answer.toLowerCase().slice(0,1) === 'y') {
        createProject(name, version, template);
    } else {
        console.log('Project initialization canceled');
        process.exit();
    }

}


function createProject(name, version, template) {
    var root = path.resolve(name);
    var projectName = path.basename(root);
  
    console.log(
      'This will walk you through creating a new React Native project in',
      root
    );
  
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }
  
    var packageJson = {
      name: projectName,
      version: '0.0.1',
      private: true,
      scripts: {
        start: 'node node_modules/react-native/local-cli/cli.js start'
      }
    };
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
    process.chdir(root);
    createFromRemoteTemplate(template, root, projectName, version);

  }

  
  

const init = (name, version = 'latest', template = 'mcrn') => {

    validateProjectName(name);
    if (fs.existsSync(name)) {
        createAfterConfirmation(name, version, template);
      } else {
        createProject(name, version, template);
    }

}

module.exports = init;