---
title: Windows安装OpenSSH
author: ALRCMt
date: 2026-04-06 +08:00
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: 本文提供了在 Windows 系统中完整安装、配置 OpenSSH Server 的详细指南，涵盖服务的下载安装、启动方式、开机自启设置、端口防火墙放行以及常见的密码登录故障排查步骤。通过逐步演示配置文件的编辑、权限设置和日志检查，帮助读者快速实现安全的远程登录、实现跨平台的 SSH 访问，并提供了进一步的安全加固与性能调优建议，确保系统远程管理的安全性与稳定性。
---


<hr />


以管理员身份打开 PowerShell，执行：
```shell
# 安装 OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 启动 SSH 服务
Start-Service sshd

# 设置开机自启
Set-Service -Name sshd -StartupType 'Automatic'

# 防火墙放行 22 端口
New-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -DisplayName "OpenSSH Server" -Enabled True -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
```
然后用另一台电脑SSH测试，如果输密码反复错误，可能是禁止了密码登录  
直接把下面这段代码复制到Windows PowerShell（管理员）中一次性执行  

```shell
# 一键修复SSH密码登录问题
$sshdConfig = "C:\ProgramData\ssh\sshd_config"

# 备份
Copy-Item $sshdConfig "$sshdConfig.bak" -Force

# 确保 PasswordAuthentication yes
$content = Get-Content $sshdConfig -Raw
if ($content -match 'PasswordAuthentication\s+no') {
    $content = $content -replace 'PasswordAuthentication\s+no', 'PasswordAuthentication yes'
} elseif ($content -notmatch 'PasswordAuthentication\s+yes') {
    $content += "`nPasswordAuthentication yes"
}
Set-Content $sshdConfig $content

# 重启服务
Restart-Service sshd

Write-Host "修复完成！现在可以用密码登录SSH了" -ForegroundColor Green
```


<hr />