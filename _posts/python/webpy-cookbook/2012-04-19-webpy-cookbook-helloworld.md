---
layout: post
title: Web.py Cookbook 简体中文版 - Hello World!
description: Web.py Cookbook 简体中文版 - Hello World!
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何用web.py实现Hello World!？

## 解法

    import web

    urls = ("/.*", "hello")
    app = web.application(urls, globals())

    class hello:
        def GET(self):
            return 'Hello, world!'

    if __name__ == "__main__":
        app.run()

###提示：要保证网址有无'/'结尾，都能指向同一个类。就要多写几行代码，如下：

在URL开头添加代码：

    '/(.*)/', 'redirect', 

然后用redirect类处理以'/'结尾的网址：

    class redirect:
        def GET(self, path):
            web.seeother('/' + path)