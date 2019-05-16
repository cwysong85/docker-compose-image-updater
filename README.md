# Docker Compose Image Updater
A simple way to update an existing docker-compose.yml file with images you provide.

Managing a big docker-compose file can be tedious at times. If you're like me and are constantly updating docker-compose files across multiple machines, this tool makes life a lot easier. 

### Installation
```
npm i docker-compose-image-updater -g
```

#### Usage

```
$> dciu --help

Usage: dciu [options]

Options:
  -v, --version              print dciu version
  -u, --update-file          JSON update file to pass in
  -y, --yaml-file            YAML file to update, typically a docker-compose.yml file
  -o, --omit-backup          Do not produce a backup of the original file. Default is to backup the file e.g. docker-compose.yml.1558044602.backup
```

### Update JSON file syntax
 - Must have a "services" object
 - Must have services that match your services under your docker-compose.yml file
 - Must have a "image" under your service

Example `images-to-update.json` file:
```
{
    "services": {
        "nginx": {
            "image": "nginx:1.16"
        },
        "mysql": {
            "image": "mysql:8.0"
        },
        "hello-world": {
            "image": "hello-world:latest"
        }
    }
}
```

### Running
```
dciu -u /path/to/update-file.json -y /path/to/docker-compose.yml
```

