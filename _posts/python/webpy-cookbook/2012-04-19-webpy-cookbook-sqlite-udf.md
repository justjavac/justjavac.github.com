---
layout: post
title: Web.py Cookbook 简体中文版 - 整合 SQLite UDF (用户定义函数) 到 webpy 数据库层
description: Web.py Cookbook 简体中文版 - 整合 SQLite UDF (用户定义函数) 到 webpy 数据库层
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题：

用户在邮件列表中询问，我把它放在这里作为将来使用和参考。

## 解决：

您可以添加到Python函数到SQLite，并让它们在您的查询调用。

### 示例：

<pre>
>>> import sqlite3 as db
>>> conn = db.connect(":memory:")
>>> conn.create_function("sign", 1, lambda val: val and (val > 0 and 1 or -1))
>>> cur = conn.cursor()
>>> cur.execute("select 1, -1")
&lt;sqlite3.Cursor object at 0xb759f2c0&gt;
>>> print cur.fetchall()
[(1, -1)]
>>> cur.execute("select sign(1), sign(-1), sign(0), sign(-99), sign(99)")
&lt;sqlite3.Cursor object at 0xb759f2c0&gt;
>>> print cur.fetchall()
[(1, -1, 0, -1, 1)]
>>> conn.close()</pre>

在webpy中，你可以通过游标如 `db._db_cursor().connection` 取得连接对象的引用。

### 示例：

<pre>
>>> import web
>>> db = web.database(dbn="sqlite", db=":memory:")
>>> db._db_cursor().connection.create_function("sign", 1, lambda val: val and (val > 0 and 1 or -1))
>>> print db.query("select sign(1), sign(-1), sign(0), sign(-99), sign(99)").list()
[&lt;Storage {'sign(1)': 1, 'sign(-1)': -1, 'sign(99)': 1, 'sign(-99)': -1, 'sign(0)': 0}&gt;]
</pre>