---
layout: post
title: Web.py Cookbook 简体中文版 - web.input
description: Web.py Cookbook 简体中文版 - web.input
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

##web.input

### 问题
如何从form或是url参数接受用户数据.

### 解决方法
web.input()方法返回一个包含从url(GET方法)或http header(POST方法,即表单POST)获取的变量的web.storage对象(类似字典).举个例子,如果你访问页面http://example.com/test?id=10,在Python后台你想取得 id=10 ,那么通过web.input()那就是小菜一碟:

    class SomePage:
        def GET(self):
            user_data = web.input()
            return "<h1>" + user_data.id + "</h1>"

有时你想指定一个默认变量,而不想使用None.参考下面的代码:

    class SomePage:
        def GET(self):
            user_data = web.input(id="no data")
            return "<h1>" + user_data.id + "</h1>"

注意,web.input()取得的值都会被当作string类型,即使你传递的是一些数字.


如果你想传递一个多值变量,比如像这样:

    <select multiple size="3">
      <option>foo</option>
      <option>bar</option>
      <option>baz</option>
    </select>

你需要让web.input知道这是一个多值变量,否则会变成一串而不是一个变量 .传递一个list给 web.input 作为默认值,就会正常工作.举个例子, 访问 http://example.com?id=10&id=20:

    class SomePage:
        def GET(self):
            user_data = web.input(id=[])
            return "<h1>" + ",".join(user_data.id) + "</h1>"

译者补充:
多值变量这儿,在WEB上除了上面所说的multiple select 和query strings外,用得最多的就是复选框(checkbox)了,另外还有多文件上传时的&lt;input type="file" ...&gt;.