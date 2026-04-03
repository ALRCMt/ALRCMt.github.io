---
title: TrueNAS scale 系统
author: ALRCMt
date: 2025-06-10
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: TrueNAS Scale系统安装与配置完整指南，涵盖镜像下载、PVE集成、虚拟机创建以及ZFS存储池设置，为MtAIO系统提供可靠的NAS存储服务。
---


<hr />

### 安装 [TrueNAS scale](https://www.truenas.com/)

TrueNAS scale 相较于可以直接搭载 Docker 服务，虽然使用 PVE 这种虚拟化平台作为底层系统，但是 TrueNAS scale 能提供更多选择（其实就是我根本没看是 core 还是 scale）

**1.下载镜像**

TrueNAS SCALE 的下载页面： [https://www.truenas.com/download-truenas-community-edition](https://www.truenas.com/download-truenas-community-edition)

刚进入时会提示你注册，点击右下角的 No Thanks 即可看到下载链接了。推荐直接下载最新版本即可。

**2.上传镜像到 PVE**

在左侧的树状图中选择 pve 节点的 local 存储，在右侧选择 ISO 镜像，然后点上传，上传你的在上一步下载的 TrueNAS scale ISO 文件。你可以提前下载后面两节需要用到的镜像，然后集中上传，这可以节省很多时间。

**3.创建虚拟机**

在 pve 的 web 页面的右上角点击创建虚拟机，为 TrueNAS 创建一个虚拟机。

通用信息配置中勾选右下角的 Advanced，并把这个虚拟机设置为开机自启动，然后设置启动顺序为 1，等待时间 60(秒)，需要注意的是这里的等待时间指的是这台虚拟机开机后等待下一台虚拟机开机的时间，而不是他与上一台虚拟机开机的等待时间。**设置合理的启动顺序和等待时间非常重要**，否则会影响上层服务的存储池挂载

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2400.png" alt="" width="600px"/>

操作系统配置页面选择你上传的 TrueNAS IOS 镜像，并设置操作系统类型为 Other

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2401.png" alt="" width="600px"/>

系统配置页面我的配置如下：

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2402.png" alt="" width="600px"/>

系统磁盘空间我分配了 32G，其他配置项没有需要修改的地方

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2403.png" alt="" width="600px"/>

CPU 分配了 2 核，另外 CPU 类型选择了 host，在单机情况下这样设置可以获得最小性能损耗

> _在 8.x 版本的系统中，如果使用的是混合架构的 CPU 如 12 代 i7，可以直接在界面的 CPU Affinity 设置中指定绑定的 CPU 序号_  
> _查看 CPU 多核类别的方法是使用`lscpu -e`命令，可以看到 E 核的 MAXMHZ 会低于 P 核_  
> _（这里我并没有这么配置，所以我不太清楚具体配置）_

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2405.png" alt="" width="600px"/>

内存方面由于 TrueNAS 推荐使用 16G 以上内存空间，但是我总共只有 16G 内存，所以分配了 8G，可以正常使用

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2404.png" alt="" width="600px"/>

网络方面我暂时修改默认配置，以后应该可以将网络类型换成 VirtlIO 以提升性能

进入到确认页面后点击创建就可以了

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2406.png" alt="" width="600px"/>

虚拟机创建成功后，打开他的 console 应该就可以看到安装提示了。

**4.安装 TrueNAS SCALE**

推荐教程 [https://post.smzdm.com/p/a6d8m6vg/](https://post.smzdm.com/p/a6d8m6vg/)

官方文档：[https://www.truenas.com/docs/scale/25.04/gettingstarted/install/](https://www.truenas.com/docs/scale/25.04/gettingstarted/install/)

由于在一些 USB 设备连接不稳定的情况下，TrueNAS 虚拟机会收到 USB 热插拔的影响而死机，所以安装完成以后打开虚拟机的 Options（选项）页，双击 Hotplug（热拔插）设置项，把 USB 选项的勾选去掉。

**5.验证安装**

TrueNAS 安装成功后在局域网中使用浏览器打开提示中的地址应该就可以看到 TrueNAS 的 Web 页面了

![](https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2407.png)

默认用户名是 truenas_admin，密码是在安装时设置

<hr />