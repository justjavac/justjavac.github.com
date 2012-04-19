---
layout: post
title: web.py 0.3 新手指南 - Sessions
description: web.py 0.3 新手指南 - Sessions
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

## 问题

如何在web.py中使用session

## 解法

*注意！！！：session并不能在调试模式(Debug mode)下正常工作，这是因为session与调试模试下的重调用相冲突(有点类似firefox下著名的Firebug插件，使用Firebug插件分析网页时，会在火狐浏览器之外单独对该网页发起请求，所以相当于同时访问该网页两次)，下一节中我们会给出在调试模式下使用session的解决办法。*

`web.session`模块提供session支持。下面是一个简单的例子－－统计有多少人正在使用session(session计数器)：

    import web
    web.config.debug = False
    urls = (
        "/count", "count",
        "/reset", "reset"
    )
    app = web.application(urls, locals())
    session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'count': 0})

    class count:
        def GET(self):
            session.count += 1
            return str(session.count)
            
    class reset:
        def GET(self):
            session.kill()
            return ""

    if __name__ == "__main__":
        app.run()

web.py在处理请求之前，就加载session对象及其数据；在请求处理完之后，会检查session数据是否被改动。如果被改动，就交由session对象保存。

上例中的`initializer`参数决定了session初始化的值，它是个可选参数。

如果用数据库代替磁盘文件来存储session信息，只要用`DBStore`代替`DiskStore`即可。使用DBStore需要建立一个表，结构如下：

     create table sessions (
        session_id char(128) UNIQUE NOT NULL,
        atime timestamp NOT NULL default current_timestamp,
        data text
    );

`DBStore`被创建要传入两个参数：`db`对象和session的表名。

    db = web.database(dbn='postgres', db='mydatabase', user='myname', pw='')
    store = web.session.DBStore(db, 'sessions')
    session = web.session.Session(app, store, initializer={'count': 0})


｀web.config｀中的`sessions_parameters`保存着session的相关设置，`sessions_parameters`本身是一个字典，可以对其修改。默认设置如下：

    web.config.session_parameters['cookie_name'] = 'webpy_session_id'
    web.config.session_parameters['cookie_domain'] = None
    web.config.session_parameters['timeout'] = 86400, #24 * 60 * 60, # 24 hours   in seconds
    web.config.session_parameters['ignore_expiry'] = True
    web.config.session_parameters['ignore_change_ip'] = True
    web.config.session_parameters['secret_key'] = 'fLjUfxqXtfNoIldA0A0J'
    web.config.session_parameters['expired_message'] = 'Session expired'

 * cookie_name - 保存session id的Cookie的名称
 * cookie_domain - 保存session id的Cookie的domain信息
 * timeout - session的有效时间 ，以秒为单位
 * ignore_expiry - 如果为True，session就永不过期
 * ignore_change_ip - 如果为true，就表明只有在访问该session的IP与创建该session的IP完全一致时，session才被允许访问。
 * secret_key       - 密码种子，为session加密提供一个字符串种子
 * expired_message  - session过期时显示的提示信息。