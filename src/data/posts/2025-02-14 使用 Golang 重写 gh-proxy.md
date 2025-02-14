---
id: 24
title: "使用 Golang 重写 gh-proxy"
modified_at: 2025-02-14T12:49:00Z
description: 一直以来，我都高度依赖自部署的 hunshcn/gh-proxy 项目加速 GitHub 上的文件下载。然而，这个项目在我的 Docker 服务器上运行起来非常不优雅——基于 Python 开发导致最终 Docker 镜像大小达到了惊人的 940MB，最终我在DeepSeek的帮助下使用Golang重写了这个项目，将Docker镜像的体积缩小到了原有的1%。
tags:
  - "Golang"
  - "gh-proxy"
  - "重构"
---

一直以来，我都高度依赖自部署的 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy) 项目加速 GitHub 上的文件下载。然而，这个项目在我的 Docker 服务器上运行起来非常不优雅——基于 Python 开发导致最终 Docker 镜像大小达到了惊人的 940MB，最终我在 DeepSeek 的帮助下使用 Golang 重写了这个项目，将 Docker 镜像的体积缩小到了原有的 1%。

## 项目地址

项目目前以与原项目相同的 MIT License 开源，项目地址为 [Allenyou1126/gh-proxy-go](https://github.com/Allenyou1126/gh-proxy-go)。

目前项目暂未提供编译好的二进制文件与 Docker 镜像，需要自行 Clone 后构建。

一部分原项目通过代码中变量控制的配置项在重构时改为了使用环境变量 / `.env` 文件控制，详情请参见 README 文件。

部署后使用方法与原项目相同。

## 重构过程

首先，我向 DeepSeek-R1 模型提问（打开联网搜索与深度思考）：

```text
请你用Golang的GIN框架重构以下一段基于Python Flask的代码，仅用一个文件完成
[原项目的app.py文件]
```

要求在一个文件内完成的目的是防止 DeepSeek-R1 模型过度设计，导致最终输出超过长度限制被截断。

很快，DeepSeek 给出了它的思考与代码。生成的代码质量非常高，扔进 Goland 里面将几个未处理 err 的问题修复之后就能正常运行了。

不过，为了让这个项目启动更快，我手动将原本在启动时动态下载的前端资源下载到了项目中，并通过 Golang 的 `go:embed` 功能嵌入生成二进制文件中。

```go
//go:embed static/*
var fs embed.FS

// init()
slog.Debug("Loading index.html")
if indexHTML, err = fs.ReadFile("static/index.html"); err != nil {
  slog.Error("Error loading static files.")
  os.Exit(1)
}
slog.Debug("index.html loaded.")

slog.Debug("Loading favicon.ico")
if iconData, err = fs.ReadFile("static/favicon.ico"); err != nil {
  slog.Error("Error loading static files.")
  os.Exit(1)
}
slog.Debug("favicon.ico loaded.")
```

此外，再加上一些日志语句以及环境变量开关，这个项目就算完成了。

## 感想

DeepSeek 真好用啊……不过 [cznorth](https://www.cznorth.cn) 跟我聊这件事的时候跟我说 Claude 3.5 Sonnet 模型在代码能力上会有更好表现，下次可以试一试。

~~快进到我直接被 AI 取代失业~~
