---
title: PVE电源控制面板PRO
author: ALRCMt
date: 2026-08-06 08:00:00 +08:00
category: Jekyll
layout: post
description: 本文介绍 PVE 电源控制面板 PRO 版本，在 PLUS 版本基础上新增多个针对 ImmortalWrt 路由器与 PVE 主机的增强脚本。内容包括 ctrl.sh（WRT 无线接口状态切换）、modify_firewall.sh（防火墙策略切换）、ser_status.sh（服务状态检测）以及 wrt_status.sh（返回硬件状态 JSON）等新增功能脚本，并展示完整的目录结构（index.html、cgi-bin 各脚本、SVG 图标等）。文章还说明部署前需确认 ImmortalWrt 上存在 Lucky、Aria2、Cloudflared、Openlist2、Passwall 等服务，以及 ServerBox 设备监测器对状态展示的支持，并附上效果图与 GitHub 源码仓库链接。
---

<hr />

其它配置与[PVE电源控制面板PLUS](/jekyll/2026-02-19-d10.html)一样，这里不再赘述  
额外新增 `ctrl.sh` 用于 WRT 无线接口状态切换，`modify_firewall.sh` 用于防火墙策略切换，`ser_status.sh` 用于服务状态检测，`wrt_status.sh` 返回硬件状态 JSON    
因为个人倾向的配置太多，没有放在**附加教程**  
这里只展示差异的内容，目录结构如下：

```
 /mnt/pve_web/  
      ├── index.html  
      ├── favicon.ico  
      ├── images/  
      │   ├── favicon.ico  
      │   ├── globe-solid-full.svg  
      │   ├── hard-drive-solid-full.svg  
      │   ├── memory-solid-full.svg  
      │   └── microchip-solid-full.svg  
      └── cgi-bin/  
         ├── ping_server.sh  
         ├── multi_shutdown.sh  
         ├── pve_wake.sh  
         ├── switch.sh  
         ├── ctrl.sh  
         ├── modify_firewall.sh  
         ├── ser_status.sh  
         └── wrt_status.sh
```
WEB文件：[https://github.com/ALRCMt/MtAIO-Build/tree/main/pve_web_pro](https://github.com/ALRCMt/MtAIO-Build/tree/main/pve_web_pro)

要注意的点：  
-  ImmortalWRT 需要存在 [**Lucky**](/jekyll/2025-06-18-n05.html) **Aria2** [**Cloudflared**](/jekyll/2026-07-21-n11.html) **Openlist2** [**Passwall**](/jekyll/2026-07-20-n10.html) 服务，仅仅是存在  
-  ImmortalWRT状态部分 需要 [**ServerBox设备监测器**](/jekyll/2026-02-13-d05.html) 支持  

效果图：

<figure class="image-preview">
  <a href="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2464.png" class="preview-link">
    <img src="https://github.com/ALRCMt/MtAIO-Build/raw/main/images/2464.png" alt="" width="800px">
  </a>
</figure>

<hr />
