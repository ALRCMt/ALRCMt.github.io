---
title: Proxmox VE 系统
author: ALRCMt
date: 2025-06-09 08:00:00 +08:00
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: Proxmox VE 系统安装完整指南，涵盖镜像下载、启动盘制作、BIOS 设置、PVE 安装流程以及基本配置步骤，是构建 MtAIO 虚拟化平台的基础教程。文章详细说明了网络配置、存储池设置、APT 源优化以及系统更新等关键操作，并提供常见安装问题的解决方案，帮助用户快速搭建稳定可靠的虚拟化环境，为后续部署各类虚拟机和容器服务奠定坚实基础。
---

<hr />

### 安装 [Proxmox Virtual Environment](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) 

**1.下载镜像**

pve 的镜像官网下载页面：[https://www.proxmox.com/en/downloads/category/iso-images-pve](https://www.proxmox.com/en/downloads/category/iso-images-pve)

直接下载最新版本即可

**2.制作启动盘**

推荐使用 Etcher 制作启动盘，你要用 Rufus 也随便

Etcher 下载地址：[https://pve.proxmox.com/pve-docs/pve-admin-guide.html#installation_prepare_media](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#installation_prepare_media)

**3.安装 PVE**

将启动盘插入物理机，重启进入 BIOS（进 bios 哪个键自己网上搜对应主板去），选择从启动盘启动，然后进入安装流程

安装过程中 pve 会让你设置一个域名，并不关键，按默认即可

安装流程的官方文档：[https://pve.proxmox.com/pve-docs/pve-admin-guide.html#installation_installer](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#installation_installer)

安装过程中卡死？解决方法：[PVE 安装时卡死](/jekyll/2026-02-08-e01.html)

**4.验证安装**

PVE 安装完成后，首先在你的物理机屏幕上会显示出服务的 IP 地址（大概类似https://192.168.X.XXX:8006），注意是 https 协议，在局域网下打开这个地址，你就可以看到 PVE 的 WEB 控制台了

![](https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/main/images/2408.png)

默认用户是 root，密码是你安装时设置的，语言设置为中文

 <hr />