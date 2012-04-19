---
layout: post
title: web.py 0.3 新手指南 - db.select 查询
description: web.py 0.3 新手指南 - db.select 查询
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

##问题:

怎样执行数据库查询？

##解决方案: 

如果是0.3版本, 连接部分大致如下:

    db = web.database(dbn='postgres', db='mydata', user='dbuser', pw='')

当获取数据库连接后, 可以这样执行查询数据库:
    
    # Select all entries from table 'mytable'
    entries = db.select('mytable')

select方法有下面几个参数:

* vars
* what
* where
* order
* group
* limit
* offset
* _test

###vars
vars变量用来填充查询条件.  如:

    myvar = dict(name="Bob")
    results = db.select('mytable', myvar, where="name = $name")

###what
what是标明需要查询的列名, 默认是*, 但是你可以标明需要查询哪些列.

    results = db.select('mytable', what="id,name")

###where
where查询条件, 如:

    results = db.select('mytable', where="id>100")

###order
排序方式:

    results = db.select('mytable', order="post_date DESC")

###group
按group组排列.

    results = db.select('mytable', group="color")    

###limit
从多行中返回limit查询. 
 
    results = db.select('mytable', limit=10) 

###offset
偏移量, 从第几行开始.   

    results = db.select('mytable', offset=10) 

###_test
查看运行时执行的SQL语句:

    results = db.select('mytable', offset=10, _test=True) 
    <sql: 'SELECT * FROM mytable OFFSET 10'>