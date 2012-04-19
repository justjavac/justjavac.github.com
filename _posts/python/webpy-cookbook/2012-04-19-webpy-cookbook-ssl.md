---
layout: post
title: Web.py Cookbook 简体中文版 - 用cherrypy提供SSL支持
description: Web.py Cookbook 简体中文版 - 用cherrypy提供SSL支持
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何用内置的cheerypy提供SSL支持？

## 解法

    import web
    
    from web.wsgiserver import CherryPyWSGIServer

    CherryPyWSGIServer.ssl_certificate = "path/to/ssl_certificate"
    CherryPyWSGIServer.ssl_private_key = "path/to/ssl_private_key"

    urls = ("/.*", "hello")
    app = web.application(urls, globals())

    class hello:
        def GET(self):
            return 'Hello, world!'

    if __name__ == "__main__":
        app.run()