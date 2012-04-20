---
layout: post
title: Web.py Cookbook 简体中文版 - Use Jinja2 template engine in webpy
description: Web.py Cookbook 简体中文版 - Use Jinja2 template engine in webpy
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何在web.py中使用 [Jinja2] (http://jinja.pocoo.org/2/) 模板引擎?

## 方案

首先需要安装Jinja2和webpy(0.3), 然后使用下面的代码做测试:

    import web
    from web.contrib.template import render_jinja

    urls = (
            '/(.*)', 'hello'
            )
    
    app = web.application(urls, globals())
    
    render = render_jinja(
            'templates',   # 设置模板路径.
            encoding = 'utf-8', # 编码.
        )

    #添加或者修改一些全局方法.
    #render._lookup.globals.update(
    #       var=newvar,
    #       var2=newvar2,
    #)

    class hello:
        def GET(self, name):
            return render.hello(name=name)
    
    if __name__ == "__main__":
        app.run()

## 模板文件: templates/hello.html

    Hello, {{ name }}.