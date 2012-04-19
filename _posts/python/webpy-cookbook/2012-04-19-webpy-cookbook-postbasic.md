---
layout: post
title: Web.py Cookbook 简体中文版 - 从post读取原始数据
description: Web.py Cookbook 简体中文版 - 从post读取原始数据
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 介绍

有时候，浏览器会通过post发送很多数据。在webpy，你可以这样操作。


## 代码

    class RequestHandler():
        def POST():
            data = web.data() # 通过这个方法可以取到数据