---
layout: post
title: Web.py Cookbook 简体中文版 - 提供静态文件
tagline: (诸如js脚本, css样式表和图象文件)
description: Web.py Cookbook 简体中文版 - 提供静态文件 (诸如js脚本, css样式表和图象文件)
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

### 问题
如何在web.py自带的web server中提供静态文件访问？

### 解法

在当前应用的目录下，创建一个名为static的目录，把要提供访问的静态文件放在里面即可。

例如, 网址 <code>http://localhost/static/logo.png</code> 将发送 <code>./static/logo.png</code> 给客户端。