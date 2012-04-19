---
layout: post
title: Web.py Cookbook 简体中文版 - 在webpy中使用Mako模板引擎
description: Web.py Cookbook 简体中文版 - 在webpy中使用Mako模板引擎
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何在webpy中使用Mako模板引擎?

## 解决方案

首先需要安装Mako和web.py(0.3):http://www.makotemplates.org/ 然后尝试下面的代码:

<pre>
# encoding: utf-8
# File: code.py
import web
from web.contrib.template import render_mako
urls = (
        '/(.*)', 'hello'
        )
app = web.application(urls, globals(), autoreload=True)
# input_encoding and output_encoding is important for unicode
# template file. Reference:
# http://www.makotemplates.org/docs/documentation.html#unicode
render = render_mako(
        directories=['templates'],
        input_encoding='utf-8',
        output_encoding='utf-8',
        )

class hello:
    def GET(self, name):
        return render.hello(name=name)
        # Another way:
        #return render.hello(**locals())

if __name__ == "__main__":
    app.run()
</pre>

## 模板文件

<pre>
## File: templates/hello.html

Hello, ${name}.
</pre>

## 注意:
如果你使用Apache+mod_wsgi来部署webpy程序, 你也许会在Apache错误日志中得到下面的错误信息:
[Sat Jun 21 21:56:22 2008] [error] [client 192.168.122.1] TopLevelLookupException: Cant locate template for uri 'index.html'

你必须使用绝对路径指出模板的位置.
你也可以使用相对路径来让它更简单一些:
<pre>
import os

render = render_mako(
        directories=[os.path.join(os.path.dirname(__file__), 'templates').replace('\\','/'),],
        input_encoding='utf-8',
        output_encoding='utf-8',
        )
</pre>

## 参考:

<http://code.google.com/p/modwsgi/wiki/ApplicationIssues>