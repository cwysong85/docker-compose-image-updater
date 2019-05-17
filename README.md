# Docker Compose Image Updater
A simple and effective way to update image paths in an existing docker-compose.yml file.

Maintaining a large docker compose file can be tedious. If you have a team of developers or have several VM's with a similiar docker compose file but with different environment variables, using this tool you can easily update only the image paths in a large docker-compose.yml file.

## Installation
```
npm i docker-compose-image-updater -g
```

## Usage

```
$> dciu --help

Usage: dciu [options]

Options:
  -v, --version              print dciu version
  -u, --update-file          YAML or JSON update file to pass in
  -y, --yaml-file            YAML file to update, typically a docker-compose.yml file
  -o, --omit-backup          Do not produce a backup of the original file. Default is to backup the file e.g. docker-compose.yml.1558044602.backup
```
## Update file
The update file is a simple one-to-one mapping. The "service" name mapped to the docker "image". Below are examples files in YAML and in JSON.

### --update-file YAML file syntax
Example `images-to-update.yml` file:
```
service1: nginx:1.16
service2: mysql:8.0
service3: hello-world:latest
```

### --update-file JSON file syntax
Example `images-to-update.json` file:
```
{
    "service1": "nginx:1.16",
    "service2": "mysql:8.0",
    "service3": "hello-world:latest"
}
```

## Commands

This command will update a docker-compose.yml file images with new images and create a backup of the old docker compose file.
```
dciu -u images-to-update.yml -y docker-compose.yml
Created backup file "test-files/docker-compose.yml.1558053560.backup"
Updated "test-files/docker-compose.yml" with new values
```

To omit a backup, use the `-o` argument:
```
dciu -u images-to-update.yml -y docker-compose.yml -o
```