---
layout: post
title: Web.py Cookbook 简体中文版 - 如何使用web.background
description: Web.py Cookbook 简体中文版 - 如何使用web.background
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

*注意！！*  web.backgrounder已转移到web.py 3.X实验版本中，不再是发行版中的一部分。你可以在[这里](http://github.com/webpy/webpy/blob/686aafab4c1c5d0e438b4b36fab3d14d121ef99f/experimental/background.py)下载，要把它与application.py放置在同一目录下才能正运行。

介绍
-----

web.background和web.backgrounder都是python装饰器，它可以让某个函式在一个单独的background线程中运行，而主线程继续处理当前的HTTP请求，并在稍后报告background线程的状态(事实上，后台函式的标准输出(stdout)被返回给启动该线程的"backrounder")。
译注：我本来想将background thread翻译为后台线程，后来认为作者本意是想表达“被background修饰的函式所在的线程”，最后翻译采用“background线程”

这样，服务器就可以在处理其他http请求的同时，快速及时地响应当前客户端请求。同时，background线程继续执行需要长时间运行的函式。

例子
-------

    #!/usr/bin/env python
    # -*- coding: utf-8 -*-
    from web import run, background, backgrounder
    from datetime import datetime; now = datetime.now
    from time import sleep

    urls = (
        '/', 'index',
        )

    class index:
        @backgrounder
        def GET(self):
            print "Started at %s" % now()
            print "hit f5 to refresh!"
            longrunning()
            

    @background
    def longrunning():
        for i in range(10):
            sleep(1)
            print "%s: %s" % (i, now())

    if __name__ == '__main__':
        run(urls, globals())

在请求http://localhost:8080/时，将自动重定向到类似http://localhost:8080/?_t=3080772748的网址(t后面的数字就是background线程id)，接下来(在点击几次刷新之后)就会看到如下信息：

    Started at 2008-06-14 15:50:26.764474
    hit f5 to refresh!
    0: 2008-06-14 15:50:27.763813
    1: 2008-06-14 15:50:28.763861
    2: 2008-06-14 15:50:29.763844
    3: 2008-06-14 15:50:30.763853
    4: 2008-06-14 15:50:31.764778
    5: 2008-06-14 15:50:32.763852
    6: 2008-06-14 15:50:33.764338
    7: 2008-06-14 15:50:34.763925
    8: 2008-06-14 15:50:35.763854
    9: 2008-06-14 15:50:36.763789

提示
------------

web.py在background.threaddb字典中保存线程信息。这就很容易检查线程的状态；

    class threaddbviewer:
        def GET(self):
            for k, v in background.threaddb.items():
                print "%s - %s" % ( k, v )

web.py并不会主动去清空threaddb词典，这使得输出(如http://localhost:8080/?_t=3080772748)会一直执行，直到内存被用满。

通常是在backgrounder函式中做线程清理工作，是因为backgrounder可以获得线程id(通过web.input()得到"_t"的值，就是线程id)，从而根据线程id来回收资源。这是因为虽然background能知道自己何时结束，但它无法获得自己的线程id，所以background无法自己完成线程清理。

还要注意 [How not to do thread local storage with Python 在python中如何避免多线程本地存储](http://blogs.gnome.org/jamesh/2008/06/11/tls-python/) - 线程ID有时会被重用(可能会引发错误)

在使用web.background时，还是那句话－－“小心为上”