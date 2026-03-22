---
title: 附加教程
author: ALRCMt
date: 2026-02-07
category: Jekyll
layout: post
---

以下为附加教程，一些我认为不是必要的配置，但是由于某些原因，可能会有人像我一样需要，所以就贴出来了

<hr />

## 01.PVE概要显示硬件监控信息

通过 shell 脚本自动配置，省时省力省心  
脚本来源：[https://github.com/ALRCMt/pve-manager-remix](https://github.com/ALRCMt/pve-manager-remix)  
运行这段指令：

```shell
bash -c "$(curl -fsSL https://raw.githubusercontent.com/ALRCMt/pve-manager-remix/refs/heads/main/merged-script.sh)"
```

然后刷新页面就可以了，预览如下

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/pve-manager-remix/raw/main/view.png" class="preview-link">
    <img src="https://github.com/ALRCMt/pve-manager-remix/raw/main/view.png" alt="" width="900px">
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
> 如果你是 AMD 的 CPU，当输入`sensors`后如下图  
> SYSTIN 是主板南桥温度  
> AUXTIN 是电源温度（前提是你有传感器，否则数据无效）  
> CPUTIN 是主板监控的 CPU 温度  
> Tctl/Tdie 是 CPU 为降温虚标的高温，目的是使风扇转速加快  
> 详细见 [https://ngabbs.com/read.php?tid=42423467&rand=200](https://ngabbs.com/read.php?tid=42423467&rand=200)

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2411.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2411.png" alt="" width="700px">
  </a>
</figure>

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

编辑GRUB配置文件：
``` shell
bash
nano /etc/default/grub
```
``` shell
GRUB_CMDLINE_LINUX_DEFAULT="quiet video=1366x768"  
#这一行结尾添加你想要的分辨率，比如video=1366x768，请注意这里面不要有nomodeset 参数
```
然后更新并重启
```shell
update-grub
reboot
```
如果失败，有可能是 `/etc/default/grub.d/ `目录中文件问题  
我这里是因为`/etc/default/grub.d/installer.cfg`  
它里面的一行配置 `GRUB_CMDLINE_LINUX="$GRUB_CMDLINE_LINUX nomodeset"`，会在生成GRUB配置时，强制给所有内核启动行添加 nomodeset 参数  
注释掉就好了

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

编辑`/etc/default/grub`  
添加关键的PCIe ACS覆盖参数，这个参数能帮助系统更好地分离PCIe设备
``` shell
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on pcie_acs_override=downstream,multifunction video=1366x768" 
# 我的如上，若是是Intel处理器，改成 intel_iommu=on
```

查看要直通的显卡，并记住PCIe通道，比如25:00
``` shell
lspci -nn | grep -E 'VGA|3D'
```

进一步查看，输出应包含视频与音频的ID，记下这些ID 如10de:128b和 10de:0e0f
```
lspci -nn | grep -E "25:00"
```
输出应类似如下  
```shell
root@pve:~# lspci -nn | grep -E 'VGA|3D'
25:00.0 VGA compatible controller [0300]: NVIDIA Corporation GK208B [GeForce GT 710] [10de:128b] (rev a1)
26:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Cedar [Radeon HD 5000/6000/7350/8350 Series] [1002:68f9]

root@pve:~# lspci -nn | grep -E "25:00"
25:00.0 VGA compatible controller [0300]: NVIDIA Corporation GK208B [GeForce GT 710] [10de:128b] (rev a1)
25:00.1 Audio device [0403]: NVIDIA Corporation GK208 HDMI/DP Audio Controller [10de:0e0f] (rev a1)
```

创建VFIO配置文件（如果已存在则编辑）：
``` shell
nano /etc/modprobe.d/vfio.conf
```
在文件中添加或确保有类似以下内容（请使用你上一步确认的ID）：
```shell
options vfio-pci ids=10de:128b,10de:0e0f
```
这行命令告诉系统：对设备ID为 10de:128b 和 10de:0e0f 的PCI设备，使用 vfio-pci 驱动

将VFIO相关模块加入启动加载列表：
```shell
nano /etc/modules
```
在文件末尾添加以下几行（如果它们不存在）：
```shell
bash
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```
更新初始内存盘并重启
```shell
bash
update-initramfs -u -k all
reboot
```
重启后，通过SSH重新登录PVE，运行以下命令验证：

```shell
lspci -knn -s 25:00 # 检查NVIDIA显卡的驱动是否已变为vfio-pci

lsmod | grep vfio # 检查vfio-pci驱动是否正常加载
```
预期结果：  
在 `lspci` 的输出中，25:00.0 和 25:00.1 的 Kernel driver in use: 一行应该显示为 vfio-pci  
`lsmod` 应显示 vfio_pci、vfio_iommu_type1 等模块  

接下来，需要为Windows通上显卡及其音频设备，由于WEB页面有点问题，编辑配置文件  
添加PCI设备，再修改显示设备，保留一个基础的虚拟显示设备
```shell
/etc/pve/qemu-server/103.conf #这里的103是虚拟机ID，请自行修改
```
```shell
bios: ovmf
boot: order=ide0;net0;ide2
cores: 4
cpu: host
efidisk0: local-lvm:vm-103-disk-0,efitype=4m,pre-enrolled-keys=1,size=4M
hostpci0: 0000:25:00.0,pcie=1,x-vga=1,rombar=1 # 新增这两行，这一行是显卡
hostpci1: 0000:25:00.1,pcie=1                  # 这一行是音频设备
......
vga: virtio # 这里改成 virtio 作为后台的“影子”显示设备，满足PVE管理界面
......
```

保存并重启，将你的外接屏幕插在对应显卡上，一开始本地屏幕可能卡在PVE画面（如下），WEB上会先出现画面  
只需要等待显卡自动打上驱动，本地屏幕就可以看见了  

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2441.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2441.png" alt="" width="600px">
  </a>
</figure>

<hr />

## 06.USB直通虚拟机

没时间了

<hr />


## 07.ServerBox设备监测器

[**ServerBox00Monitor**](https://github.com/lollipopkit/server_box_monitor/blob/main/README_zh.md)是一个运行在服务器端的应用程序  

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2442.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2442.png" alt="" width="500px">
  </a>
</figure>

配合[**Flutter Server Box**](https://github.com/lollipopkit/flutter_server_box/blob/main/README_zh.md)提供服务器状态图表和管理工具

我主要用于IOS的桌面组件查看ImmortalWrt的状态，请先安装**Server Box**  
由于ImmortalWrt系统安装与其[Wiki实例](https://github.com/lollipopkit/server_box_monitor/wiki)不同，故此给出教程 

```shell
# 随便进一个目录
cd /mnt

# 下载你确认的版本
wget https://github.com/lollipopkit/server_box_monitor/releases/download/v0.1.10/server_box_monitor_0.1.10_linux_arm64.tar.gz

# 解压
tar -xzf server_box_monitor_0.1.10_linux_arm64.tar.gz

# 移动二进制
mv server_box_monitor /usr/bin/
chmod +x /usr/bin/server_box_monitor

# 验证
file /usr/bin/server_box_monitor
```

然后创建服务脚本，这里与Wiki不同，用procd服务代替systemd
```shell
nano /etc/init.d/server_box_monitor
```
``` shell
#!/bin/sh /etc/rc.common

USE_PROCD=1
START=95
STOP=01

start_service() {
    # 关键：先进入 root 目录，保证相对路径正确
    cd /root
    
    procd_open_instance
    procd_set_param command /usr/bin/server_box_monitor
    procd_append_param command serve
    # procd_append_param command --addr 0.0.0.0:3770
    procd_set_param respawn
    procd_set_param stderr 1
    procd_set_param stdout 1
    procd_set_param user root
    
    # 显式指定配置文件路径
    procd_set_param env HOME=/root
    
    procd_close_instance
}
```
```shell
# 赋予操作权限
chmod +x /etc/init.d/server_box_monitor
# 根据需求编辑配置文件
nano /root/.config/server_box/config.json
```
配置文件可配置端口、主机名及推送机制等，具体看[Wiki](https://github.com/lollipopkit/server_box_monitor/wiki)    
注意记得删掉注释......本人的配置：[**config.json**](https://github.com/ALRCMt/MtAIO-Build/blob/aa627fa453bbd3367d1b80d7bf7b833bd134c6f7/immortalwrt/ServerBox/config.json)  
```shell
# 启用开机自启
/etc/init.d/server_box_monitor enable

# 启动服务
/etc/init.d/server_box_monitor start

# 查看进程
ps | grep server_box_monitor | grep -v grep
```
最后启动并访问相应地址 如 http://DEVICE_IP:3770/status  
若看见json格式的输出就OK了  

<hr />

## 08.自动定时开关机

编辑Lucky内**计划任务**

开机可以网络唤醒，而关机需要自定义脚本  
不知道为什么，我这里Lucky自定义脚本没法直接密钥SSH  
（浪费了我很多时间，烦死了，有兴趣自己折腾去，注意一下ImmortalWRT创建密钥是dropbearkey）  
所以安装`shpass`包来代替，缺点就是脚本里密码是明文，所以要注意  
 
`nano /mnt/pve_shutdown_pass.sh`创建脚本，编辑内容如下，替换 {YOURIP} {KEY}  

``` shell
#!/bin/ash
PVE_HOST="{YOURIP}"
PVE_PASSWORD="{KEY}"

sshpass -p "$PVE_PASSWORD" ssh -o StrictHostKeyChecking=no root@"$PVE_HOST" "shutdown -h +10 '系统将在10分钟后关机进行日常维护，请保存您的工作，如需取消：shutdown -c'"

```

最后在自定义脚本里填`/mnt/pve_shutdown_pass.sh`

<hr />

## 09.RAX3000M 5G功率增强

下面命令命令行执行, 直接修改e2p文件, 改5G信号由24dB到25dB

```shell
printf '\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B\x2B' > /tmp/tmp.bin && dd if=/tmp/tmp.bin of=/lib/firmware/e2p bs=1 seek=$((0x445)) conv=notrunc
```

方法来源:  
[RAX3000M-237大佬仓库编译自用闭源固件24.10内核版本6.6.95及无线改最大功率方法1-9](https://www.right.com.cn/forum/thread-8433653-1-1.html)   
[MT798X CPU超频1.65G/一键修改无线最大功率方法](https://www.right.com.cn/forum/thread-8387979-1-1.html) 

<hr />

## 10.PVE散热风扇控制


```shell
# 更新系统
apt update
# 安装 lm-sensors 和 fancontrol
apt install lm-sensors fancontrol -y
# 安装硬盘温度检测工具
apt install smartmontools -y

# 扫描你的硬件，询问是否加载对应的内核驱动, 你只需要一路按 Enter 键，选择默认的 YES 即可
sensors-detect 
``` 
由于某些原因，drivetemp 模块不会默认加载，所以先手动加载  
在`/etc/modules`末尾加一行`drivetemp`来开机自加载
```shell
#手动加载 drivetemp
modprobe drivetemp

# 查看所有hwmon设备和温度
for hwmon in /sys/class/hwmon/hwmon*; do
    echo "=== $hwmon ($(cat $hwmon/name 2>/dev/null)) ==="
    for temp in $hwmon/temp*_input; do
        if [ -f "$temp" ]; then
            temp_val=$(cat $temp 2>/dev/null)
            temp_c=$((temp_val / 1000))
            echo "  $(basename $temp): $temp_c°C"
        fi
    done
    echo ""
done
```


运行配置向导`pwmconfig`，你会看到一个交互式界面，下面是流程：

初始警告：脚本会提示它将停止当前的风扇控制服务（如果存在），并让风扇全速运行一小段时间以进行测试。这是正常的，同意即可  

然后检测PWM控制接口：脚本会列出所有找到的、可能支持调速的风扇接口,如 hwmon1/pwm1, hwmon1/pwm2...（你最好弄清楚哪个是哪个风扇）  
为每个接口关联温度传感器：对于每一个检测到的PWM接口，脚本会询问你希望它跟随哪个温度传感器的变化，再设定风扇转速变化的温度区间与最高风扇速度

你也可以自行修改`/etc/fancontrol`

- INTERVAL：fancontrol 读取温度并调整风扇的间隔时间，单位是秒  
- FCTEMPS：核心关联。格式是 PWM设备=温度设备，定义了哪个风扇接口听命于哪个温度传感器  
- MINTEMP / MAXTEMP：定义了风扇转速变化的温度区间。低于 MINTEMP 用最小PWM，高于 MAXTEMP 用最大PWM，之间线性变化  
- MINPWM / MAXPWM：定义了PWM值的变化范围。0 通常代表停转，255 代表全速  
- MINSTART / MINSTOP：这两个值用于解决风扇的启动-停止 hysteresis（迟滞）问题。因为风扇需要一定的初始电压（PWM值）才能开始转动，一旦转动后，维持转动所需的最小PWM值（MINSTOP）通常低于启动值（MINSTART）。正确设置可以避免风扇在低速区间反复启停  

我的如下：
```shell
# Configuration file generated by pwmconfig, changes will be lost
INTERVAL=10
DEVPATH=hwmon0=devices/platform/nct6775.2592 hwmon1=devices/pci0000:00/0000:00:18.3
DEVNAME=hwmon0=nct6795 hwmon1=k10temp
FCTEMPS=hwmon0/pwm2=hwmon1/temp1_input hwmon0/pwm5=hwmon3/temp1_input hwmon0/pwm4=hwmon0/temp1_input
FCFANS=hwmon0/pwm2=hwmon0/fan2_input hwmon0/pwm5=hwmon0/fan5_input hwmon0/pwm4=hwmon0/fan4_input
MINTEMP=hwmon0/pwm2=40 hwmon0/pwm5=35 hwmon0/pwm4=30
MAXTEMP=hwmon0/pwm2=70 hwmon0/pwm5=45 hwmon0/pwm4=50
MINSTART=hwmon0/pwm2=100 hwmon0/pwm5=100 hwmon0/pwm4=100
MINSTOP=hwmon0/pwm2=50 hwmon0/pwm5=45 hwmon0/pwm4=40
#注意必须MINSTOP ≥ MINPWM
MINPWM=hwmon0/pwm2=30 hwmon0/pwm4=0 hwmon0/pwm5=0
MAXPWM=hwmon0/pwm2=255 hwmon0/pwm5=255 hwmon0/pwm4=255
```
设置好保存就可以启动了  
```shell
#启动服务
systemctl start fancontrol

#设置开机自启
systemctl enable fancontrol

#查看运行状态
systemctl status fancontrol
```

<hr />

## 11.Cloudflare回源规则
在使用DDNS将IPV6地址解析到指定域名时，只能使用默认的80端口（如果打开Cloudflare代理）  
但是我们有不止一个服务，解决方法之一是一个子前缀全部解析到路由器IPV6（关闭Cloudflare代理），再由路由器根据主机名转发，弊端是不很安全以及纯IPV6网络无法访问  
为了解决这个问题，还可以使用[Cloudflare Origin Rules](https://developers.cloudflare.com/rules/origin-rules/)来重写到非80端口   

回源规则实际上还支持修改主机标头、SNI和DNS，但是这些都要钱....  
不过好在Free计划还可以修改端口，可以多创建几个规则导向不同的端口（虽然也最多只能加10个  

不仅如此回源规则还可以筛选主机名、地区、请求方式等等，这里不多介绍

<hr />