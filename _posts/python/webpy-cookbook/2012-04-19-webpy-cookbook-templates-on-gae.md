---
layout: post
title: Web.py Cookbook 简体中文版 - How to use templates on Google App Engine
description: Web.py Cookbook 简体中文版 - How to use templates on Google App Engine
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何在 Google App Engine 上使用模板

## 解答

web.py templetor 把模板编译成 python 字节码，这需要访问标准库中的 parser 模块。不幸的是，由于安全原因 GAE 禁用了这个模块。
 
为了克服这个状况，web.py 支持把模板编译成 python 代码，从而避免在 GAE 上使用原来的模板。web.py 确保在应用这种方法的时候模板中的代码不需要任何改变。

为了编译一个文件夹中所有的模板（一旦有模板改动，就需要重新运行），运行：

    $ python web/template.py --compile templates

以上命令把 templates/ 目录下的模板文件递归地全部编译，并且生产 `__init__.py`， 'web.template.render` 重新编写过，它将视 templates 为一个 python 模块。