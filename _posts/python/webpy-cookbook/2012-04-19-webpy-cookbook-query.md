---
layout: post
title: web.py 0.3 新手指南 - 使用db.query进行高级数据库查询
description: web.py 0.3 新手指南 - 使用db.query进行高级数据库查询
keywords: python, web.py
category : python
tags : [python, web.py]
---

### 问题：

您要执行的SQL语句如：高级的联接或计数。

### 解决：

webpy不会尝试为您和您的数据库建立层。相反，它试图以方便的通用任务，走出自己的方式，当您需要做的更高级的主题。执行高级的数据库查询是没有什么不同。例如：

    import web

    db = web.database(dbn='postgres', db='mydata', user='dbuser', pw='')
    
    results = db.query("SELECT COUNT(*) AS total_users FROM users")
    print results[0].total_users # -> prints number of entries in 'users' table


或者是，使用一个JOIN示例:

    import web
    
    db = web.database(dbn='postgres', db='mydata', user='dbuser', pw='')
    
    results = db.query("SELECT * FROM entries JOIN users WHERE entries.author_id = users.id")


为了防止SQL注入攻击，db.query还接受了“vars”语法如下描述[db.select](http://justjavac.com/python/2012/04/19/webpy-cookbook-select.html):

    results = db.query("SELECT * FROM users WHERE id=$id", vars={'id':10})

这将避免用户输入，如果你信任这个“id”变量。