---
title: 问题事项
author: ALRCMt
date: 2026-02-08
category: Jekyll
layout: post
---


以下为我实际搭建过程中的一些问题与解决方法  
热知识：**百分之九十的问题来自多余操作**，倘若出现任何问题，请尝试回退操作  
  
> 在 vi/vim 编辑器中，`:wq`是保存并退出，`:q!`是不保存退出  
> 在 nano 编辑器中 Ctrl + W 快捷键是查找文本，但是与 web 界面关闭页面冲突，所以可以用 Ctrl + Q 代替。Ctrl + X 是退出，会询问是否保存   
> `apt --fix-broken install` 常用于修复依赖问题  

> 请注意！在愉快的Ctrl + C 中，40%的报错来源于复制中产生的零宽空格，如果有`\u{200b}`的字样，那就是了，多检查几遍（虽然你也看不见  

<hr />

## 01.PVE 安装时卡死

如果你有一张独立显卡，那么在安装 PVE 时可能会卡在 Loading Driver...，这是因为缺少显卡驱动导致的

解决方法：

- 启动 Proxmox VE 安装程序
  启动计算机并进入 Proxmox VE 的引导程序菜单
- 选择安装选项：
  在引导菜单中，使用箭头键选择“Install Proxmox VE (Terminal UI)”选项
- 编辑引导参数：
  按下键盘上的 e 键进入编辑模式
- 修改 Linux 引导行：
  使用箭头键导航到以 linux 开头的那一行。
  将光标移动到该行的末尾
- 添加 nomodeset 参数：
  在该行的末尾，确保与最后一个参数之间有一个空格，然后输入 nomodeset。
  启动安装程序：
  完成编辑后，按下 Ctrl + X 或 F10 键（具体取决于系统提示）以启动安装程序

将通过禁用图形化模块解决该问题

<hr />

## 02._PVE 网卡莫名其妙掉线问题 不确定_

~~网上看到的原因基本是 intel 的网卡所致，怀疑是驱动兼容性问题~~  
有可能，不确定（这是网上的教程

```shell
# 先安装工具
apt -y install ethtool
ethtool -K eno1 tso off gso off
# 修改vi /etc/network/interfaces ，在iface eno1 inet manual下新增post-up ethtool -K eno1 tso off gso off
auto lo
iface lo inet loopback

iface eno1 inet manual
        post-up ethtool -K eno1 tso off gso off   #  新增这句

auto vmbr0
iface vmbr0 inet static
        address 192.168.1.33/24
        gateway 192.168.0.1
        bridge-ports eno1
        bridge-stp off
        bridge-fd 0

source /etc/network/interfaces.d/*
```
<hr />

## 03.LVM精简池空间耗尽

由于我之前的铸币操作，更换硬盘没有扩大LVM精简池，导致爆满  
故障表现：某个虚拟机失去响应，显示IO错误  
LVM精简池 (local-lvm) 已100%耗尽  
``` shell
# 系统日志类似报错
Dec 04 17:23:53 pve kernel: device-mapper: thin: 252:4: reached low water mark for data device: sending event.
Dec 04 17:23:53 pve kernel: device-mapper: thin: 252:4: switching pool to out-of-data-space (queue IO) mode
Dec 04 17:24:54 pve kernel: device-mapper: thin: 252:4: switching pool to out-of-data-space (error IO) mode
```

此时应该立即停止错误的虚拟机，然后扩展精简池  
``` shell
# 扩展data逻辑卷（使用所有可用空间或部分空间）
lvextend -l +100%FREE pve/data

# 或者指定扩展大小（例如扩展50G）
lvextend -L +50G /dev/pve/data

# 验证扩展结果
lvs
pvesm status
```

为了防止以后又出现类似状况，设置一个阈值警告脚本

``` shell
cat > /usr/local/bin/pve-warn.sh << 'EOF'
#!/bin/bash
# 85以上显示严重警告

thin_usage=$(lvs pve/data -o data_percent --noheadings 2>/dev/null | tr -d ' ' | cut -d. -f1)
if [ -n "$thin_usage" ] && [ "$thin_usage" -ge 85 ]; then
    echo "警告！精简池使用率: ${thin_usage}%"
fi

pvesm status | grep "100.00%" && echo "警告！有存储已满！"
EOF

chmod +x /usr/local/bin/pve-warn.sh
```
<hr />


## 04.Ubuntu 空间仅占用一半

在安装 ubuntu server 的过程中，默认只占用一半磁盘空间，如果想补救如下

使用 `df -h` 命令显示文件系统的总空间和可用空间信息

使用 `sudo vgdisplay` 命令查看发现 Free PE / Size 还有 剩余空间

```shell
 sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv # 调整逻辑卷的大小

 sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv # 调整文件系统的大小

 df -h # 再次查看，确认文件系统的总空间大小调整成功
```

<hr />

## 05.PVE储存库提示

在修改`/etc/apt/sources.list.d/debian.sources`后  
pve 的 _"更新>存储库"_ 页面报错有可能出现警告 “_没有启用 proxmox ve 存储库没有得到任何更新_”  
**忽视**，反正也不更新（打开这玩意能卡死我）  

屏蔽PVE 9.x 与8.x 版本系统无有效订阅提示弹窗的方法  
``` shell
cp /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js.bak

line_num=$(grep -n "res.data.status.toLowerCase() !== 'active'" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js | head -1 | cut -d: -f1)
sed -i "${line_num}s/!==/===/" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js

systemctl restart pveproxy              
```

<hr />

## 06.C6-State导致PVE崩溃

不知道为什么PVE运行一段时间会莫名其妙崩溃，且系统日志没有记录  
事后调查发现是**AMD Ryzen 1700X（初代锐龙/Zen 1）启用了C6 State模式自动节能卡死**  
参考文献：  
[https://blog.csdn.net/qq_33026779/article/details/145600293](https://blog.csdn.net/qq_33026779/article/details/145600293)  
[https://forum.proxmox.com/threads/pve-6-raidz2-freeze-every-day-ryzen-7-1700.66629/](https://forum.proxmox.com/threads/pve-6-raidz2-freeze-every-day-ryzen-7-1700.66629/)  

解决方法：进入主板bios，将**Global C-State Control**设置为disabled

<hr />

## 07.BIOS时区错误

在设置自动开机的时候，我发现主板BIOS时间与PVE系统时间差了8小时  
调查原因：  
PVE默认将BIOS时间视为UTC时间，而上海时间（CST）是UTC+8，因此系统会自动将BIOS时间减去8小时以“对齐”时区
解决方法：  
``` shell
timedatectl set-local-rtc 1
# 作用：直接设置硬件时钟（RTC）使用本地时间（上海时间），停止UTC转换
```
验证命令：
``` shell
timedatectl | grep "RTC in local TZ"
# 若显示yes即生效
```

<hr />

## 08.PVE开机显示ZFS导入错误

在将硬盘直通给TrueNAS后，PVE仍会尝试挂载ZFS，同时访问**可能**会导致**数据损坏**  
所以应该确保 PVE 宿主机不主动挂载或导入该 ZFS 池，而是由 TrueNAS 虚拟机独占访问  

立即导出 ZFS 池(如果已导入)
``` shell
zpool export MtData
```
因为我的PVE系统没有使用ZFS作为根文件系统，而是使用**LVM+ext4**  
所以我直接简单粗暴，完全移除ZFS工具  
``` shell
sudo apt purge zfsutils-linux zfs-zed -y
```

<hr />
