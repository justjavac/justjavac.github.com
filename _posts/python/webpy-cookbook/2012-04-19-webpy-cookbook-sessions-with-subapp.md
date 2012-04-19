---
layout: post
title: web.py 0.3 新手指南 - 在子应用下使用session
description: web.py 0.3 新手指南 - 在子应用下使用session
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

## 提示

这个解决方案是来自web.py邮件列表。[this](http://www.mail-archive.com/webpy@googlegroups.com/msg02557.html)

##问题

如何在子应用中使用session？

##解法

web.py默认session信息只能在主应用中共享，即便在其他模块中import Session都不行。在app.py（或main.py）可以这样初始化session：

    session = web.session.Session(app, web.session.DiskStore('sessions'),
    initializer = {'test': 'woot', 'foo':''})

.. 接下来创建一个被web.loadhook加载的处理器(processor)

    def session_hook():
        web.ctx.session = session

    app.add_processor(web.loadhook(session_hook))

.. 在子应用(假设是sub-app.py)中，可以这样操作session:

    print web.ctx.session.test
    web.ctx.session.foo = 'bar'