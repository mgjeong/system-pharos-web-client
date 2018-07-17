# Docs @ Web Client APP for Pharos Node & Pharos Anchor

## Quick start ##
This provides how to download and run pre-built Docker image without building project.

#### 1. Install docker-ce ####
- docker-ce
  - Version: 17.09
  - [How to install](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)

#### 2. Download Docker image ####
Please visit [Downloads-ubuntu](https://github.sec.samsung.net/RS7-EdgeComputing/system-pharos-web-client/releases/download/latest/pharos_web_client_ubuntu_x86_64.tar)

#### 3. Load Docker image from tar file ####
```shell
$ docker load -i pharos_web_client_ubuntu_x86_64.tar
```
If it succeeds, you can see the Docker image as follows:
```shell
$ sudo docker images
REPOSITORY                                                                TAG      IMAGE ID        CREATED        SIZE
docker.sec.samsung.net:5000/edge/system-pharos-web-client/ubuntu_x86_64   latest   74c5004da352    24 hours ago   916MB
```

#### 4. Run with Docker image ####
You can execute it with a Docker image as follows:
```shell
$ docker run -d \
	-p 5555:5555 \
	-v /pharos-webclient/data/db:/system-pharos-web-client/static/user \
	docker.sec.samsung.net:5000/edge/system-pharos-web-client/ubuntu_x86_64:latest
```

## Build Prerequisites ##
- Python and required packages
```shell
$ sudo apt-get install python python-pip curl
$ sudo pip install Flask requests PyYAML
```

### How to run Web Client APP

 ```shell
$ python run.py
``` 

Now, you can access the Web Client App with <Host IP>:5555 by Explorer or Chrome
