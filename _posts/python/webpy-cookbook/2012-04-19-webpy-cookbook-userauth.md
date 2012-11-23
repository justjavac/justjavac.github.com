---
layout: post
title: Web.py Cookbook 简体中文版 - 用户认证
description: Web.py Cookbook 简体中文版 - 用户认证
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

**原作者没有写完，但是可以参照下一节，写得很详细**

##问题

如何完成一个用户认证系统？

##解法

用户认证系统由这几个部分组成：用户添加，用户登录，用户注销以及验证用户是否已登录。用户认证系统一般都需要一个数据库。在这个例子中，我们要用到MD5和SQLite。

    import hashlib
    import web    

    def POST(self):
        i = web.input()

        authdb = sqlite3.connect('users.db')
        pwdhash = hashlib.md5(i.password).hexdigest()
        check = authdb.execute('select * from users where username=? and password=?', (i.username, pwdhash))
        if check: 
            session.loggedin = True
            session.username = i.username
            raise web.seeother('/results')   
        else: return render.base("Those login details don't work.")   

##注意

这仅仅是个例子，可不要在真实的生产环境中应用哦。