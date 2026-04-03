---
title: Windows Jekyll本地预览
author: ALRCMt
date: 2026-04-01
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
---


<hr />

### 顺便钞一下jekyll本地windows预览的教程

先安装 Ruby、RubyGems（Ruby 的包管理系统）以及开发工具包。访问[RubyInstaller 官网](https://rubyinstaller.org/downloads/)  
下载适合你系统的 Ruby 安装包，注意要在 “WITH DEVKIT“ 这一栏选择

下载并执行 exe 文件之后，相关组件即安装完成。此时，打开命令提示符（CMD）或 PowerShell，输入 `ruby -v` 和 `gem -v` 命令  
如果能正确显示 Ruby 和 RubyGems 的版本信息，说明安装成功

然后在命令行输入 “gem install jekyll bundler” 以安装 Jekyll 和 Bundler  
之后输入`jekyll -v` 和 `bundler -v` 命令，如果能正确显示 Jekyll 和 Bundler 的版本信息，说明安装成功  
第一次搭建，可能会遇到缺少 gems 相关组件，此时， `bundle install` 来安装必要的组件，然后重试  

接下来，在网站代码所在的文件夹下，输入 `bundle exec jekyll serve` 来执行静态网站搭建的过程  
然后可以在浏览器中预览 _127.0.0.1:4000_

<hr />