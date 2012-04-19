---
layout: post
title: Web.py Cookbook 简体中文版 - 使用字典动态构造where子句
description: Web.py Cookbook 简体中文版 - 使用字典动态构造where子句
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

问题
-------

你希望创建一个字典来构造动态的where子句并且希望能够在查询语句中使用。

解决
--------

    >>> import web
    >>> db = web.database(dbn='postgres', db='mydb', user='postgres')
    >>> where_dict = {'col1': 1, col2: 'sometext'}
    >>> db.delete('mytable', where=web.db.sqlwhere(where_dict), _test=True)
    <sql: "DELETE FROM mytable WHERE col1 = 1 AND col2 = 'sometext'">

解释
-----------

`web.db.sqlwhere` takes a Python dictionary as an argument and converts it into a string useful for where clause in different queries. You can also use an optional `grouping` argument to define the exact gouping of the individual keys. For instance:

`web.db.sqlwhere`将Python的字典作为参数并且转换为适用于不同的查询语句的where子句的string类型数据。你也可以使用`grouping`参数来定义链接字典中的key的链接字符。例子如下。

    >>> import web
    >>> web.db.sqlwhere({'a': 1, 'b': 2}, grouping=' OR ')
    'a = 1 OR b = 2'

`grouping` 的默认值为 `' AND '`.