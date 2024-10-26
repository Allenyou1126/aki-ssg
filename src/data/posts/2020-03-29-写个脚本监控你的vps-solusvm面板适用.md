---
id: 5
title: "【旧文补档】写个脚本监控你的VPS SolusVM面板适用"
modified_at: "2020-03-29"
description: 本文介绍了一种通过脚本监视基于SolusVM面板的VPS的方法。
tags:
  - "solusvm"
  - "vps"
  - "教程"
  - "服务器"
  - "补档"
---

## 前言

前些天我买了一台 Virmach 的大盘鸡，1 核 512MB 内存，500G 硬盘，4T 流量。这个配置做 NextCloud 还行，但 LAMP 环境比较消耗内存，而且 Virmach 的资源监控很严格，VPS 不能在 5 分钟以上的时间内达到 95-100％的使用率，在 2 小时内的平均使用率不能超过 50％，一旦违反就会直接关机，让我经常看到 NextCloud 的“同步失败”提示。所以我要写个脚本来监控 VPS，并且在 VPS 下线时自动开机。

## 实现

### 监控

使用 nmap，扫描 80 端口是否开放，未开放即为服务器下线。

```bash
rt=`nmap $ip -p 80 | grep "open" | wc -l`
if [ $rt == 1 ]; then # Do something...
fi
```

### 启动服务器

SolusVM 提供了 API，所以我们用 curl 发送 GET 请求调用 API 开机就好了。

API 地址`http(s)://SolusVM面板地址/api/client/command.php?key=你的API Key&hash=你的API HASH&action=操作`

| Action   | 备注 |
| -------- | ---- |
| reboot   | 重启 |
| boot     | 启动 |
| status   | 状态 |
| shutdown | 关机 |
| info     | 信息 |

```bash
curl $boot_url; # boot_url 是 API 开机地址。
```

## 完整脚本

```bash
#!/bin/bash

ip="你服务器 IP"
svm_url="你服务器 SolusVM 面板地址"
api_key="你的 API Key"
api_hash="你的 API HASH"

boot_url=""${svm_url}"/api/client/command.php?key="${api_key}"&hash="${api_hash}"&action=boot"

while true; do
rt=`nmap $ip -p 80 | grep "open" | wc -l`
echo "Checked.";
if [ $rt == 0 ]; then
echo "Booting."
curl $boot_url;
if [ $? == 1 ]; then
echo "Error:Cannot Boot Server";
exit;
else
echo "Successful booted server.";
fi
fi
sleep 5;
done
```

## 使用方法

### 生成 API Key 和 API HASH

打开 SolusVM，找到你的服务器，然后点击 API-Generate。

![SolusVM API](https://blog-oss.allenyou.top/image/649da19bdc970.png)

记好 API Key 和 API HASH。

### 修改脚本

把脚本里面的内容修改，填入服务器 IP/SolusVM 后台地址/API Key/API HASH，保存。

### 修复权限

```bash
chmod +x 脚本文件名
```

### 注册服务

新建`/etc/systemd/system/服务名称.service`，在里面写入这些内容。

```ini
[Unit]
Description=Monitor the status of the SolusVM panel-Based VPS and enable it when the server is offline.

[Service]
ExecStart=/bin/bash 脚本文件路径

[Install]
WantedBy=multi-user.target
```

保存，执行以下命令载入服务。

```bash
systemctl daemon-reload
systemctl enable 服务名
systemctl start 服务名
```

最后，你就可以享受它了！
