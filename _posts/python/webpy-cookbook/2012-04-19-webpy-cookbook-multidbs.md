---
layout: post
title: web.py 0.3 新手指南 - 多数据库使用
description: web.py 0.3 新手指南 - 多数据库使用
keywords: python, web.py, 新手指南, 数据库
category : python
tags : [python, web.py]
---

## 问题
如何在单独项目中应用多数据库?

## 解决办法

webpy 0.3 支持多数据库操作,并从web模块中移走数据库部分, 使其成为一个更典型的对象.  例子如下:

    import web
    
    db1 = web.database(dbn='mysql', db='dbname1', user='foo')
    db2 = web.database(dbn='mysql', db='dbname2', user='foo')
    
    print db1.select('foo', where='id=1')
    print db2.select('bar', where='id=5')
    
增加, 更新, 删除和查询的方法跟原有单数据库操作类似.

当然, 你可以使用host和port参数来指定服务器地址和监听端口.