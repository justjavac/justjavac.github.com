---
layout: post
title: web.py 0.3 新手指南 - 在调试模式下使用session
description: web.py 0.3 新手指南 - 在调试模式下使用session
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

## 问题

如何在调试模式下使用session?

## 解法

使用web.py自带的webserver提供web服务时，web.py就运行在调试模式下。当然最简单的办法就是禁用调试，只要令`web.config.debug = False`即可。

    import web
    web.config.debug = False

    # rest of your code


如果非要用调试模式下使用session，可以用非主流的一些办法。哈哈

因为调试模式支持模块重载入(重载入，绝非重载。是reload,而非override)，所以reloader会载入主模块两次，因此，就会创建两个session对象。但我们只要把session存储在全局的数据容器中，就能避免二次创建session。

下面这个例子就是把session保存在 `web.config`中：

    import web
    urls = ("/", "hello")

    app = web.application(urls, globals())

    if web.config.get('_session') is None:
        session = web.session.Session(app, web.session.DiskStore('sessions'), {'count': 0})
        web.config._session = session
    else:
        session = web.config._session

    class hello:
       def GET(self):
           print 'session', session
           session.count += 1
           return 'Hello, %s!' % session.count

    if __name__ == "__main__":
       app.run()