---
layout: home
mermaid: true
title: 主页
permalink: /
description: 这是 ALRCMt 的个人网站主页，汇总了关于系统搭建、嵌入式与网络工程的折腾记录、教程笔记、个人介绍以及一些日常想法。这里不仅是技术文章的存放地，也承载着我对服务器、虚拟化、开源工具和个人知识管理的一点点探索与实践。网站的内容偏向实用、折腾、学习笔记和轻量分享，适合想了解 PVE、NAS、软路由、Jekyll、个人博客搭建以及日常技术尝试的人参考。因为作者本身也在不断学习，所以页面里会保留一些未完成的想法、草稿和正在推进的项目，会有“边学边写、边折腾边整理”的感觉。这个主页同时也是一个很简洁的入口，链接到关于作者、系统介绍、相关项目和一些零碎的资料整理页面。你可以把它看作一个轻量的个人实验室，记录技术成长、踩坑经历、兴趣方向和对开源世界的理解。内容可能并不完全系统，但会尽量保持真实、坦率、可读，以及持续更新的状态。
image: /images/ADHDsp.jpg

---

<figure class="image-preview">
  <a href="./images/ADHDsp.jpg" class="preview-link">
    <img src="./images/ADHD.jpg" alt="" width="180px">
  </a>
</figure>


<b>这里是ALRCMt的个人网站！ :)</b>

<a href="https://github.com/ALRCMt/ALRCMt.github.io" target="_blank">
  <img src="https://stats.tyyz2415.top/api/pin?username=ALRCMt&repo=ALRCMt.github.io&theme=react&show_owner=true" alt="WEB Card 看不见图片说明你网络垃圾">
</a>

<hr />

- #### [MtAIO系统介绍及指南](/jekyll/2025-06-05-About.html)

目前主要是把我的 **PVE 系统折腾指南** 挂在这里，以及一些七七八八的教程，因为没有需求，所以我用了这个极简的样式  
如果没有其它需求的话，我应该不会再变更网站了，也许我后面会搞一个人 Blog？不管了  
先这样凑合用吧 **[关于ALRCMt](/others/Me/)**

<figure class="image-preview">
  <a href="/images/oic.gif" class="preview-link">
    <img src="/images/oic.gif" alt="" width="200px">
  </a>
</figure>

<hr />

本站使用 **Jekyll** 构建，沿用了 <https://github.com/sighingnow/jekyll-gitbook> 的主题  
修改了一些样式、排版  
加了 **图片预览**、**文件夹目录**、**Giscus 评论** 等功能  

> <b>GitHub仓库: [https://github.com/ALRCMt/ALRCMt.github.io](https://github.com/ALRCMt/ALRCMt.github.io)</b>  
[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/ALRCMt/ALRCMt.github.io?style=for-the-badge&logo=GitHub)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub](https://img.shields.io/github/license/ALRCMt/ALRCMt.github.io?style=for-the-badge
)](https://github.com/ALRCMt/ALRCMt.github.io)   
[![GitHub last commit](https://img.shields.io/github/last-commit/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)
[![GitHub Created At](https://img.shields.io/github/created-at/ALRCMt/ALRCMt.github.io?style=for-the-badge)](https://github.com/ALRCMt/ALRCMt.github.io)



## 关于本站的拓展功能

如果你想搭建一个类似的网站，大部分可以沿用 <https://sighingnow.github.io/jekyll-gitbook/> 的教程  
我在这里**只说明做出修改的内容**：

#### **1. 目录结构的重构**

**主要实现文件：**  
`/_plugins/`  
`/_includes/sidebar-tree-render.html`  
`/_includes/toc-date.html`  

在`_config.yml`文件里通过如下  
``` yml
toc:
  enabled: true
  h_min:   1
  h_max:   3
```
来控制所有文件是否**开启目录**、设置**几级目录**  

而且可以在每个文件开头设置 `toc_min` 与 `toc_max` 来**逐页覆盖**目录层级  
而且新增文件夹里还可以放置文件夹，通过在每个文件夹添加 `_folder.yml` 文件来设置文件夹的目录名、时间及是否默认展开，如  
```yml
title: 个人服务器系统构建
date: 2026-01-01
expanded: true
```

没有 `_folder.yml` 的文件夹会**回退到目录名**，*不会报错*  
通过 `sidebar_folder_depth` 限制**嵌套深度**，多出的层级会被截断   
文件夹和文章**混在一起排序**（*有点抽象，但我觉得合理*），按照**时间顺序**排序  


#### **2. 图片预览功能**

**主要实现文件：** `/assets/image-preview/`  
原项目没有图片预览，有些图比较小就看不清楚  
自行添加了一个 **零外部依赖、纯前端、轻量** 的图片预览  
给 `<a>` 标签加上 `class="preview-link"` 启用预览，内嵌 `<img>` 自定义缩略图，如
``` html
<a href="/images/oic.gif" class="preview-link">
    <img src="/images/oic.gif" alt="" width="200px">
  </a>
```

#### **3. Live2D 看板娘**

**主要实现文件：** `/assets/live2d/`

直接把 <https://github.com/stevenjoezhang/live2d-widget> 整个项目下载到 `/assets/live2d/` 下面，然后在 `_includes/head.html` 里加载 `autoload.js`

**实现特点：**
- 模型全部走**本地路径**，不依赖远程 API
- **移动端**（宽度 < 768px）自动不加载
- Cubism 2 渲染器用本地 `live2d.min.js`，Cubism 5 **走 CDN**

**模型来源：** <https://github.com/fghrsh/live2d_api>


#### **4. Giscus 评论系统**

通过 [Giscus](https://giscus.app/zh-CN) 来实现文章底部评论
**适配文件：**  
`/_includes/giscus.html`  
`/_includes/body.html`  

修改 `_config.yml` 即可配置 `comments`，详细配置见官网

#### **5. 其它小修改**

**深色模式默认：** `_includes/head.html` 中通过 `localStorage` 在首次访问时默认设置暗色主题   
**语法高亮主题：** `_config.yml` 中设置 `syntax_highlighter_style: magritte`，自定义代码块配色    
**本地化 `mermaid.min.js`：** 放在 `/assets/mermaid/`，`_includes/mermaid.html` 中引用本地路径加载，不依赖 CDN

**Gemfile 改变的插件：**

| 插件 | 用途 |
|---|---|
| `rake` | 编译 native extension 所需 |
| `kramdown-parser-gfm` | GitHub Flavored Markdown 解析器 |
| `tzinfo-data` | Windows 下时区数据支持 |
| `jekyll-sitemap` | 自动生成 `sitemap.xml` |
| `jekyll-seo-tag` | 自动生成 SEO meta 标签，替代手写 `<meta name="description">` |
| `sass-embedded`（已注释） | GitHub Pages 环境固定 `sass-embedded` 版本解决兼容问题；本地开发注释掉这行，靠 `Gemfile.lock` 保持 `1.69.5`，不跑 `bundle update` 就不会变 |  


<hr />



