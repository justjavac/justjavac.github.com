---
layout: post
title: Web.py Cookbook 简体中文版 - 管理自带webserver日志
description: Web.py Cookbook 简体中文版 - 管理自带webserver日志
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何操作web.py自带的webserver的日志？

## 解法

我们可以用[wsgilog](http://pypi.python.org/pypi/wsgilog/)来操作内置的webserver的日志，并做其为中间件加到应用中。

如下，写一个Log类继承wsgilog.WsgiLog，在_init_中把参数传给基类，如[这个例子](http://github.com/harryf/urldammit/blob/234bcaae6deb65240e64ee3199213712ed62883a/dammit/log.py)：

    import sys, logging
    from wsgilog import WsgiLog, LogIO
    import config

    class Log(WsgiLog):
        def __init__(self, application):
            WsgiLog.__init__(
                self,
                application,
                logformat = '%(message)s',
                tofile = True,
                file = config.log_file,
                interval = config.log_interval,
                backups = config.log_backups
                )
            sys.stdout = LogIO(self.logger, logging.INFO)
            sys.stderr = LogIO(self.logger, logging.ERROR)

接下来，当应用运行时，传递一个引用给上例中的Log类即可(假设上面代码是'mylog'模块的一部分，代码如下)：

    from mylog import Log
    application = web.application(urls, globals())
    application.run(Log)