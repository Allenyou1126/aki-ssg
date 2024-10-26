---
id: 4
title: "【旧文补档】建立自己的私人网盘！在CentOS VPS上安装NextCloud"
modified_at: "2020-02-11"
description: 这里是一些关于使用NextCloud搭建网盘的记录~
tags:
  - "docker"
  - "nextcloud"
  - "vps"
  - "教程"
  - "补档"
---

## 背景

有一天，我正在下载百度网盘上的一个 VMware 虚拟机文件（本地系统为 Ubuntu）。因为当时 Linux 版的百度网盘客户端还没出现，所以使用的是 Aria2c 这个神器。But 不巧的是那几天第三方客户端接口正好被百度封锁了，并且未修复，所以下载速度……一言难尽。

于是我从早上 8:00 等到了下午 17:00 才下好文件，这也让我意识到百度网盘是有多么不靠谱。所以，我开始自建网盘，顺手将一些东西写在了这里，供大家参考。

## 环境介绍

VPS 是 Vultr 的 VPS，这里拿来测试用，大家就别在意细节了哈~

![VPS环境](https://blog-oss.allenyou.top/image/649da19c60a7b.png)

## 开始安装

### 基础设置

首先基础的设置还是要做的哈~这里我只是改下 root 密码，毕竟原来的太难记了 QwQ

```bash
ssh root@服务器 IP
输入密码
passwd
输入新密码
重复一遍
```

这里就先不放图了，毕竟这里还算简单。

### 安装 Docker

这里我们输入下面的指令（官方源）

```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
curl -fsSL https://get.docker.com/ | sh
sudo systemctl enable docker
sudo systemctl start docker
```

这样就安装了 Docker。

### 安装 Docker-compose

先确保你配置好了 Python 和 PIP，然后安装 Docker-compose

```bash
sudo pip install docker-compose
```

### 设置用户组

因为 Docker 要求使用 root 用户或用户在 docker 组内，所以我们用下面的命令将你自己的用户加入 docker 组内

```bash
sudo groupadd docker
sudo usermod 你的用户名 -aG docker
```

### 设置 DNS

将你任意一个用得顺手的域名解析到服务器 IP 上面即可。

### 安装 NextCloud

先在合适的地方建立 NextCloud 的数据文件夹，我这里是`/data/nextcloud`，然后在文件夹下建立`docker-compose.yml`，复制下面的内容，粘贴放入其中。

```yml
version: '2'
services:
nextcloud:
image: wonderfall/nextcloud
links:
  - nextcloud-db:nextcloud-db # If using MySQL
environment:
  - UID=1000
  - GID=1000
  - UPLOAD_MAX_SIZE=10G
  - APC_SHM_SIZE=128M
  - OPCACHE_MEM_SIZE=128
  - CRON_PERIOD=15m
  - TZ=Europe/Berlin
  - ADMIN_USER=你的管理员账户
  - ADMIN_PASSWORD=你的管理员密码
  - DOMAIN=你的域名
  - DB_TYPE=mysql
  - DB_NAME=nextcloud
  - DB_USER=nextcloud
  - DB_PASSWORD=数据库密码
  - DB_HOST=nextcloud-db
volumes:
  - /data/nextcloud/data:/data
  - /data/nextcloud/config:/config
  - /data/nextcloud/apps:/apps2
  - /data/nextcloud/themes:/nextcloud/themes
port:
  - 80:你喜欢的端口（建议不要写 80）
nextcloud-db:
image: mariadb:10
volumes:
  - /data/nextcloud/db:/var/lib/mysql
environment:
  - MYSQL_ROOT_PASSWORD=数据库密码
  - MYSQL_DATABASE=nextcloud
  - MYSQL_USER=nextcloud
  - MYSQL_PASSWORD=数据库密码
```

然后访问`http://你的域名:你设置的端口`就可以看到啦！

## 后记

为了安全，我们可以使用 Nginx 反向代理的方式加上 SSL 证书，还可以去掉后面的端口号。如果你的服务器要用来建站，还可以实现 NextCloud 与网站的共存。具体教程请自行查询，这里就不细说了。
