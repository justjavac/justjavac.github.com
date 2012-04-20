---
layout: post
title: Web.py Cookbook 简体中文版 - 在webpy中使用Cheetah模板引擎
description: Web.py Cookbook 简体中文版 - 在webpy中使用Cheetah模板引擎
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题：

怎样在webpy中使用Cheetah模板引擎？

## 解决：

您需要先安装webpy(0.3)和Cheetah：[http://www.cheetahtemplate.org/](http://www.cheetahtemplate.org/). 然后尝试使用下面的代码段：

    # encoding: utf-8
    # File: code.py

    import web
    from web.contrib.template import render_cheetah

    render = render_cheetah('templates/')

    urls = (
        '/(first)', 'first',
        '/(second)', 'second'
        )

    app = web.application(urls, globals(), web.reloader)

    class first:
        def GET(self, name):
            # cheetah template takes only keyword arguments,
            # you should call it as:
            #   return render.hello(name=name)
            # Below is incorrect:
            #   return render.hello(name)
            return render.first(name=name)

    class second:
        def GET(self, name):
            return render.first(**locals())

    if __name__ == "__main__":
        app.run()

模板文件

    ## File: templates/first.html

    hello, $name.