---
title: 关于ALRCMt
author: ALRCMt
date: 2025-10-01 +08:00
category: Jekyll
layout: post
description: 关于 ALRCMt 的个人介绍页，包含兴趣方向、技术尝试、项目经历、联系方式与一些随手记录的生活与学习状态。文章详细介绍了一名高中学生对电子信息技术与政治哲学的双重热爱，涵盖嵌入式开发、网络工程、NAS 与软路由搭建等实践项目，以及马列毛主义政治与中国现当代史的研究方向。同时记录个人技术成长轨迹，包括基于 AI 提示词编程的学习方式、JavaScript 与 Shell 语言学习进展，以及对开源镜像站的感谢与项目投入说明，提供 GitHub、QQ、邮箱、Bilibili 等多元联系方式，展现技术爱好者在性能与节能、政治与技术之间的探索与思考。
toc_min: 2
toc_max: 2
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
  <a href="/images/ADHDsp.jpg" class="preview-link">
    <img src="/images/ADHD.jpg" alt="" width="180px">
  </a>
</figure>

<br />

#### 苦币高三学生党。。。

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
<div id="relayMsg" style="margin-top:5px; color:#ff6b6b; font-size:15px;"></div>

<script>
class ServerStatus {
    constructor() {
        this.statusDot1 = document.getElementById('statusDot1');
        this.statusText1 = document.getElementById('statusText1');
        this.statusDot2 = document.getElementById('statusDot2');
        this.statusText2 = document.getElementById('statusText2');
        this.statusTime = document.getElementById('statusTime');
        this.relayMsg = document.getElementById('relayMsg');
        this.checkInterval = 120000;
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

    pingWithTimeout(url, timeout) {
        return new Promise((resolve) => {
            const ctrl = new AbortController();
            const timer = setTimeout(() => { ctrl.abort(); resolve({ timedOut: true }); }, timeout);
            fetch(url, { signal: ctrl.signal, mode: 'cors', cache: 'no-store' })
                .then(() => { clearTimeout(timer); resolve({ timedOut: false }); })
                .catch(() => { clearTimeout(timer); resolve({ timedOut: false }); });
        });
    }

    async checkStatus() {
        // 每次检测前清空中继提示
        this.relayMsg.innerHTML = '';

        this.updateStatus(this.statusDot1, this.statusText1, 'checking');
        this.updateStatus(this.statusDot2, this.statusText2, 'checking');

        const url = 'https://w-status.tyyz2415.top/w-cb/p?t=' + Date.now();
        const mainAbort = new AbortController();
        const mainTimeoutId = setTimeout(() => mainAbort.abort(), 15000);

        const mainPromise = fetch(url, { signal: mainAbort.signal, mode: 'cors', cache: 'no-store' })
            .then(async res => {
                const text = await res.text();
                return { ok: res.ok, text: text };
            })
            .catch(err => {
                if (err.name === 'AbortError') return { aborted: true };
                return { error: true };
            });

        const pingBase = 'https://w-status.tyyz2415.top?t=' + Date.now() + '_';
        const pingPromises = [1, 2, 3].map(i => this.pingWithTimeout(pingBase + i, 3500));

        const allPingTimedOut = new Promise((resolve) => {
            let done = 0, allTimeout = true;
            pingPromises.forEach(p => {
                p.then(r => { if (!r.timedOut) allTimeout = false; })
                 .finally(() => { done++; if (done === 3 && allTimeout) resolve(); });
            });
        });

        const winner = await Promise.race([mainPromise, allPingTimedOut]);
        clearTimeout(mainTimeoutId);

        // 全部Ping超时 → CF连接失败，额外检测 cloudflare.com
        if (winner === undefined) {
            mainAbort.abort();
            this.statusDot1.className = 'status-dot status-offline';
            this.statusText1.textContent = '路由Cloudflare连接失败';
            this.statusDot2.className = 'status-dot status-offline';
            this.statusText2.textContent = '服务器Cloudflare连接失败';
            this.statusTime.textContent = '检测时间: ' + new Date().toLocaleTimeString('zh-CN');

            // 检测 cloudflare.com 4次（3.5s超时）
            const cfPingBase = 'https://cloudflare.com?t=' + Date.now() + '_';
            const cfPings = [1, 2, 3, 4].map(i => this.pingWithTimeout(cfPingBase + i, 3500));
            const results = await Promise.all(cfPings);
            const anySuccess = results.some(r => !r.timedOut);
            if (anySuccess) {
                this.relayMsg.innerHTML = 'Cloudflare中继故障，请联系我：<a href="mailto:alrcmt86@outlook.com">alrcmt86@outlook.com</a>';
            }
            return;
        }

        const result = winner;

        // 主请求15s超时或网络错误 → 全部离线
        if (result.aborted || result.error) {
            this.updateStatus(this.statusDot1, this.statusText1, 'offline', '服务器在线', '服务器离线');
            this.updateStatus(this.statusDot2, this.statusText2, 'offline', '路由在线', '路由离线');
            this.statusTime.textContent = '检测时间: ' + new Date().toLocaleTimeString('zh-CN');
            return;
        }

        // 正常响应：根据内容判断状态
        const { ok, text } = result;
        const status = text.trim();

        // 判断是否为错误内容（接口返回 200 但内容是错误信息）
        const isErrorContent = /^error/i.test(status) || /error code/i.test(status);

        // 路由在线：HTTP 200 且 内容不是错误信息
        const routeMode = (ok && !isErrorContent) ? 'online' : 'offline';
        // 服务器在线：HTTP 200 且 内容为 pveonline 或 winonline
        const serverMode = (ok && (status === 'pveonline' || status === 'winonline')) ? 'online' : 'offline';

        this.updateStatus(this.statusDot1, this.statusText1, serverMode, '服务器在线', '服务器离线');
        this.updateStatus(this.statusDot2, this.statusText2, routeMode, '路由在线', '路由离线');
        this.statusTime.textContent = '检测时间: ' + new Date().toLocaleTimeString('zh-CN');
    }
}

// 实例化
const server = new ServerStatus();
</script>

<table width="200">
<tr>
<th colspan=2><span id="weekDayText">疯狂星期四</span>，v我50</th>
</tr>
<tr>
<th><figure class="image-preview">
  <a href="/images/wxlll.jpg" class="preview-link">
    <img src="/images/wechatpay.png" alt="" width="70px">
  </a>
</figure></th>
<th>我，Mt 打钱 懂？</th>
</tr>
</table>
<script>
  (function() {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const el = document.getElementById('weekDayText');
    if (el) {
      el.textContent = '疯狂' + days[new Date().getDay()];
    }
  })();
</script>
<hr />
  

一个**电子爱好者**，对**硬件与网络工程**感兴趣 :)

正在培养动手能力，尝试搭建一套**个人服务器系统**，  
平时玩玩 **NAS** 与 **软路由**，毕竟我是社恐不喜欢出门，不喜欢大部分竞技游戏，因为很菜而且很怕被压力  
**All in One, All in Boom** 的说法，不要在意就行了，为什么总是 Boom 你应该反思自己  
（*虽然其确实容易出问题，但基本是个人问题*）

<figure class="image-preview">
  <a href="/images/Opve.png" class="preview-link">
    <img src="/images/Opve.png" alt="" width="450px">
  </a>
</figure>


> <i>感谢开源镜像站，直连境外源多么折磨人都知道</i>   
<img src="https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/cb99109050678a8dc9f7933bb70bc5681e4f1084/photo/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-16%20161707.png" width="260px"> 


不曾熟练掌握任何计算机语言，基于 **AI 提示词编程**（   
在学 **JavaScript** 和 **Shell**，还想学 **Golang** 和 **C**   
额，还是有时间慢慢学的，毕竟 [**来日方长**](https://book.douban.com/subject/24298157/)


<figure class="image-preview">
  <a href="https://stats.tyyz2415.top/api/top-langs/?username=ALRCMt&layout=compact&theme=slateorange" class="preview-link">
    <img src="https://stats.tyyz2415.top/api/top-langs/?username=ALRCMt&layout=compact&theme=slateorange" alt="Top Langs 看不见图片说明你网络垃圾" >
  </a>
</figure>

  
<hr />

不知道是说偶然还是怎么，同时迷上了**电子信息技术**和**政治哲学**，知识的殿堂之间又没有帷幕对吧？  
也许后面的人生只能择一，但是现在不想放弃什么  
（其实我还对**心理学**的精神分析分支很感兴趣   

现在重心是研究当代 **马列毛主义政治** 与中国 **现当代史**，顺带 **西马哲学** 及 **国际共运史**  
但是不论政治趋向怎么样，我都是尊重理解差异，希望平等理性交流的，毕竟谁也不知道未来的路怎么走  
<img src="/images/think.gif" alt="" height="150px"> <img src="/images/mks.png" alt="" height="150px">  

#### 我认为，政治必须为科学开路（而不是让路） 

不想跟人辩经......，我认为互联网辩经从来没谁说服谁过，除了制造更多的网络垃圾没有更多的意义，下一次又是一样的吵......你去翻一番 20 多年前的鉴证内容，一大部分吵得内容都与现在差不多  

我还是主张**应该交流政治的**，政治应当进入生活，应当被**合理严肃对待**，我最讨厌**神秘化与娱乐化**。而对于克服目前现状的代价？我不在意（这也是哲学理念的一部分吧
<figure class="image-preview">
  <a href="/images/mhyyyy.png" alt="沉痛悼念米指导" class="preview-link">
    <img src="/images/mhyyyy.png" alt="" width="300px">
  </a>
</figure>


<hr /> 

人是懒得出奇的  

<figure class="image-preview">
  <a href="https://stats.tyyz2415.top/api?username=ALRCMt&show_icons=true&theme=cobalt" class="preview-link">
    <img src="https://stats.tyyz2415.top/api?username=ALRCMt&show_icons=true&theme=cobalt" alt="ALRCMt's GitHub stats 看不见图片说明你网络垃圾" >
  </a>
</figure>

塔学造诣是没有的 

<figure class="image-preview">
  <a href="/images/ban.png" class="preview-link">
    <img src="/images/ban.png" alt="账号已封禁" >
  </a>
</figure>

<hr />

### **投入**

- [H.M.R. 资料库的建立（已停止）](/pages/HMR/)
- [MtAIO 个人服务器的搭建](/jekyll/2025-06-06-About.html)
- [ProxmoxVE 概要页硬件监控](https://github.com/ALRCMt/pve-manager-remix)

<hr />

**GitHub 账号**  
**[https://github.com/ALRCMt](https://github.com/ALRCMt)**

[![QQ](https://img.shields.io/badge/QQ-ALRCMt-white.svg?style=flat-square&logo=qq)](https://qm.qq.com/q/4uVkK9nRPW?personal_qrcode_source=3)
[![邮箱](https://img.shields.io/badge/邮箱-alrcmt86@outlook.com-blue.svg?style=flat-square&logo=minutemailer)](mailto:b122330417@163.com)
[![Bilibili](https://img.shields.io/badge/Bilibili-ALRC_Mt-pink.svg?style=flat-square&logo=bilibili)](https://space.bilibili.com/483215864?spm_id_from=333.1007.0.0)


<a href="https://github.com/ALRCMt" target="_blank"><img src="https://stats.tyyz2415.top/api?username=ALRCMt&rank_icon=percentile&theme=radical" alt="ALRCMt's GitHub stats 看不见图片说明你网络垃圾" ></a>


<figure class="image-preview">
  <a href="https://summary.tyyz2415.top/api/cards/productive-time?username=ALRCMt&theme=holi&utcOffset=8" class="preview-link">
    <img src="https://summary.tyyz2415.top/api/cards/productive-time?username=ALRCMt&theme=holi&utcOffset=8" alt="看不见图片说明你网络垃圾" >
  </a>
</figure>


> <b>提示：
> <i>目前没有任何精神疾病</i></b>  
 