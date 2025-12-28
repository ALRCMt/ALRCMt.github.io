---
title: Ubuntu系统配置
author: ALRCMt
date: 2025-06-13
category: Jekyll
layout: post
---

**其实大部分操作主要通过Docker完成**

<hr />

### 1.安装 Docker ~~_最折磨人的一集_~~(其实还好)

~~由于国内网络问题（最折磨），Docker 使用阿里云镜像源安装~~  
目前 Docker 安装的网络问题得到了改善

在 ubuntu 控制台输入以下命令  
_Web页面粘贴板不互通无法复制？请用 ssh 连接  
~~无法 ssh？可能解决方案~~ 没什么_

```shell

# 在安装 Docker 之前，我们需要安装一些必要的依赖包。运行以下命令：
sudo apt install apt-transport-https ca-certificates curl software-properties-common

apt install -y docker.io  docker-compose # 安装docker
docker version # 验证安装

```

现在 Docker 已经安装完毕，但是拉取镜像的网络环境依旧~~十分~~很他妈糟糕，所以先不拉取 hello-world 测试，等会教学配置加速地址

<hr />

### 2.安装 Docker 可视化工具 DPanel

DPanel 是一款**轻量化**的 Docker 可视化插件  
使用如下命令下载 Dpanel lite 版镜像  
官方教程：[https://dpanel.cc/install/docker](https://dpanel.cc/install/docker)

```shell
docker pull registry.cn-hangzhou.aliyuncs.com/dpanel/dpanel:lite
```

之后使用如下命令运行 Dpanel 容器

```shell
docker run -d --name dpanel --restart=always \
 -p 80:80 -p 443:443 -p 8807:8080 -e APP_NAME=dpanel \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /home/dpanel:/dpanel registry.cn-hangzhou.aliyuncs.com/dpanel/dpanel:lite
```

DPanel 管理地址：Ubuntu 网络地址加端口 8807  
快速使用教程：[一款更适合国人的 Docker 可视化管理工具](https://www.bilibili.com/video/BV1gDc9eaEBv/?spm_id_from=333.337.search-card.all.click&vd_source=2a55d6df129012c2f31dfcad634bc9de)

<hr />

### 3.Docker 镜像仓库加速

**I.命令行加速**

编辑`/etc/docker/daemon.json`，加入以下内容

```shell
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.m.daocloud.io",
    "https://registry.cn-hangzhou.aliyuncs.com"
  ],
}
```

保存并退出

**II.面板加速**

在 DPanel 内选择**仓库管理**，编辑 Docker Hub 仓库  
添加加速地址，下面有推荐加速地址  
<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20151557.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20151557.png" alt="" width="700px">
  </a>
</figure>

如果你要加速别的仓库，请**添加仓库**，然后配置加速，[可添加仓库](https://dpanel.cc/manual/image-registry)

<hr />

### 4.数据卷的创建、挂载、查看、删除

挂载数据卷可能比较好操作  
如果你偏爱用命令行操作，那么如下

```shell
docker volume create my-vol # 创建一个数据卷

docker volume ls # 查看所有的数据卷

docker volume inspect my-vol # 查看指定数据卷的信息

docker volume rm my-vol # 删除数据卷
```

将数据卷挂载在容器的固定目录

```shell
docker run -it -v [数据卷名字]:[容器目录] [镜像名称]
```

如果你想用图形化操作，如下
打开 DPanel 的 web 页面，选择储存管理

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20145725.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20145725.png" alt="" width="700px">
  </a>
</figure>
然后创建储存卷，名称随便，其它默认，然后确定

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20145806.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20145806.png" alt="" width="300px">
  </a>
</figure>

<hr />

### 5.将 TrueNAS 存储池挂载到指定目录

> _注意！！！ 配合[NFS 共享配置](/jekyll/2025-06-12-Apply.html#4nfs-%E5%85%B1%E4%BA%AB%E9%85%8D%E7%BD%AE)、[数据卷的创建挂载](#4数据卷的创建挂载查看删除)使用，将存储池挂到数据卷的挂载点_

```shell
sudo apt update # 更新系统存储库索引
sudo apt install nfs-common # 安装 NFS 客户端包

sudo mount [NFS _IP]:/[NFS_export] [Local_mountpoint] # 将NFS服务器共享目录挂载到客户端的挂载点目录

# NFS_IP 是 NFS 服务器的 IP 地址
# NFS_export 是 NFS 服务器上的共享目录
# Local_mountpoint 是客户端系统上的挂载点目录

mount | grep nfs # 查看已挂载的NFS共享目录，确认挂载成功

sudo nano /etc/fstab # 设置 NFS 文件在系统启动时自动挂载

# 然后使用以下格式在 /etc/fstab 文件中添加条目

[NFS _IP]:[NFS_export] [Local_mountpoint] nfs defaults 0 0   # NFS 服务器:服务器共享目录 目录挂载点 nfs 默认 0 0

# 然后保存并退出
```

卸载 NFS 挂载

```shell
umount [mount_point] # [mount_point]是挂载目录

# 如果该目录正在被使用或者已经被其他进程打开，你可能会收到一个错误消息。在这种情况下，可以尝试使用以下命令强制取消挂载

umount -f [mount_point]

mount | grep nfs # 最后，检查挂载是否成功取消
```
<hr />

### 6.Docker 部署 Resilio Sync

通过 DPanel 图形化操作，打开容器列表，创建容器，然后拉取镜像，镜像地址`resilio/sync:latest`

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20151320.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20151320.png" alt="" width="600px">
  </a>
</figure>
<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152541.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152541.png" alt="" width="600px">
  </a>
</figure> 
等待镜像拉取完成，大部分设置已经设置好了
只需要绑定端口，如图  

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152732.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152732.png" alt="" width="500px">
  </a>
</figure>

然后挂载数据卷，选择添加映射目录  
左侧填你创建的数据卷名称，右侧填容器内目录，目录最好是/mnt/sync/folders/\*，不然可能会没权限

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152741.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-10%20152741.png" alt="" width="500px">
  </a>
</figure>

在运行配置页面，重启策略选择**未手动停止则重启**  
最后选择**提交**，容器就创建并运行了

Resilio Sync 管理地址：Ubuntu 网络地址加端口 8888  
使用教程（更多还是自己摸索吧）：[https://zhuanlan.zhihu.com/p/745919095](https://zhuanlan.zhihu.com/p/745919095)

如果你的服务器有公网地址的话，请在备份端取消 **“使用中继服务器”**（真的很慢）  
然后选择 **“预定义主机”** ，填写ip与对应端口

<figure class="image-preview">
  <a href="/images/sync2.png" class="preview-link">
    <img src="/images/sync2.png" alt="" width="400px">
  </a>
</figure>

<figure class="image-preview">
  <a href="/images/sync1.png" class="preview-link">
    <img src="/images/sync1.png" alt="" width="600px">
  </a>
</figure>


<hr />

### 7.Docker 部署 immich
通过 Dpanel 图形化操作，使用Docker Compose部署 

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20145611.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20145611.png" alt="" width="650px">
  </a>
</figure>  

选择Compose，**创建任务**，名称随便  
下载yaml文件和env文件导入：[https://immich.app/docs/install/docker-compose](https://immich.app/docs/install/docker-compose)  

> 因为我要用immich管理相机备份，文件在link.nas数据卷，所以编辑yaml  
> 修改如下内容，将宿主机路径 /var/lib/docker/volumes/link.nas/_data 挂载到容器内的 /mnt/nas 

``` shell
services:
  immich-server:
    volumes:
      - ./immich-data:/usr/src/app/upload  # 保留原始卷
      - /var/lib/docker/volumes/link.nas/_data:/mnt/nas  # 新增挂载点
    # 其他配置保持不变...

  immich-microservices:
    volumes:
      - ./immich-data:/usr/src/app/upload  # 保留原始卷
      - /var/lib/docker/volumes/link.nas/_data:/mnt/nas  # 新增挂载点
    # 其他配置保持不变...
```

填写环境变量   
`UPLOAD_LOCATION`：图片存储位置  
`DB_DATA_LOCATION`：数据库文件存储位置  
`# TZ`：时区

这是我填的  
<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20150025.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20150025.png" alt="" width="380px">
  </a>
</figure>  
<img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20152101.png" alt="" width="200px"/>  
然后**提交**，点击详情，选择**启动**  
<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20153548.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20153548.png" alt="" width="350px">
  </a>
</figure>
等待镜像拉取完成，如果出现`运行中(4)`就好了    
<figure class="image-preview">
  <a href="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20154355.png" class="preview-link">
    <img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20154355.png" alt="" width="700px">
  </a>
</figure>
管理地址：Ubuntu 网络地址加端口 2283  
管理我的相机备份：添加外部图库，选择路径是之前映射到容器内的路径  
然后扫描，等待，完成，其他教程自己网上搜去  
官方文档：[https://immich.app/docs/overview/welcome](https://immich.app/docs/overview/welcome)   

> 一定要使四个容器都拉取完成，可能有点慢  
> 如果出现报错`error response from daemon: get "https://ghcr.io/v2/": not found`  
> 那就是网络问题，如果你已经配置了加速  
> 那么，似乎没有更好的办法，**祈祷**吧

<img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20161707.png" alt="" width="200px"/>
> 小贴士：上半夜Docker Hub的网络很差

<hr />

### 8.Docker 部署 V2rayA

**请确保你有可用稳定的代理地址**

选择**Compose**，创建任务，yaml如下

``` shell
version: '3.8' 
services:
  v2raya:
    image: mzz2017/v2raya
    restart: always
    container_name: v2raya
    network_mode: host 
    privileged: true 
    cap_add:    
      - NET_ADMIN
      - SYS_MODULE
    ports:
      - "2017:2017"
      - "7890:7890"
    volumes:
      - ./etc:/etc/v2raya
```
**提交**，**启动**，等待镜像拉取完成  
浏览器访问地址 http://ip:2017  
打开v2rayA，创建管理员账号  
以创建或导入的方式导入节点，导入支持节点链接、订阅链接  

点击右上角的设置，开启ip转发和端开分享，根据自己的需求设置  
<figure class="image-preview">
  <a href="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20232009.png" class="preview-link">
    <img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20232009.png" alt="" width="450px">
  </a>
</figure>

然后回到首页，选择一个节点点击连接后，在点击左上角的启动按钮启动即可  
<figure class="image-preview">
  <a href="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20231749.png" class="preview-link">
    <img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20231749.png" alt="" width="750px">
  </a>
</figure>
<hr />

### 9.配置Socks5代理

安装proxychains工具  
``` shell
sudo apt update 
sudo apt install proxychains
```
编辑 `/etc/proxychains.conf`  
在 /etc/proxychains.conf 增加socks5，同时注释掉socks4的内容：
``` shell
# socks4 127.0.0.1 9050
socks5 [部署v2raya的服务器ip] 端口号
```
例如我在 IP 为 10.168.1.165 的服务器上，部署了v2rayA，同时开启了端口分享  
并且查看到了socks5的端口号是20170，那么就将proxychains的配置文件改为：    
``` shell
# socks4 127.0.0.1 9050
socks5 10.168.1.165 20170 # 如果是本机使用，ip可改为127.0.0.1
```
访问谷歌测试是否成功  
``` shell
proxychains curl https://www.google.com
```
出现以下内容就算成功  
<figure class="image-preview">
  <a href="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20234722.png" class="preview-link">
    <img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-17%20234722.png" alt="" width="550px">
  </a>
</figure>
<br />

<hr />

### 10.Docker部署qBittorrent WebUI
通过Docker Compose部署

编辑yaml文件
 ``` shell
version: "3"
services:
  qbittorrent:
    image: linuxserver/qbittorrent
    container_name: qbittorrent
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai 
      - UMASK_SET=022
      - WEBUI_PORT=8085  # Web UI端口
      - TORRENTING_PORT=26881 # 监听端口，默认6881，修改为20000-65535区间值，下同
    volumes:
      - /vol1/1000/docker/qbittorrent/config:/config  
      - /var/lib/docker/volumes/link.nas/_data/下载:/downloads 
    ports:
      - 8085:8085  # 同上面Web UI端口一致
      - 26881:26881
      - 26881:26881/udp
    restart: unless-stopped
```
**提交**，**启动**
管理界面：http://ip:8085
用户admin，临时密码可以在日志中看见
> 小提示  
> 如果遇到管理界面打不开或显示**unauthorized**
> 请想办法换一个内核的浏览器（自己想办法）  
> 登录后在设置>WebUI中去掉 _启用跨站请求伪造 (CSRF) 保护_ 然后保存

<figure class="image-preview">
  <a href="/images/bt.png" class="preview-link">
    <img src="/images/bt.png" alt="" width="600px">
  </a>
</figure>

怎么用自己搜去，记得把下载文件夹别搞错了

<hr />

### 11.Docker部署OpenList 
OpenList是Alist的社区版本，这里选择哪个其实大差不差，教程也差不多

创建容器，拉取`openlistteam/openlist:latest`，绑定端口，把要用的文件夹挂好  
然后端口5244 ，登录  
官方文档：[https://www.oplist.org.cn/](https://www.oplist.org.cn/)
使用教程网上一大把

<hr />

### 12.Docker部署AriaNG
发现有些功能qB还是没有Aria2方便，选择了Aria2的WebUI版本  
Github链接：[https://github.com/mayswind/AriaNg](https://github.com/mayswind/AriaNg)

使用Docker Compose部署  
Yaml文件如下
``` shell
version: "3.1"
services:
  aria2:
    image: superng6/aria2:latest
    container_name: aria2
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - SECRET=Aw112211
      - CACHE=512M
      - PORT=6800
      - WEBUI=true
      - WEBUI_PORT=8086
      - BTPORT=32516
      - UT=true
      - QUIET=true
      - SMD=true
    volumes:
      - ./config:/config
      - /var/lib/docker/volumes/link.nas/_data/下载:/downloads #这里是把/downloads挂在TrueNAS的nfs上了
    restart: unless-stopped
```
拉取完成后打开8086端口，第一次登录管理端会提示”认证失败“  
这是因为aria2设置了密码，需要在设置中配置上密码即可  
之后使用RPC推送时，就填上相应ip与密码
<figure class="image-preview">
  <a href="/images/RPC.png" class="preview-link">
    <img src="/images/RPC.png" alt="" width="700px">
  </a>
</figure>

  
请注意，如果你需要公网访问Aria2NG，你会发现PRC协议强制使用https，所以请使用有TLS的公网RPC地址  


<figure class="image-preview">
  <a href="/images/RPC2.png" class="preview-link">
    <img src="/images/RPC2.png" alt="" width="700px">
  </a>
</figure>

如果要使用IPV6，请直接在配置文件里修改 **“禁用IPV6：否”** ，web界面改不了  

<figure class="image-preview">
  <a href="/images/RPC3.png" class="preview-link">
    <img src="/images/RPC3.png" alt="" width="700px">
  </a>
</figure>