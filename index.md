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

<div style="display:inline-flex; align-items:center; gap:20px;">
  <div style="display:inline-flex; align-items:center; gap:8px;">
    <div id="statusDot2" class="status-dot status-checking"></div>
    <span id="statusText2" style="vertical-align:middle;">正在检测...</span>
  </div>
  <div style="display:inline-flex; align-items:center; gap:8px;">
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
                this.statusTime.textContent = '检测时间: '+ now;
            }
            async checkStatus() {
                this.updateStatus(this.statusDot1, this.statusText1, 'checking');
                this.updateStatus(this.statusDot2, this.statusText2, 'checking');
                const url = 'https://w-status.tyyz2415.top/w-cb/p?' + Date.now();
                
                try {
                    const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
                    const text = await response.text();
                    const status = text.trim();

                    const serverMode = response.ok && (status === 'pveonline' || status === 'winonline') ? 'online' : 'offline';
                    this.updateStatus(this.statusDot1, this.statusText1, serverMode, '服务器在线', '服务器离线');
                    this.updateStatus(this.statusDot2, this.statusText2, 'online', '路由在线', '路由离线');
                } catch (error) {
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

本站是用Jekyll搭的，~~主题是~~借鉴 [https://sighingnow.github.io/jekyll-gitbook](https://sighingnow.github.io/jekyll-gitbook)  
这原模板真的是个草台班子，自己互相的颜色格式都不适配  
加了图片预览 文件夹目录等功能  

> <b>GitHub仓库: [https://github.com/ALRCMt/ALRCMt.github.io](https://github.com/ALRCMt/ALRCMt.github.io)</b>  
[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/ALRCMt/ALRCMt.github.io?style=for-the-badge&logo=GitHub)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub](https://img.shields.io/github/license/ALRCMt/ALRCMt.github.io?style=for-the-badge
)](https://github.com/ALRCMt/ALRCMt.github.io)   
[![GitHub last commit](https://img.shields.io/github/last-commit/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub Created At](https://img.shields.io/github/created-at/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)


<a href="https://github.com/ALRCMt/ALRCMt.github.io" target="_blank"><img src="https://stats.tyyz2415.top/api/pin?username=ALRCMt&repo=ALRCMt.github.io&theme=react&show_owner=true" alt="WEB Card 看不见图片说明你网络垃圾" ></a>

<hr />



