---
layout: post
title: Web.py Cookbook 简体中文版 - db.insert 向数据库中新增数据
description: Web.py Cookbook 简体中文版 - db.insert 向数据库中新增数据
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

##问题
如何向数据加新增数据？

##解决办法

在 0.3 中，数据库连接如下：

    db = web.database(dbn='postgres', db='mydata', user='dbuser', pw='')

数据库连接写好以后，“insert” 操作如下：
    
    # 向 'mytable' 表中插入一条数据
    sequence_id = db.insert('mytable', firstname="Bob",lastname="Smith",joindate=web.SQLLiteral("NOW()"))

上面的操作带入了几个参数，我们来说明一下：

* tablename
* seqname   
* _test  
* \**values 


##tablename
表名，即你希望向哪个表新增数据。

##seqname
可选参数，默认 None。Set `seqname` to the ID if it's not the default, or to `False`.

##_test
`_test` 参数可以让你看到 SQL 的执行过程：

    results = db.select('mytable', offset=10, _test=True) 
    ><sql: 'SELECT * FROM mytable OFFSET 10'>

##\**values
字段参数。如果没有赋值，数据库可能创建默认值或者发出警告。