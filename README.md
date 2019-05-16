# Docker Compose Image Updater

### Installation
```
npm i docker-compose-image-updater -g
```

### Update JSON file syntax
 - Must have a "services" object
 - Under each "services" object, you list out each service you want to update
 - Must have a "image" under your service.

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
dciu --update-file /path/to/update-file.json --yaml-file /path/to/docker-compose.yml
```

