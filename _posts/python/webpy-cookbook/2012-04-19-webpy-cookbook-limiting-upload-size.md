---
layout: post
title: Web.py Cookbook 简体中文版 - 上传文件大小限定
description: Web.py Cookbook 简体中文版 - 上传文件大小限定
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何限定上传文件的大小？

## Solution

web.py 使用`cgi` 模块来解析用户的输入， 而 `cgi` 模块对最大输入大小有限制。

下面的代码限制了最大数据输入为 10MB.

    import cgi

    # Maximum input we will accept when REQUEST_METHOD is POST
    # 0 ==> unlimited input
    cgi.maxlen = 10 * 1024 * 1024 # 10MB

请注意这是对POST方法提交数据大小的限制，而不是上传文件大小。当然如果表单中没有其他输入数据，上传文件完全可以达到限制的大小。

`cgi` 模块将会抛出 `ValueError`异常，如果数据输入的大小超过了 `cgi.maxlen`。我们可以捕捉该异常而避免显示不友好的错误信息。

    class upload:
        def POST(self):
            try:
                i = web.input(file={})
            except ValueError:
                return "File too large"