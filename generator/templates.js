'use strict';

const copyProjectTemplateAndReplace = require('./copyProjectTemplateAndReplace');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
var shell = require('shelljs');
const yarn = require('../util/yarn');

/**
 * The following formats are supported for the template:
 * - 'demo' -> Fetch the package react-native-template-demo from npm
 * - git://..., http://..., file://... or any other URL supported by npm
 */
function createFromRemoteTemplate(template, destPath, newProjectName, version) {
  const yarnVersion = yarn.getYarnVersionIfAvailable()

  if (!yarnVersion) {
    console.log('please install yarn before use mcrn-cli')
  }

  let installPackage;
  let templateName;
  if (template.includes('://')) {
     // URL, e.g. git://, file://
     installPackage = template;
     templateName = template.substr(template.lastIndexOf('/') + 1);
  } else {
    // e.g 'demo'
    installPackage = 'react-native-template-' + template;
    templateName = installPackage;
  }

  // Check if the template exists
  console.log(`Fetching template ${installPackage}...`);
  try {
    if (yarnVersion) {
      execSync(`yarn add ${installPackage}@${version} --ignore-scripts`, {stdio: 'inherit'});
    } else {
      execSync(`npm install ${installPackage}@${version} --save --save-exact --ignore-scripts`, {stdio: 'inherit'});
    }
    const templatePath = path.resolve(
      'node_modules', templateName
    );
    copyProjectTemplateAndReplace(
      templatePath,
      destPath,
      newProjectName,
      {
        // Every template contains a dummy package.json file included
        // only for publishing the template to npm.
        // We want to ignore this dummy file, otherwise it would overwrite
        // our project's package.json file.
        ignorePaths: ['package.json', 'dependencies.json'],
      }
    );
    installTemplateDependencies(templatePath, yarnVersion);
  } finally {
    // Clean up the temp files
    try {
      if (yarnVersion) {
        execSync(`yarn remove ${templateName} --ignore-scripts`);
      } else {
        execSync(`npm uninstall ${templateName} --ignore-scripts`);
      }
      shell.exec('cd ios && pod install && cd ..', (code) => {
        if (!code) {
          console.log('create success !!!');
        }
        process.exit(1);
      })

      
    } catch (err) {
      
      // Not critical but we still want people to know and report
      // if this the clean up fails.
      console.warn(
        `Failed to clean up template temp files in node_modules/${templateName}. ` +
        'This is not a critical error, you can work on your app.'
      );
    }
  }
}

function installTemplateDependencies(templatePath, yarnVersion) {
  // dependencies.json is a special file that lists additional dependencies
  // that are required by this template
  const dependenciesJsonPath = path.resolve(
    templatePath, 'dependencies.json'
  );
  console.log('Adding dependencies for the project...');
  if (!fs.existsSync(dependenciesJsonPath)) {
    console.log('No additional dependencies.');
    return;
  }

  let dependencies;
  try {
    dependencies = JSON.parse(fs.readFileSync(dependenciesJsonPath));
  } catch (err) {
    throw new Error(
      'Could not parse the template\'s dependencies.json: ' + err.message
    );
  }
  for (let depName in dependencies) {
    const depVersion = dependencies[depName];
    const depToInstall = depName + '@' + depVersion;
    console.log('Adding ' + depToInstall + '...');
    if (yarnVersion) {
      execSync(`yarn add ${depToInstall}`, {stdio: 'inherit'});
    } else {
      execSync(`npm install ${depToInstall} --save --save-exact`, {stdio: 'inherit'});
    }
  }
}

module.exports = {
  createFromRemoteTemplate,
};
