---
layout: post
title: Web.py Cookbook 简体中文版 - 怎样使用数据库事务处理
description: Web.py Cookbook 简体中文版 - 怎样使用数据库事务处理
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题：

怎样使用数据库事务处理？

## 解决：

数据库对象有一个方法“transaction”,将启动一个新的事务，并返回事务对象。这个事务对象可以使用commit提交事务或rollback来回滚事务。

    import web

    db = web.database(dbn="postgres", db="webpy", user="foo", pw="")
    t = db.transaction()
    try:
        db.insert('person', name='foo')
        db.insert('person', name='bar')
    except:
        t.rollback()
        raise
    else:
        t.commit()

在python 2.5+以上的版本，事务同样可以在段中使用：

    from __future__ import with_statement
    
    db = web.databse(dbn="postgres", db="webpy", user="foo", pw="")
     
    with db.transaction():
        db.insert('person', name='foo')
        db.insert('person', name='bar')
        
它同样可能有一个嵌套的事务：

    def post(title, body, tags):
        t = db.transaction()
        try:
            post_id = db.insert('post', title=title, body=body)
            add_tags(post_id, tags)
        except:
            t.rollback()
        else:
            t.commit()

    def add_tags(post_id, tags):
        t = db.transaction()
        try:
            for tag in tags:
                db.insert('tag', post_id=post_id, tag=tag)
        except:
            t.rollback()
        else:
            t.commit()

嵌套的事务在sqlite中将被忽略，因为此特性不被sqlite支持。