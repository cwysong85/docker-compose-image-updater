#!/usr/bin/env node

const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

var args = process.argv.slice(2)
var updateFilePath = null
var yamlFilePath = null

if(args.length === 0) {
    console.log('Please provide arguments --update-file /path/to/file.json & --yaml-file /path/to/yaml.yml')
    process.exit()
}

if (!args.includes('--update-file')) {
    console.log('Please provide argument "--update-file /path/to/file.json"')
    process.exit()
} else {
    var i = args.indexOf('--update-file')
    var f = args[i+1]

    if(!fs.existsSync(f)) {
        console.log('File "' + f + '" does not exist!')
        process.exit()
    } else {
        if(path.extname(f) !== '.json') {
            console.log('File "' + f + '" is not a JSON file.');
            process.exit()
        }
        updateFilePath = f
    }
}

if (!args.includes('--yaml-file')) {
    console.log('Please provide argument "--yaml-file /path/to/yaml.yml"')
    process.exit()
} else {
    var i = args.indexOf('--yaml-file')
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


var replaceInYaml = (obj, yamlDoc, parentKey) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(typeof obj[key] === 'object') {
                yamlDoc = replaceInYaml(obj[key], yamlDoc, key)
            } else {
                if(yamlDoc.services[parentKey] && yamlDoc.services[parentKey][key]) {
                    yamlDoc.services[parentKey][key] = obj[key]
                }
            }
        }
    }
    return yamlDoc
}

try {
    var yamlDoc = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'))
    var jsonDoc
    
    try {
        jsonDoc = JSON.parse(fs.readFileSync(updateFilePath, 'utf-8'))
    } catch(e) {
        console.log("Could not parse JSON file")
        process.exit()
    }

    if(!jsonDoc) {
        console.log('JSON doc is not valid');
        process.exit()
    }

    if(!jsonDoc.services) {
        console.log('File "' + updateFilePath + '" must include "services" object!')
        process.exit()
    }

    if(!yamlDoc.services) {
        console.log('File "' + yamlFilePath + '" must include "services:" object!')
        process.exit()
    }

    try {
        var newYaml = yaml.dump(replaceInYaml(jsonDoc, yamlDoc))

        if(newYaml) {
            fs.writeFile(yamlFilePath, newYaml, { encoding: 'utf-8' }, (err) => {
                if(err) {
                    console.log('An error occurred while writing new YAML file.')
                    process.exit();
                }
    
                console.log('Updated "' + yamlFilePath + '"!')
            })
        }
    } catch(e) {
        throw e;
    }

} catch (e) {
    console.log(e)
}