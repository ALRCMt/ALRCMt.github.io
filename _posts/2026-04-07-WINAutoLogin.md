---
title: Windows开机自动登录
author: ALRCMt
date: 2026-04-07 +08:00
category: Jekyll
layout: post
toc_min: 2
toc_max: 2
description: 通过netplwiz工具配置Windows开机自动登录功能，支持无密码启动，本文详细介绍了操作步骤、注册表修复方案以及在新版本Windows中缺少复选框的问题解决方法，帮助用户实现快速登录并提供安全性考量与备选方案，确保系统启动后自动完成登录过程。
---


<hr />

在目标电脑上，按下键盘的 Win + R 键，在弹出的“运行”对话框中输入：

```text
netplwiz
```

在弹出的“用户账户”窗口中，选中你要自动登录的账户  

取消勾选“要使用本计算机，用户必须输入用户名和密码”  

点击下方的 “应用” 按钮   
点击“应用”后，会弹出一个“自动登录”对话，登录保存即可  

关闭所有窗口，重启目标电脑测试一下。重启后应该就直接进入桌面了，不需要再输入密码  

> 特殊情况：如果找不到那个复选框
> 在 Windows 10/11 的新版本中，netplwiz 窗口里可能没有“要使用本计算机，用户必须输入用户名和密码”这个选项。
>
> 解决方法：在目标电脑上修改一下注册表：
>
> 按 Win + R，输入 `regedit`  
>
> 找到路径：  
> HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device  
>
> 双击右侧的 DevicePasswordLessBuildVersion  
> 把数值从 2 改成 0，点击确定  
>
> 重启目标电脑  
> 重启后再执行上面的 netplwiz 步骤，那个复选框就会出现  

注意事项：  
- 自动登录只对开机启动生效。如果电脑锁屏或从睡眠中恢复，可能还是需要输入密码
- 密码并没有被删除，只是系统帮你自动填写了
- 如果以后改了密码，需要重新执行上面的步骤

<hr />