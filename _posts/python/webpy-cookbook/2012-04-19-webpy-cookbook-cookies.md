---
layout: post
title: Web.py Cookbook 简体中文版 - 如何操作Cookie
description: Web.py Cookbook 简体中文版 - 如何操作Cookie
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

##问题

如何设置和获取用户的Cookie?

##解法

对web.py而言，设置/获取Cookie非常方便。

###设置Cookies
####概述
    setcookie(name, value, expires="", domain=None, secure=False): 
       
* *name* `(string)` - Cookie的名称，由浏览器保存并发送至服务器。
* *value* `(string)` -Cookie的值，与Cookie的名称相对应。
* *expires* `(int)` - Cookie的过期时间，这是个可选参数，它决定cookie有效时间是多久。以秒为单位。它必须是一个整数，而绝不能是字符串。
* *domain* `(string)` - Cookie的有效域－在该域内cookie才是有效的。一般情况下，要在某站点内可用，该参数值该写做站点的域（比如.webpy.org），而不是站主的主机名（比如wiki.webpy.org）
* *secure* `(bool)`- 如果为True，要求该Cookie只能通过HTTPS传输。.

####示例
用`web.setcookie()` 设置cookie,如下:

    class CookieSet:
        def GET(self):
            i = web.input(age='25')
            web.setcookie('age', i.age, 3600)
            return "Age set in your cookie"


用 GET方式调用上面的类将设置一个名为age,默认值是25的cookie(实际上，默认值25是在web.input中赋予i.age的，从而间接赋予 cookie，而不是在setcookie函式中直接赋予cookie的)。这个cookie将在一小时后(即3600秒)过期。

`web.setcookie()`的第三个参数－"expires"是一个可选参数，它用来设定cookie过期的时间。如果是负数，cookie将立刻过期。如果是正数，就表示cookie的有效时间是多久，以秒为单位。如果该参数为空，cookie就永不过期。

###获得Cookies
####概述
获取Cookie的值有很多方法，它们的区别就在于找不到cookie时如何处理。
#####方法1（如果找不到cookie，就返回None）：
    web.cookies().get(cookieName)  
        #cookieName is the name of the cookie submitted by the browser
#####方法2（如果找不到cookie，就抛出AttributeError异常）：
    foo = web.cookies()
    foo.cookieName
#####方法3（如果找不到cookie，可以设置默认值来避免抛出异常）：
    foo = web.cookies(cookieName=defaultValue)
    foo.cookieName   # return the value (which could be default)
        #cookieName is the name of the cookie submitted by the browser

####示例：
用`web.cookies()` 访问cookie.  如果已经用`web.setcookie()`设置了Cookie, 就可以象下面这样获得Cookie:

    class CookieGet:
        def GET(self):
            c = web.cookies(age="25")
            return "Your age is: " + c.age

这个例子为cookie设置了默认值。这么做的原因是在访问时，若cookie不存在，web.cookies()就会抛出异常，如果事先设置了默认值就不会出现这种情况。

如果要确认cookie值是否存在，可以这样做：

    class CookieGet:
        def GET(self):
            try: 
                 return "Your age is: " + web.cookies().age
            except:
                 # Do whatever handling you need to, etc. here.
                 return "Cookie does not exist."

或

    class CookieGet:
        def GET(self):
            age=web.cookies().get(age)
            if age:
                return "Your age is: %s" % age
            else:
                return "Cookie does not exist."