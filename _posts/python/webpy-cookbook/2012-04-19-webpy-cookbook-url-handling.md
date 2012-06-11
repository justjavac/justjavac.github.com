---
layout: post
title: Web.py Cookbook 简体中文版 - 理解URL控制
description: Web.py Cookbook 简体中文版 - 理解URL控制
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

`问题`: 如何为整个网站设计一个URL控制方案 / 调度模式

`解决`:

web.py的URL控制模式是简单的、强大的、灵活的。在每个应用的最顶部，你通常会看到整个URL调度模式被定义在元组中:

    urls = (
        "/tasks/?", "signin",
        "/tasks/list", "listing",
        "/tasks/post", "post",
        "/tasks/chgpass", "chgpass",
        "/tasks/act", "actions",
        "/tasks/logout", "logout",
        "/tasks/signup", "signup"
    )

这些元组的格式是: _URL路径_, _处理类_ 这组定义有多少可以定义多少。如果你并不知道URL路径和处理类之间的关系，请在阅读cookbook之前先阅读[Hello World example](http://justjavac.com/python/2012/04/19/webpy-cookbook-helloworld)，或者[快速入门](http://justjavac.com/python/2012/04/19/webpy-tutorial.html)。

`路径匹配`

你可以利用强大的正则表达式去设计更灵活的URL路径。比如 /(test1|test2) 可以捕捉 /test1 或 /test2。要理解这里的关键，匹配是依据URL路径的。比如下面的URL:

    http://localhost/myapp/greetings/hello?name=Joe

这个URL的路径是 _/myapp/greetings/hello_。web.py会在内部给URL路径加上^和$ ，这样 _/tasks/_ 不会匹配 _/tasks/addnew_。URL匹配依赖于“路径”，所以不能这样使用，如： _/tasks/delete?name=(.+)_ ,?之后部分表示是“查询”，并不会被匹配。阅读URL组件的更多细节，请访问[web.ctx](http://justjavac.com/python/2012/04/19/webpy-cookbook-ctx.html)。

`捕捉参数`

你可以捕捉URL的参数，然后用在处理类中:

    /users/list/(.+), "list_users"

在 _list/_后面的这块会被捕捉，然后作为参数被用在GET或POST:

    class list_users:
        def GET(self, name):
            return "Listing info about user: {0}".format(name)

你可以根据需要定义更多参数。同时要注意URL查询的参数(?后面的内容)也可以用[web.input()](http://justjavac.com/python/2012/04/19/webpy-cookbook-input)取得。

`开发子程序的时候注意`

为了更好的控制大型web应用，web.py支持[子程序](http://justjavac.com/python/2012/04/19/webpy-cookbook-subapp)。在为子程序设计URL模式的时候，记住取到的路径(http://justjavac.com/python/2012/04/19/webpy-cookbook-ctx)是父应用剥离后的。比如，你在主程序定义了URL"/blog"跳转到'blog'子程序，那没在你blog子程序中所有URL都是以"/"开头的，而不是"/blog"。查看[web.ctx](http://justjavac.com/python/2012/04/19/webpy-cookbook-ctx)取得更多信息。