---
title: 附加教程
author: ALRCMt
date: 2026-02-07
category: Jekyll
layout: post
---

以下为附加教程，一些我认为不是必要的配置，但是由于某些原因，可能会有人像我一样需要，所以就贴出来了

## 01.PVE概要显示硬件监控信息

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

## 02.PVE降低功耗
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

## 03.本地屏幕调整分辨率



<hr />


## 04.PVE本地屏幕btm监控

因为故障排除的需要，我的PVE一直连接这一块物理屏，但是平时空空荡荡又不好看，所以可以利用`bottom`做一个图形化系统监控  
由于bottom是一个第三方工具，你通常需要从它的GitHub发布页下载预编译的二进制文件。请先查看其GitHub仓库的最新版本  
``` shell
# 更新系统软件包列表
apt update
# 下载bottom的.deb安装包（示例为v0.9.0，请替换为最新版本）
wget https://github.com/ClementTsang/bottom/releases/download/0.9.0/bottom_0.9.0_amd64.deb
# 安装下载的.deb包
dpkg -i bottom_0.9.0_amd64.deb

``` 

安装完成后，直接在终端输入 `btm` 命令就可以启动bottom工具了  
快捷键可以用 `?` 查看
我选择编辑配置文件改了布局，而且我的终端只有8色，如果不一样请自行修改
配置文件路径：`~/.config/bottom/bottom.toml`  

``` shell
# ==========================================
# 配置文件
# ==========================================

# 刷新频率（毫秒）
update_rate = 1500

# 温度单位（服务器一般用摄氏）
temperature_type = "c"

# 服务器通常无电池，关闭以减少干扰
battery = false

# 主题（8 色终端只能用 default 才能显示颜色）
color = "default"

# 禁用 truecolor（8 色终端必须关闭）
truecolor = false

# 隐藏表格间空隙，提高信息密度
hide_table_gap = true

# 默认按 CPU 排序进程
default_process_sorting = "cpu"

# 显示平均 CPU 使用率
show_average_cpu = true

# 网络使用二进制前缀（MiB/GiB）
network_use_binary_prefix = true

# 不使用圆角边框（SSH 下更兼容）
use_dot = false

# 不使用进程树（更清晰）
process_tree = false

# ==========================================
# 自定义布局
# ==========================================

# 第一行：CPU（占比大）
[[row]]
  ratio = 35
  [[row.child]]
    type = "cpu"

# 第二行：内存 + 磁盘 I/O
[[row]]
  ratio = 25
  [[row.child]]
    type = "mem"
  [[row.child]]
    type = "disk"

# 第三行：网络
[[row]]
  ratio = 25
  [[row.child]]
    type = "net"

# 第四行：进程列表
[[row]]
  ratio = 15
  [[row.child]]
    type = "process"

# ==========================================
# END
# ==========================================

```

然后设置每次开机屏幕自动登录并执行btm  
只有在 本地屏幕（tty1） 才会自动运行 btm ，SSH 登录不会被影响  
``` shell
# 创建 override 目录
mkdir -p /etc/systemd/system/getty@tty1.service.d
# 直接编辑 override.conf
nano /etc/systemd/system/getty@tty1.service.d/override.conf
```
写入以下内容，我这里用户是root
``` shell
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin root --noclear %I $TERM
```
最后重载 systemd 并重启 tty1
``` shell
systemctl daemon-reload
systemctl restart getty@tty1
```
<hr />

## 05.显卡直通虚拟机

还没到货

<hr />

## 06.机箱USB直通虚拟机

没时间了

<hr />


