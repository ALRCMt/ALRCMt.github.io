---
title: Ubuntu Server 系统
author: ALRCMt
date: 2025-06-12
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: Ubuntu Server系统安装完整指南，专注于无GUI的服务器版本，为MtAIO系统提供运行Docker服务的轻量级Linux平台。
---


<hr />

### 安装 [Ubuntu Server](https://cn.ubuntu.com/server)

**1.下载镜像**

由于我们使用 ubuntu 的作用主要是承载各种服务而非直接与之交互，所以选择没有 GUI 的 Ubuntu Server 版本。

Ubuntu Server 下载页面：[https://cn.ubuntu.com/download/server/step1](https://cn.ubuntu.com/download/server/step1)

选择最新的 LTS 版本即可

**2.上传镜像**

与 TrueNAS 章节的上传操作一致，不再重复

**3.创建虚拟机**

与 TrueNAS 章节的创建操作类似，内存我分配了 4GB

**4.安装 Ubuntu Server**

推荐教程：[https://blog.csdn.net/FungLeo/article/details/148370828](https://blog.csdn.net/FungLeo/article/details/148370828)

Ubuntu Server 官方文档的安装指引：[https://ubuntu.com/server/docs/install/step-by-step](https://ubuntu.com/server/docs/install/step-by-step)

安装时有几点需要注意：

1.  Mirror 设置时，Ubuntu 现在默认为国内源地址，如果不是的话请更换成你所在的地区最稳定的地址
2.  ubuntu 安装默认只占用一半空间，需自己勾选上 _[已经安装完成？补救方法](/jekyll/2025-06-30-LoveFormMe.html#05ubuntu-%E7%A9%BA%E9%97%B4%E4%BB%85%E5%8D%A0%E7%94%A8%E4%B8%80%E5%8D%8A)_
3.  SSH 设置时勾选 Install SSH Server
4.  Snaps 页面不要选择任何软件进行安装
5.  在 Ubuntu 安装开始执行一段时间后（大概几分钟），会开始拉取软件源信息，没必要等待，直接选择"跳过并重启"即可

**5.验证安装**

在 PVE 中找到 Ubuntu 的虚拟机，并进入 Console 界面，多按动几次回车键，如果看到类似的提示，则输入你安装时设置的用户名和密码。如果登录成功则说明系统正常运行了

![](https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2409.png)

<hr />
