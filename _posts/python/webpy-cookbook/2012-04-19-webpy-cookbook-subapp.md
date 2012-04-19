---
layout: post
title: Web.py Cookbook 简体中文版 - 使用子应用
description: Web.py Cookbook 简体中文版 - 使用子应用
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何在当前应用中包含定义在其他文件中的某个应用？

## 解法

在`blog.py`中:

    import web
    urls = (
      "", "reblog",
      "/(.*)", "blog"
    )

    class reblog:
        def GET(self): raise web.seeother('/')

    class blog:
        def GET(self, path):
            return "blog " + path

    app_blog = web.application(urls, locals())

当前的主应用`code.py`:

    import web
    import blog
    urls = (
      "/blog", blog.app_blog,
      "/(.*)", "index"
    )
    
    class index:
        def GET(self, path):
            return "hello " + path
    
    app = web.application(urls, locals())

    if __name__ == "__main__":
        app.run()