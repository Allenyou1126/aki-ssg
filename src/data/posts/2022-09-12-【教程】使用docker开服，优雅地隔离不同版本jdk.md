---
id: 7
title: "【教程】使用Docker开服，优雅地隔离不同版本JDK"
description: 对于各位腐竹来说，JDK 作为 Minecraft 开服的前置想必都不陌生。但 Minecraft 1.17 开始对高版本 JDK 的需求也为一些需要多版本切换的腐竹产生了一些困扰。本文将简述一种基于 AdoptJDK on Docker 进行开服并借以实现 JDK 环境隔离的方法。
modified_at: "2022-09-12"
tags:
  - "docker"
  - "minecraft"
  - "教程"
  - "服务器"
---

## 前言

对于各位腐竹来说，JDK 作为 Minecraft 开服的前置想必都不陌生。但 Minecraft 1.17 开始对高版本 JDK 的需求也为一些需要多版本切换的腐竹产生了一些困扰。本文将简述一种基于 AdoptJDK on Docker 进行开服并借以实现 JDK 环境隔离的方法。

## 观前提示

为了便于叙述，本文将默认读者已经完成下列要求：

### 服务器需求

- 已经做好基本配置（用户创建、密码修改、软件源配置等）
- 已经安装 Docker（必需）与 docker-compose（可选）
- 防火墙已经放通必要端口

### 前置知识

- 基本的 Linux 操作（文件操作等）
- 对 Minecraft Java Edition 服务器架设有一定了解（至少得知道该用什么版本 JDK 吧）

## 一些 Docker 概念解释

这里是一些 Docker 基本概念的必要解释。

以下内容引用自[Docker — 从入门到实践](https://yeasy.gitbooks.io/docker_practice/)。

### 镜像/Image

**Docker 镜像** 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像 **不包含** 任何动态数据，其内容在构建之后也不会被改变。

### 容器/Container

**镜像** 和 **容器** 的关系，就像是面向对象程序设计中的 **类** 和 **实例** 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。因此容器可以拥有自己的 `root` 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。

### 数据卷/Volume

**数据卷** 是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

- 数据卷可以在容器之间共享和重用

- 对数据卷的修改会立马生效

- 对数据卷的更新，不会影响镜像

- 数据卷默认会一直存在，即使容器被删除

## 快速上手（直接创建 & 管理容器）

### 文件目录准备

选择一个文件夹作为服务器的工作目录，本文约定为`/data/mcserver`，并确认所使用的用户有对该目录`rwx`权限。

### 开服端准备

将你选择的开服端上传并解压，将所有文件放置在`/data/mcserver`目录下，同样确认权限。

本文约定服务端核心`jar`文件名为`server.jar`。

### 拉取镜像（可选）

在任意目录下执行以下命令拉取将要使用的 Docker 镜像（需要用户处于`docker`用户组中）

```bash
# Java 8
docker pull eclipse-temurin:8-jdk-alpine
# Java 17
docker pull eclipse-temurin:17-jdk-alpine
# 如果还需要安装其他 Java 版本请自行替换上述命令冒号后的版本 tag
# 可用的 tag 可以在https://hub.docker.com/_/eclipse-temurin/tags查询
```

当然，如果这里没有拉取镜像之后也是会自动拉取的，所以这一步是可以直接省略的。

### 创建容器

这里我们输入以下命令创建容器：

```bash
docker run -d -it --name mcserver --restart=always --mount type=bind,source=/data/mcserver,target=/server -p 25565:25565 eclipse-temurin:8-jdk-alpine java -Xmx2048M -jar /server/server.jar nogui
```

执行之后如果没有报错那么你的服务器就已经开好啦！

### 解释

如果看不懂上面的命令，下面我们来解释一下这条命令到底做了什么。

```bash
# 下面的命令经过重排，仅为方便阅读，不能在实际 Shell 中执行，望周知
docker run
-d
-it
--name mcserver
--restart=always
--mount type=bind,source=/data/mcserver,target=/server
-p 25565:25565
eclipse-temurin:8-jdk-alpine
java -Xmx2048M -jar /server/server.jar nogui
```

下面我们来逐行分析上面的命令。

1. `docker run`是基于镜像创建容器的指令。
2. `-d`表示容器将在后台运行，而不会在前台输出内容。
3. `-it`表示开启容器的`STDIN`输入流，并且为容器分配一个 tty，这将允许稍后我们进入容器对 Minecraft Server 的控制台操作。
4. `--name mcserver`表示将容器命名为`mcserver`，方便稍后的管理。这里的名字可以自由修改，如果没有命名，Docker 将为容器随机分配一个名字（但不好记忆）
5. `--restart=always`向 Docker 声明了容器的重启策略，`always`代表将在容器没有开启时自动重启容器，直到用户手动将容器结束。相对应地，这可能导致`/stop`指令无法正常将服务器关闭（关闭后会马上被 Docker 拉起），其他重启策略请参见文章结尾。
6. `--mount type=bind,source=/data/mcserver,target=/server`表示在容器开启时将把主机内的`/data/mcserver`映射到容器中的`/server`，其他使用方式请自行查阅 Docker 文档。
7. `-p 25565:25565`表示将容器的`25565`端口映射到主机的`25565`端口，具体数值请根据实际情况修改，参数格式为`-p 主机端口:容器端口`
8. `eclipse-temurin:8-jdk-alpine`指示了创建容器时使用的镜像名称，格式为`镜像名称:tag名称`，在这里镜像名称就是`eclipse-temurin`，tag 名称为`8-jdk-alpine`，根据 AdoptJDK 官方的规则，这个 tag 名字代表使用 AdoptJDK 的镜像，版本为 8，包含 JDK，镜像内的系统为 Alpine Linux（一个极度精简，主要用于制作 Docker 镜像的 Linux 发行版）
9. `java -Xmx2048M -jar /server/server.jar nogui`就是 Minecraft 开服的启动命令，在此不作解释。

### 管理容器

那么现在服务器已经运行起来了，腐竹常用的管理服务器操作又如何进行呢？

#### 启动/停止容器

```bash
docker container start mcserver # 启动名为 mcserver 的容器（需要已经创建该容器）
docker container stop mcserver # 停止名为 mcserver 的容器
```

#### 查看工作状态

```bash
docker ps # 查看正在运行的容器列表
docker container list # 同上
docker container list --all # 列出所有存在的容器（包括已停止的）
docker logs mcserver # 查看名为 mcserver 容器的日志（容器内运行程序输出到 STDOUT 与 STDERR 的内容）
```

#### 进入控制台

```bash
docker attach mcserver # 进入名为 mcserver 的容器，此时等价于直接操作容器（类似使用 Screen），退出容器使用 Ctrl+C 会导致 java 被结束，正确退出方法为先按 Ctrl+P 再按 Ctrl+Q，这样类似于 Screen 的 Ctrl+A - d
```

#### 删除容器

```bash
docker rm mcserver # 删除容器 mcserver（需要先结束容器）
docker rm mcserver --force # 强行删除容器 mcserver（即使正在运行）
```

### 升级服务端？

#### 不需要更新 Java

直接停止容器，对服务端进行更新，再启动容器即可。

#### 需要更新 Java

停止容器后记下原容器的启动参数，删除原容器，创建一个新的容器，在创建时将镜像版本替换为你需要的版本。

## 使用 Docker Compose（进阶）

Docker Compose 是 Docker 官方推出的一个 Docker 容器编排管理工具，可以简化容器的部署和管理。

### 准备工作

基本与直接使用 Docker 中【文件目录准备】与【开服端准备】相同，但将服务端放置在`/data/mcserver/server`目录下，并检查权限。

### 编写 docker-compose.yml

Docker Compose 依赖配置文件`docker-compose.yml`工作，该文件遵循`YAML`规范。文件内容如下：

```yaml
version: "3"
  services:
    server:
      image: eclipse-temurin:8-jdk-alpine # 指定镜像名称和镜像版本
      ports:
        - "25565:25565" # 将容器 25565 端口映射到主机 25565 端口
      restart: always # 设置重启策略为 always
      stdin_open: true # 打开容器 STDIN，同 -i
      tty: true # 给容器分配 tty，同 -t
      volumes:
        - /data/mcserver/server/:/server # 将主机/data/mcserver/server 目录映射到容器内/server
      command: java -Xmx2048M -jar /server/server.jar nogui # Minecraft Server 启动命令
```

编写完成后保存为`/data/mcserver/docker-compose.yml`。

### 启动容器

这一步非常简单，只需要在`/data/mcserver`目录下执行如下命令即可：

docker compose up -d # 使用当前目录下的 docker-compose.yml 启动容器，并且在后台运行

这里 Docker Compose 创建的容器将被设置为诸如`mcserver_server_1`的名称（格式：`当前目录名_service名（docker-compose.yml中设置的名称）_数字编号`）

### 管理容器

使用 Docker Compose 管理容器的操作略有不同。

以下命令均在`/data/mcserver`目录中执行。

#### 启动/停止容器

```bash
docker compose up -d # 使用当前目录下的 docker-compose.yml 启动容器，并且在后台运行
docker compose down # 将使用当前目录下的 docker-compose.yml 容器停止并删除
```

#### 查看工作状态

```bash
docker compose ps # 查看正在运行的容器列表
docker compose logs # 查看容器的日志（容器内运行程序输出到 STDOUT 与 STDERR 的内容）
```

#### 进入控制台

```bash
docker attach mcserver_server_1 # 进入名为 mcserver_server_1 的容器，此时等价于直接操作容器（类似使用 Screen），退出容器使用 Ctrl+C 会导致 java 被结束，正确退出方法为先按 Ctrl+P 再按 Ctrl+Q，这样类似于 Screen 的 Ctrl+A - d
```

### 升级服务端？

#### 不需要更新 Java

直接停止容器，对服务端进行更新，再启动容器即可。

#### 需要更新 Java

停止容器，修改`docker-compose.yml`文件中的镜像版本，重新启动容器。

## 后记

这篇文章主要记录其实是今年寒假时候我开服和同学联机打 MC 过程中的一点经验，希望能够帮到有需要的腐竹。

Docker 的功能非常强大，本文无法一一讲解，只能以实用主义态度讲解需要用到的 Docker 特性，在实际开服过程中各位腐竹可以自行探索，研究更好的方法，欢迎在评论区里讨论。

其实在写作本文时 Docker Hub 上已经有了优秀的 Minecraft 开服镜像[itzg/minecraft-server](https://github.com/itzg/docker-minecraft-server)，但为了能更好地使用来自 MCBBS 等社区中各位大佬制作的优秀整合包这里我选择了使用官方 AdoptJDK 镜像直接开服，本质上这并没有完全利用 Docker 的优点，只是将 Docker 当作了一个虚拟环境在使用，严格来说违背了 Docker 的精神。但反正服和我只要有一个能跑就行了我暂时还没有想出通用的、更好的利用方法。

不过我有一个**不成熟**的想法，在开设小游戏服务器的时候可以将对局服务器的服务端制作为镜像放在 Docker 中并利用 Docker Swarm 等集群功能实现动态扩展，结合 BungeeCord 服务端的 API 实现自动注册，但这个方法未经过实践，且我本人并不熟悉 BungeeCord 和 Docker 集群，故将其放在这里仅作为一个思路供参考。

## 附：Docker Restart 参数的重启策略

| 重启策略                   | 效果                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `no`                       | 不自动重启容器（默认）                                                                                                       |
| `on-faliure[:max-retries]` | 当且仅当容器中的程序异常结束（返回值不为`0`时）重启容器，如果设置了`max-retries`参数则最多重试 `max-retries` 次              |
| `unless-stopped`           | 不管容器中的程序是正常结束还是异常结束都重启容器，直到用户手动停止容器或 Docker 本身被关闭                                   |
| `always`                   | 不管容器中的程序是正常结束还是异常结束都重启容器，直到用户手动停止容器。即使 Docker 本身被关闭，在 Docker 启动后也会拉起容器 |

翻译自官方文档

常用`on-failure`和`always`参数。

## 参考

1. [Docker Documentation](https://docs.docker.com/)

2. [Docker - 从入门到实践](https://yeasy.gitbooks.io/docker_practice/)

3. [AdoptJDK Docker 镜像介绍页面](https://hub.docker.com/_/eclipse-temurin)

## 鸣谢

- 紫光（Bilibili: @紫光-zlight106 UID：1690218019）：对本文的初版进行了试阅读并提供了反馈

- 幻歆（[https://huanxinbot.com/](https://huanxinbot.com/)）：修正了一些错误
