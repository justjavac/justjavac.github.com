---
layout: post
title: Web.py Cookbook 简体中文版 - 提供XML访问
description: Web.py Cookbook 简体中文版 - 提供XML访问
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

### 问题

如何在web.py中提供XML访问？

如果需要为第三方应用收发数据，那么提供xml访问是很有必要的。

### 解法

根据要访问的xml文件(如response.xml)创建一个XML模板。如果XML中有变量，就使用相应的模板标签进行替换。下面是一个例子：

    $def with (code)
    <?xml version="1.0"?>
    <RequestNotification-Response>
    <Status>$code</Status>
    </RequestNotification-Response>

为了提供这个XML，需要创建一个单独的web.py程序(如response.py)，它要包含下面的代码。注意：要用"web.header('Content-Type', 'text/xml')"来告知客户端－－正在发送的是一个XML文件。


    import web

    render = web.template.render('templates/', cache=False)

    urls = (
        '/(.*)', 'index'
    )

    app = web.application(urls, globals())

    class index:
        def GET(self, code):
            web.header('Content-Type', 'text/xml')
            return render.index(code)

    web.webapi.internalerror = web.debugerror
    if __name__ == '__main__': app.run()