---
title: 问题事项
author: ALRCMt
date: 2025-06-30
category: Jekyll
layout: post
---


以下为我实际搭建过程中的一些问题与解决方法，以及一些附加教程  
热知识：**百分之九十的问题来自多余操作**，倘若出现任何问题，请尝试回退操作  
  
> 在 vi/vim 编辑器中，`:wq`是保存并退出，`:q!`是不保存退出  
> 在 nano 编辑器中 Ctrl + W 快捷键是查找文本，但是与 web 界面关闭页面冲突，所以可以用 Ctrl + Q 代替。Ctrl + X 是退出，会询问是否保存  

> 请注意！在愉快的Ctrl + C 中，60%的报错来源于复制中产生的零宽空格，如果有`\u{200b}`的字样，那就是了，多检查几遍（虽然你也看不见  

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
有可能，不确定

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

## 04.PVE概要显示硬件监控信息

通过 shell 脚本自动配置，省时省力省心  
脚本来源：[https://github.com/ALRCMt/pve-manager-remix](https://github.com/ALRCMt/pve-manager-remix)  
运行这段指令：

```shell
bash -c "$(curl -fsSL https://raw.githubusercontent.com/ALRCMt/pve-manager-remix/refs/heads/main/merged-script.sh)"
```

然后刷新页面就可以了，预览如下

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/pve-manager-remix/blob/main/view.png?raw=true" class="preview-link">
    <img src="https://github.com/ALRCMt/pve-manager-remix/blob/main/view.png?raw=true" alt="" width="900px">
  </a>
</figure>

至于具体温度，安装温度检测软件 sensors

```shell
apt install lm-sensors -y
```

传感器探测

```shell
sensors-detect
```

全部选择 yes 即可，可能其中一个地方提示 ENTER ，按 回车键 即可

~~最气人的是不知道为什么我这里死活不显示 CPU 各核心温度，所以其他我也懒得配置了~~

> AMD 的 U 不会显示各核心温度  
> 如果你是 amd 的 CPU，当输入`sensors`后如下图  
> SYSTIN 是主板南桥温度  
> AUXTIN 是电源温度（前提是你有传感器，否则数据无效）  
> CPUTIN 是主板监控的 CPU 温度  
> Tctl/Tdie 是 CPU 为降温虚标的高温，目的是使风扇转速加快  
> 详细见 [https://ngabbs.com/read.php?tid=42423467&rand=200](https://ngabbs.com/read.php?tid=42423467&rand=200)

<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-09%20224901.png" alt="" width="700px"/>

<hr />

## 05.Ubuntu 空间仅占用一半

在安装 ubuntu server 的过程中，默认只占用一半磁盘空间，如果想补救如下

使用 `df -h` 命令显示文件系统的总空间和可用空间信息

使用 `sudo vgdisplay` 命令查看发现 Free PE / Size 还有 剩余空间

```shell
 sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv # 调整逻辑卷的大小

 sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv # 调整文件系统的大小

 df -h # 再次查看，确认文件系统的总空间大小调整成功
```

<hr />

## 06.PVE储存库提示

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

## 07.C6-State导致PVE崩溃

不知道为什么PVE运行一段时间会莫名其妙崩溃，且系统日志没有记录  
事后调查发现是**AMD Ryzen 1700X（初代锐龙/Zen 1）启用了C6 State模式自动节能卡死**  
参考文献：  
[https://blog.csdn.net/qq_33026779/article/details/145600293](https://blog.csdn.net/qq_33026779/article/details/145600293)  
[https://forum.proxmox.com/threads/pve-6-raidz2-freeze-every-day-ryzen-7-1700.66629/](https://forum.proxmox.com/threads/pve-6-raidz2-freeze-every-day-ryzen-7-1700.66629/)  

解决方法：进入主板bios，将**Global C-State Control**设置为disabled

<hr />

## 08.BIOS时区错误

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

## 09.PVE开机显示ZFS导入错误

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

## 10.PVE降低功耗
CPU电源策略调整：
``` shell
# 安装 cpupower
apt install linux-cpupower

# 查看支持的 CPU 电源模式
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors

# 查看当前的 CPU 电源模式
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# CPU实时频率查看
watch -n 1 cpupower monitor

# 查看当前所有CPU的信息
cpupower -c all frequency-info

# 设置所有CPU为节能模式
cpupower -c all frequency-set -g powersave

# 设置所有CPU为性能模式
cpupower -c all frequency-set -g performance
```
<table>
<tr>
<th>电源模式</th><th>解释说明</th>
</tr>
<tr>
<th>performance</th><th>性能模式，将 CPU 频率固定工作在其支持的较高运行频率上，而不动态调节</th>
</tr>
<tr>
<th>userspace</th><th>系统将变频策略的决策权交给了用户态应用程序，较为灵活</th>
</tr>
<tr>
<th>powersave</th><th>省电模式，CPU 会固定工作在其支持的最低运行频率上</th>
</tr>
<tr>
<th>ondemand</th><th>按需快速动态调整 CPU 频率，没有负载的时候就运行在低频，有负载就高频运行</th>
</tr>
<tr>
<th>conservative</th><th>与 ondemand 不同，平滑地调整 CPU 频率，频率的升降是渐变式的，稍微缓和一点</th>
</tr>
<tr>
<th>schedutil</th><th>负载变化回调机制，后面新引入的机制，通过触发 schedutil sugov_update 进行调频动作</th>
</tr>
</table>	


``` shell
# 我这里设置CPU电源策略为模式conservative
cpupower -c all frequency-set -g conservative

```
~~设置机械硬盘休眠~~  
不建议这么做，有可能导致硬盘频繁启停，已删除相关内容

<hr />

## 11.PVE本地屏幕btm监控


## 12.显卡直通虚拟机

<hr />

## 13.机箱USB直通虚拟机

<hr />