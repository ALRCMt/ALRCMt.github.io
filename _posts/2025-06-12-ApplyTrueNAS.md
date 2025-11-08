---
title: TrueNAS系统配置
author: ALRCMt
date: 2025-06-12
category: Jekyll
layout: post
---

<hr />

### 1.实现硬盘直通

教程地址：[pve 硬盘直通](https://github.com/firemakergk/aquar-build-helper/blob/master/details/pve%E7%A1%AC%E7%9B%98%E7%9B%B4%E9%80%9A.md)

> 取消硬盘直通的方法  
> pve 的 web 界面选择虚拟机的“硬件”，选择指定硬盘，点击“分离”

<hr />

### 2.配置存储池及用户设置

教程：  
[【司波图】TrueNAS SCALE 教程，第一章——简单用起来](https://www.bilibili.com/video/BV1cK411z7dx/?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click&vd_source=2a55d6df129012c2f31dfcad634bc9de)

<hr />

### 3.SMB 共享配置

在 TrueNAS 的 Web 页面上进入共享页面  
打开 Windows（SMB）共享服务  
_确认在用户配置创建的用户勾选了 SMB 用户选项_
添加 SMB 共享，选择共享目录

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20133538.png" alt="" width="700px"/>

在同一个局域网中，在文件管理器显示各个硬盘页面的空白处右键，选择“添加一个网络位置”

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20133618.png" alt="" width="700px"/>

一番下一步后会让你输入地址，填写 truenas 的服务地址然后又是一番下一步，最后会询问你用户名和密码  
这时候就填写你在 TrueNas 上新创建的用户的名称和密码即可

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20134332.png" alt="" width="400px"/>

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20134349.png" alt="" width="300px"/>

- 小提示：地址从你的存储池开始计算，如我这里就是/Mt 而不是 /mnt/MtData/Mt

最终结果：

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20134441.png" alt="" width="300px"/>

<hr />

### 4.NFS 共享配置

> _注意！！！_  
> _这里请配合 [Ubuntu挂载](/jekyll/2025-06-13-ApplyUbuntu.html#5%E5%B0%86-truenas-%E5%AD%98%E5%82%A8%E6%B1%A0%E6%8C%82%E8%BD%BD%E5%88%B0%E6%8C%87%E5%AE%9A%E7%9B%AE%E5%BD%95) 挂载使用_

同上，打开 UNIX（NFS）共享服务  
添加 NFS 共享，选择共享目录  
如果想方便一点，选择配置服务，勾选允许非 root 挂载  
之后操作在 Ubuntu 系统完成

