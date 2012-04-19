---
layout: post
title: Web.py Cookbook 简体中文版 - 站点布局模板
description: Web.py Cookbook 简体中文版 - 站点布局模板
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

### 问题

如何让站点每个页面共享一个整站范围的模板？（在某些框架中，称为模板继承，比如ASP.NET中的母版页）

### 方法

我们可以用 base 属性来实现:
    
    render = web.template.render('templates/', base='layout')
    
现在如果你调用`render.foo()`方法，将会加载`templates/foo.html` 模板，并且它将会被 `templates/layout.html`模板包裹。

 "layout.html" 是一个简单模板格式文件，它包含了一个模板变量，如下:

    $def with (content)
    <html>
    <head>
        <title>Foo</title>
    </head>
    <body>
    $:content
    </body>
    </html>

在某些情况，如果不想使用基本模板，只需要创建一个没有base属性的reander对象，如下：

    render_plain = web.template.render('templates/')
    
###Tip: 在布局文件（layout.html）中定义的页面标题变量，如何在其他模板文件中赋值，如下:

#####templates/index.html
    $var title: This is title.

    <h3>Hello, world</h3>

#####templates/layout.html
    $def with (content)
    <html>
    <head>
        <title>$content.title</title>
    </head>
    <body>
    $:content
    </body>
    </html>

###Tip: 在其他模板中引用css文件，如下:
####templates/login.html

    $var cssfiles: static/login.css static/login2.css

    hello, world.

####templates/layout.html

    $def with (content)
    <html>
    <head>
        <title>$content.title</title>

        $if content.cssfiles:
            $for f in content.cssfiles.split():
                <link rel="stylesheet" href="$f" type="text/css" media="screen" charset="utf-8"/>

    </head>
    <body>
    $:content
    </body>
    </html>

输入的HTML代码如下:

    <link rel="stylesheet" href="static/login.css" type="text/css" media="screen" charset="utf-8"/>
    <link rel="stylesheet" href="static/login2.css" type="text/css" media="screen" charset="utf-8"/>