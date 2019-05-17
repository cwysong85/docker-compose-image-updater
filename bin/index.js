#!/usr/bin/env node

const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const pkg = require('../package.json')

var args = process.argv.slice(2)
var updateFilePath = null
var updateFileExtName = null
var yamlFilePath = null
var backup = true

if(args.length === 0) {
    console.log('Please provide arguments --update-file /path/to/file.json & --yaml-file /path/to/yaml.yml')
    process.exit()
}

if(args.includes('--help')) {
    console.log(`
    Usage: dciu [options]
    
    Options:
      -v, --version              print dciu version
      -u, --update-file          YAML or JSON update file to pass in
      -y, --yaml-file            YAML file to update, typically a docker-compose.yml file
      -o, --omit-backup          Do not produce a backup of the original file. Default is to backup the file e.g. docker-compose.yml.1558044602.backup`)
    process.exit();
}

if(args.includes('-v') || args.includes('--version')) {
    console.log(pkg.version)
    process.exit();
}

if (args.includes('-o') || args.includes('--omit-backup')) {
    backup = false;
}

if (!args.includes('--update-file') && !args.includes('-u')) {
    console.log('Please provide a path to the JSON update file. Type "dciu --help" for usage.')
    process.exit()
} else {
    var i = args.indexOf('--update-file')
    if(i === -1) {
        i = args.indexOf('-u')
    }

    if(i === -1) {
        console.log('Could not get JSON update file from passed in arguments')
        process.exit();
    }

    var f = args[i+1]

    if(!fs.existsSync(f)) {
        console.log('File "' + f + '" does not exist!')
        process.exit()
    } else {
        if(path.extname(f) !== '.json' && path.extname(f) !== '.yml' && path.extname(f) !== '.yaml') {
            console.log('File "' + f + '" is not a YAML or JSON file.');
            process.exit()
        }
        updateFileExtName = path.extname(f)
        updateFilePath = f
    }
}

if (!args.includes('--yaml-file') && !args.includes('-y')) {
    console.log('Please provide a path to the YAML file to update. Type "dciu --help" for usage.')
    process.exit()
} else {
    var i = args.indexOf('--yaml-file')
    if(i === -1) {
        i = args.indexOf('-y')
    }

    if(i === -1) {
        console.log('Could not get YAML file from passed in arguments')
        process.exit();
    }

    var f = args[i+1]

    if(!fs.existsSync(f)) {
        console.log('File "' + f + '" does not exist!')
        process.exit()
    } else {
        if(path.extname(f) !== '.yml' && path.extname(f) !== '.yaml') {
            console.log('File "' + f + '" is not a YAML file.')
            process.exit()
        }
        yamlFilePath = f
    }
}

var replaceInYaml = (replaceObj, yamlDoc) => {
    for (const key in replaceObj) {
        if (replaceObj.hasOwnProperty(key)) {
            if(yamlDoc.services[key] && yamlDoc.services[key].image) {
                yamlDoc.services[key].image = replaceObj[key];
            }
        }
    }
    return yamlDoc;
}

try {
    var yamlDoc = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'))
    var updateDoc
    
    if(updateFileExtName === '.json'){
        try {
            updateDoc = JSON.parse(fs.readFileSync(updateFilePath, 'utf-8'))
        } catch(e) {
            console.log("Could not parse JSON file")
            process.exit()
        }
    } else {
        updateDoc = yaml.safeLoad(fs.readFileSync(updateFilePath, 'utf8'))
    }

    if(!updateDoc) {
        console.log('YAML or JSON update file is not valid');
        process.exit()
    }

    if(!yamlDoc.services) {
        console.log('File "' + yamlFilePath + '" is not a valid docker compose file. Missing "services" entry.')
        process.exit()
    }

    try {

        var newYaml = yaml.dump(replaceInYaml(updateDoc, yamlDoc))

        if(newYaml && !backup) {
            
            console.log('Omitting backup!')

            fs.writeFile(yamlFilePath, newYaml, { encoding: 'utf-8' }, (err) => {
                if(err) {
                    console.log('An error occurred while writing new YAML file.')
                    process.exit();
                }
    
                console.log('Updated "' + yamlFilePath + '" with new values')
            })
        } else {
            var d = new Date();
            var n = Math.round(d.getTime() / 1000);
            fs.rename(yamlFilePath, `${yamlFilePath}.${n}.backup`, (err) => {
                if (err) {
                    throw err
                }
                
                console.log(`Created backup file "${yamlFilePath}.${n}.backup"`)

                fs.writeFile(yamlFilePath, newYaml, { encoding: 'utf-8' }, (err) => {
                    if(err) {
                        console.log('An error occurred while writing new YAML file.')
                        process.exit()
                    }
        
                    console.log('Updated "' + yamlFilePath + '" with new values')
                })
              });
        }
    } catch(e) {
        throw e
    }

} catch (e) {
    console.log(e)
}