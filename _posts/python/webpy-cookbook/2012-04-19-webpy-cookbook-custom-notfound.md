---
layout: post
title: Web.py Cookbook 简体中文版 - 自定义NotFound消息
description: Web.py Cookbook 简体中文版 - 自定义NotFound消息
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何定义NotFound消息和其他消息？

## 解法

    import web

    urls = (...)
    app =  web.application(urls, globals())

    def notfound():
        return web.notfound("Sorry, the page you were looking for was not found.")

        # You can use template result like below, either is ok:
        #return web.notfound(render.notfound())
        #return web.notfound(str(render.notfound()))

    app.notfound = notfound


要返回自定义的NotFound消息，这么做即可：

    class example:
        def GET(self):
            raise web.notfound()

也可以用同样的方法自定义500错误消息：

    def internalerror():
        return web.internalerror("Bad, bad server. No donut for you.")

    app.internalerror = internalerror