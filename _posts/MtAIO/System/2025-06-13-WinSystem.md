---
title: Windows10 系统
author: ALRCMt
date: 2025-06-13 08:00:00 +08:00
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: Windows10系统安装与配置完整指南，涵盖镜像下载、PVE虚拟机创建、UEFI BIOS设置及显卡直通配置，为MtAIO系统提供完整的云Windows环境。
---

<hr />

### 安装 [Windows 10](https://www.microsoft.com/zh-cn/software-download/windows10)

**1.下载镜像**

windows下载镜像前需要先下载一个工具，相当于windows镜像的下载器。在下载器上选择“为另一台电脑创建安装介质（U盘、DVD或者ISO文件）”的选项后即可下载纯净的windows iso镜像。

下载页面：[https://www.microsoft.com/zh-cn/software-download/windows10](https://www.microsoft.com/zh-cn/software-download/windows10)

**2.上传镜像至PVE**

同上

**3.创建虚拟机**

Windows虚拟机的创建步骤参考TruNAS章节，但需要注意如下几点：

在系统配置时使用q35机型，否则后续将无法直通显卡  
将BIOS设置为OVMF(UEFI)，EFI存储设置为local-lvm即可  
勾选添加TPM，TPM存储设置为local-lvm即可，版本v2.0  
在CPU设置时，类型选择host以提升性能  
在网络配置时选择virtIO类型以提升网络性能，但这种方式需要安装完Windows后再手动安装VirtIO驱动  

**4.安装Windows系统**

在PVE的Windows虚拟机中打开Console，就可以看到安装界面了。Windows安装没有任何需要注意的地方，按照自己的习惯安装即可

**5.验证安装**

在PVE的Windows虚拟机中打开Console，可以看到Windows的登录页面，就表示Windows安装成功了

**6.安装VirtlIO驱动**

由于选择了VirtIO的虚拟化网络类型，Windows刚装好时是无法联网的，所以还需要安装驱动。

VirtrIO驱动下载地址：  
[https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso)  
下载好驱动后同样上传至PVE

然后在Windows虚拟机的操作页面上选择Hardware -> 点击Add -> 选择CD/DVD Drive
选择VirtIO的iso文件，点击创建

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2440.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2440.png" alt="" width="700px">
  </a>
</figure>

然后硬件信息栏中会出现VirtIO的设备信息，并呈现橙色，这时候重启Windows虚拟机，重启后你就可以在“我的电脑”中看到多了一个CD驱动器，里面装有VirtIO的安装程序了，点击exe安装，然后再重启机器，你就可以正常上网了

<hr />