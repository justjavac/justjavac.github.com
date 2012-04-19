---
layout: post
title: Web.py Cookbook 简体中文版 - 跳转(seeother)与重定向(redirect)
description: Web.py Cookbook 简体中文版 - 跳转(seeother)与重定向(redirect)
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## web.seeother 和 web.redirect

### 问题
在处理完用户输入后（比方说处理完一个表单），如何跳转到其他页面？

### 解法

    class SomePage:
        def POST(self):
            # Do some application logic here, and then:
            raise web.seeother('/someotherpage')

POST方法接收到一个post并完成处理之后，它将给浏览器发送一个303消息和新网址。接下来，浏览器就会对这个新网址发出GET请求，从而完成跳转。

注意：web.seeother和web.redirect不支持0.3以下版本。

### 区别
用web.redirect方法似乎也能做同样的事情，但通常来说，这并太友好。因为web.redirect发送的是301消息－这是永久重定向。因为大多数Web浏览器会缓存新的重定向，所以当我们再次执行该操作时，会自动直接访问重定向的新网址。很多时候，这不是我们所想要的结果。所以在提交表单时，尽量使用seeother。但是在下面要提到的这种场合，用redirect却是最恰当的：我们已经更改了网站的网址结构，但是仍想让用户书签/收藏夹中的旧网址不失效。

(注：要了解seeother和redirect的区别，最好是看一下http协议中不同消息码的含义。)