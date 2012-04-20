---
layout: post
title: web.py 0.3 新手指南 - FAQ
description: web.py 0.3 新手指南 - FAQ
keywords: python, web.py, 新手指南, FAQ
category : python
tags : [python, web.py]
---

99. **如何使用template.py模板?**

    基本的文档内容与一些代码片段，请查看 [template.py doc](http://justjavac.com/python/2012/04/19/webpy-tutorial-templetor/)

    通过web.py应用显示页面，使用如下

            homepage = template.Template(open("homepage.tmpl").read())
            print homepage()

    
99. **为什么urls是一个长长的数组？**

    如果是一个dictionary，那么就不会被排序好。 如果是一个tuples数组, 那需要更加多的文字输入。

99. **如何来通过web.py服务器来处理静态文件比如JavaScripts 或像PNG、JPG这些图片？**

    在运行web.py服务代码的目录下创建一个文件夹命名为 `static`。 然后将你需要的静态文件放到这个 `static` 文件夹下。 比如，   请求URL `http://localhost/static/logo.png` 将会把图片 `./static/logo.png` 传递给客户端。

99. **哪里可以找到更多帮助？**

    Google Groups 上的 [web.py group](http://groups.google.com/group/webpy) 会很有用。

99. **如何来更改默认的 "not found" 页面？**

    你可以改写你自己的notfound函数并将它赋值给 web.webapi.notfound

            def my_notfound(): 
                print "MY OWN NOT FOUND" 
            web.notfound = my_notfound 

99. **将webpy模块导入后，在python中如何才能够自动补全？**

    在IPython中， 导入webpy之后自动补全功能可能会不可用。 你还是可以使用 'python' 的自动补全功能。请尝试输入如下：

            import readline, rlcompleter; readline.parse_and_bind("tab: complete")

    使用tab吧！:-)

    为了能在python运行时可以默认提供该补全功能。 创建文件命名为 '~/.pythonstartup.py' 并将以上import代码放入其中。 然后设置  'PYTHONSTARTUP' 环境变量指向该文件。

    在bash中，如下所示；编辑 ~/.bashrc 并添加：

            export PYTHONSTARTUP=~/.pythonstartup.py

99. **为什么不能访问数据库？**

    If you're trying to access the database from a non-web-serving thread (e.g. you created a new thread or you never started serving web pages) then you need to run `web.load()`. Sorry, this will be fixed in web.py 0.3.

99. **能否多次遍历IterBetter？**

    不可以。 通过 `ib = list(ib)` 将IterBetter转变为数组。

99. **如何输出debug信息到console？**

	web.debug("I will get printed to the console and not the body of the webpage")

99. **我凑巧遇到web.py的一个bug。我需要提交到何处？**

	请到 [webpy launchpad site](https://launchpad.net/webpy), 登录(如果没有帐号请注册) 并点击 "report a bug"。