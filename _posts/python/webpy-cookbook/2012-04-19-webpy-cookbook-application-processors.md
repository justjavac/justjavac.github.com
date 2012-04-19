---
layout: post
title: Web.py Cookbook 简体中文版 - Application processors
description: Web.py Cookbook 简体中文版 - Application processors
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何使用应用处理器，加载钩子(loadhooks)和卸载钩子(unloadhook)？

## 解法

web.py可以在处理请求之前或之后，通过添加处理器(processor)来完成某些操作。

    def my_processor(handler): 
        print 'before handling'
        result = handler() 
        print 'after handling'
        return result

    app.add_processor(my_processor)

可以用加载钩子(loadhook)和卸载钩子(unloadhook)的方式来完成同样的操作，它们分别在请求开始之前和结束之后工作。

    def my_loadhook():
        print "my load hook"

    def my_unloadhook():
        print "my unload hook"

    app.add_processor(web.loadhook(my_loadhook))
    app.add_processor(web.unloadhook(my_unloadhook))