---
layout: home
mermaid: true
title: 主页
permalink: /
description: 这是 ALRCMt 的个人网站主页，汇总了关于系统搭建、嵌入式与网络工程的折腾记录、教程笔记、个人介绍以及一些日常想法。这里不仅是技术文章的存放地，也承载着我对服务器、虚拟化、开源工具和个人知识管理的一点点探索与实践。网站的内容偏向实用、折腾、学习笔记和轻量分享，适合想了解 PVE、NAS、软路由、Jekyll、个人博客搭建以及日常技术尝试的人参考。因为作者本身也在不断学习，所以页面里会保留一些未完成的想法、草稿和正在推进的项目，会有“边学边写、边折腾边整理”的感觉。这个主页同时也是一个很简洁的入口，链接到关于作者、系统介绍、相关项目和一些零碎的资料整理页面。你可以把它看作一个轻量的个人实验室，记录技术成长、踩坑经历、兴趣方向和对开源世界的理解。内容可能并不完全系统，但会尽量保持真实、坦率、可读，以及持续更新的状态。
image: /images/ADHDsp.jpg

---

<head>
 <style>
    .status-dot {
     width: 14px;
     height: 14px;
     border-radius: 50%;
     display: inline-block;
     vertical-align: middle;
     margin-left: 8px;
     }
    .status-online { 
     background-color: #4CAF50; 
     animation: pulse 2s infinite;
     }
    .status-offline { 
     background-color: #f44336; 
     }
    .status-checking { 
     background-color: #ff9800; 
     animation: pulse 1s infinite;
     }
    .status-row {
     display: inline-flex;
     align-items: center;
     gap: 20px;
     flex-wrap: wrap;
    }
    .status-box {
     display: inline-flex;
     align-items: center;
     gap: 8px;
    }
    @media (max-width: 640px) {
      .status-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .status-box,
      #statusTime {
        width: 100%;
      }
    }
     @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
      100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
     }
</style>
</head>

<figure class="image-preview">
  <a href="./images/ADHDsp.jpg" class="preview-link">
    <img src="./images/ADHD.jpg" alt="" width="180px">
  </a>
</figure>


<b>这里是ALRCMt的个人网站！ :)</b>

<a href="https://github.com/ALRCMt/ALRCMt.github.io" target="_blank"><img src="https://stats.tyyz2415.top/api/pin?username=ALRCMt&repo=ALRCMt.github.io&theme=react&show_owner=true" alt="WEB Card 看不见图片说明你网络垃圾" ></a>

<div class="status-row">
  <div class="status-box">
    <div id="statusDot2" class="status-dot status-checking"></div>
    <span id="statusText2" style="vertical-align:middle;">正在检测...</span>
  </div>
  <div class="status-box">
    <div id="statusDot1" class="status-dot status-checking"></div>
    <span id="statusText1" style="vertical-align:middle;">正在检测...</span>
  </div>
  <span id="statusTime" style="vertical-align:middle; color:#999;">检测时间: --:--:--</span>
</div>

<script>
class ServerStatus {
    constructor() {
        this.statusDot1 = document.getElementById('statusDot1');
        this.statusText1 = document.getElementById('statusText1');
        this.statusDot2 = document.getElementById('statusDot2');
        this.statusText2 = document.getElementById('statusText2');
        this.statusTime = document.getElementById('statusTime');
        this.checkInterval = 100000;
        this.timeoutDuration = 15000; // 15秒超时
        this.init();
    }

    init() {
        this.checkStatus();
        setInterval(() => this.checkStatus(), this.checkInterval);
    }

    updateStatus(dot, textEl, mode, onlineLabel, offlineLabel) {
        const now = new Date().toLocaleTimeString('zh-CN');
        dot.className = 'status-dot';
        if (mode === 'checking') {
            dot.classList.add('status-checking');
            textEl.textContent = '正在检测...';
        } else if (mode === 'online') {
            dot.classList.add('status-online');
            textEl.textContent = onlineLabel;
        } else {
            dot.classList.add('status-offline');
            textEl.textContent = offlineLabel;
        }
        this.statusTime.textContent = '检测时间: ' + now;
    }

    async checkStatus() {
        this.updateStatus(this.statusDot1, this.statusText1, 'checking');
        this.updateStatus(this.statusDot2, this.statusText2, 'checking');

        const url = 'https://w-status.tyyz2415.top/w-cb/p?' + Date.now();
        
        // 创建AbortController用于超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutDuration);

        try {
            const response = await fetch(url, {
                mode: 'cors',
                cache: 'no-store',
                signal: controller.signal // 传入信号
            });
            
            clearTimeout(timeoutId); // 清除超时定时器
            
            const text = await response.text();
            const status = text.trim();
            const serverMode = response.ok && (status === 'pveonline' || status === 'winonline') ? 'online' : 'offline';
            
            this.updateStatus(this.statusDot1, this.statusText1, serverMode, '服务器在线', '服务器离线');
            this.updateStatus(this.statusDot2, this.statusText2, 'online', '路由在线', '路由离线');
        } catch (error) {
            clearTimeout(timeoutId); // 清除超时定时器
            
            // 判断是否为超时错误
            if (error.name === 'AbortError') {
                console.log('请求超时（15秒）');
            }
            
            // 超时或任何错误都将状态设为离线
            this.updateStatus(this.statusDot1, this.statusText1, 'offline', '服务器在线', '服务器离线');
            this.updateStatus(this.statusDot2, this.statusText2, 'offline', '路由在线', '路由离线');
        }
    }
}

const server = new ServerStatus();
</script>

<hr />

- #### [MtAIO系统介绍及指南](/jekyll/2025-06-05-About.html)

目前主要是把我的PVE系统折腾指南挂在这里，以及一些七七八八的教程，因为没有需求，所以我用了这个极简的样式  
如果没有其它需求的话，我应该不会再变更网站了，，也许我后面会搞一个人Blog？不管了  
先这样凑合用吧 **[关于ALRCMt](/others/Me/)**

<figure class="image-preview">
  <a href="/images/oic.gif" class="preview-link">
    <img src="/images/oic.gif" alt="" width="200px">
  </a>
</figure>

<hr />

本站使用Jekyll构建，沿用了<https://github.com/sighingnow/jekyll-gitbook>的主题  
修改了一些样式、排版  
加了图片预览、文件夹目录、 giscus评论等功能  

> <b>GitHub仓库: [https://github.com/ALRCMt/ALRCMt.github.io](https://github.com/ALRCMt/ALRCMt.github.io)</b>  
[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/ALRCMt/ALRCMt.github.io?style=for-the-badge&logo=GitHub)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub](https://img.shields.io/github/license/ALRCMt/ALRCMt.github.io?style=for-the-badge
)](https://github.com/ALRCMt/ALRCMt.github.io)   
[![GitHub last commit](https://img.shields.io/github/last-commit/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub Created At](https://img.shields.io/github/created-at/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)



## 关于本站的拓展功能

如果你想搭建一个类似的网站，大部分可以沿用<https://sighingnow.github.io/jekyll-gitbook/>的教程  
我在这里只说明做出修改的内容：

#### 1.目录结构的重构

原本是使用插件构建的目录结构，我这里采用了别的方法

原来：_posts等文件夹下只能直接放置Markdown文件，识别文件标题作为目录  
在`_config.yml`文件里通过如下  
``` yml
toc:
  enabled: true
  h_min:   1
  h_max:   3
```
来控制所有文件是否开启目录、设置几级目录

现在：不仅上述方法仍可用，而且可以在每个文件开头设置`toc_min`与`toc_max`来确定几级目录  
而且新增文件夹里还可以放置文件夹，通过在每个文件夹添加`_folder.yml`文件来设置文件夹的目录名、时间及是否默认展开，如  
```yml
title: 个人服务器系统构建
date: 2026-01-01
expanded: true
```


#### 2.图片预览功能

<hr />



