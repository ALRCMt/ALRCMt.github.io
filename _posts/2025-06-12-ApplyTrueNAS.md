---
title: TrueNAS系统配置
author: ALRCMt
date: 2025-06-12
category: Jekyll
layout: post
---

<hr />

### 1.实现硬盘直通

我偷懒直接抄firemaker大佬教程了  

控制台中执行ls -l /dev/disk/by-id/命令，列出所有硬盘设备的id及其对应的磁盘简称，执行后结果格式如下所示。其中ata-开头代表使用的是sata接口，此外还有scs、nvme等类型

```shell
root@pve:~# ls -l /dev/disk/by-id/
total 0
lrwxrwxrwx 1 root root  9 Feb  9 10:13 ata-INTEL_SSDSC2KB480G7_PHYS8114051L480BGN -> ../../sdb
lrwxrwxrwx 1 root root 10 Feb  9 10:13 ata-INTEL_SSDSC2KB480G7_PHYS8114051L480BGN-part1 -> ../../sdb1
lrwxrwxrwx 1 root root 10 Feb  9 10:13 ata-INTEL_SSDSC2KB480G7_PHYS8114051L480BGN-part2 -> ../../sdb2
lrwxrwxrwx 1 root root 10 Feb  9 10:13 ata-INTEL_SSDSC2KB480G7_PHYS8114051L480BGN-part3 -> ../../sdb3
lrwxrwxrwx 1 root root  9 Feb  9 10:13 ata-MAXTOR_STM3160811AS_6PT3HF76 -> ../../sdc
lrwxrwxrwx 1 root root 10 Feb  9 10:13 ata-MAXTOR_STM3160811AS_6PT3HF76-part1 -> ../../sdc1
```

找到想要直通的硬盘，拷贝id全文，如“ata-MAXTOR_STM3160811AS_6PT3HF76”

按照如下格式执行语句，将这个设备直通给某个虚拟机
```shell
qm set <vm_id> –<disk_type>[n] /dev/disk/by-id/<type>-$brand-$model_$serial_number
```
例如我想把“ta-MAXTOR...”这块硬盘直通给id为101的虚拟机，执行的语句是：
```shell
qm set 101 -sata1 /dev/disk/by-id/ata-MAXTOR_STM3160811AS_6PT3HF76
```
其中qm set是命令，101就是虚拟机的id，-sata1指的是使用sata模式直通，且其通道编号是sata1，每个虚拟机建立出来以后给他挂载的系统盘编号通常是xxx0，如sata0、scsi0等，新挂载的硬盘编号只要不与这台虚拟机上已有的编号重复即可。执行完以后如果一切正常，控制台会返回一个提示：“update VM ...”，具体如下所示：
``` shell
root@pve:~# qm set 101 -sata1 /dev/disk/by-id/ata-HGST_HUS724040ALA640_PN1334PCJLA9MS
update VM 101: -sata1 /dev/disk/by-id/ata-HGST_HUS724040ALA640_PN1334PCJLA9MS
```
这时候打开虚拟机的管理页就可以看到有一块新的硬盘出现在设备列表中，但颜色是橙色的，表示还没有生效，这时重启这台虚拟机就可以使其生效了

如果想取消直通，PVE的控制台界面选择虚拟机的“硬件”，选择指定硬盘，点击“分离”就行了
<hr />

### 2.配置存储池及用户设置

教程直接看司波图网上找去：  
[**合集【司波图】TrueNAS SCALE 教程**](https://space.bilibili.com/28457/lists/1061554?type=season)

<hr />

### 3.SMB 共享配置

在 TrueNAS 的 Web 页面上进入共享页面  
打开 Windows（SMB）共享服务  
_确认在用户配置创建的用户勾选了 SMB 用户选项_
添加 SMB 共享，选择共享目录

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2412.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2412.png" alt="" width="700px">
  </a>
</figure>

在同一个局域网中，在文件管理器显示各个硬盘页面的空白处右键，选择“添加一个网络位置”

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2413.png" alt="" width="700px"/>

一番下一步后会让你输入地址，填写 truenas 的服务地址然后又是一番下一步，最后会询问你用户名和密码  
这时候就填写你在 TrueNas 上新创建的用户的名称和密码即可

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2414.png" alt="" width="400px"/>

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2415.png" alt="" width="300px"/>

- 小提示：地址从你的存储池开始计算，如我这里就是/Mt 而不是 /mnt/MtData/Mt

最终结果：

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2416.png" alt="" width="300px"/>

<hr />

### 4.NFS 共享配置

> _注意！！！_  
> _这里请配合 [**Ubuntu挂载**](/jekyll/2025-06-13-ApplyUbuntu.html#5%E5%B0%86-truenas-%E5%AD%98%E5%82%A8%E6%B1%A0%E6%8C%82%E8%BD%BD%E5%88%B0%E6%8C%87%E5%AE%9A%E7%9B%AE%E5%BD%95) 挂载使用_

同上，打开 UNIX（NFS）共享服务  
添加 NFS 共享，选择共享目录  
如果想方便一点，选择配置服务，勾选允许非 root 挂载  
之后操作在 Ubuntu 系统完成

