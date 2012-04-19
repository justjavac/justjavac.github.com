---
layout: post
title: Web.py Cookbook 简体中文版 - 使用Apache + mod_wsgi部署webpy应用
description: Web.py Cookbook 简体中文版 - 使用Apache + mod_wsgi部署webpy应用
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

下面的步骤在Apache-2.2.3 (Red Hat Enterprise Linux 5.2, x86_64),mod_wsgi-2.0中测试通过。（译者注：本人在Windows2003 + Apache-2.2.15 + mod_wsgi-3.0也测试通过）

注意：

* 您可以使用您自己的项目名称替换'appname'。
* 您可以使用您自己的文件名称替换'code.py'。
* /var/www/webpy-app 为包含您的code.py的文件夹目录路径。
* /var/www/webpy-app/code.py 是您的python文件的完整路径。

步骤：

* 下载和安装mod_wsgi从它的网站：

[http://code.google.com/p/modwsgi/](http://code.google.com/p/modwsgi/). 它将安装一个'.so'的模块到您的apache 模块文件夹，例如：

        /usr/lib64/httpd/modules/

* 在httpd.conf中配置Apache 加载 mod_wsgi模块和您的项目：

        LoadModule wsgi_module modules/mod_wsgi.so

        WSGIScriptAlias /appname /var/www/webpy-app/code.py/

        Alias /appname/static /var/www/webpy-app/static/
        AddType text/html .py

        <Directory /var/www/webpy-app/>
            Order deny,allow
            Allow from all
        </Directory>

* 演示文件 'code.py':

        import web

        urls = (
            '/.*', 'hello',
            )

        class hello:
            def GET(self):
                return "Hello, world."

        application = web.application(urls, globals()).wsgifunc()

* 在您的浏览器地址栏中输入' http://your_server_name/appname' 来验证它是否可用。

#注意: mod_wsgi + sessions

如果您需要在mod_wsgi中使用sessions，您可以改变您的代码如下：

    app = web.application(urls, globals())

    curdir = os.path.dirname(__file__)
    session = web.session.Session(app, web.session.DiskStore(curdir + '/' + 'sessions'),)

    application = app.wsgifunc()

#mod_wsgi 性能:
有关mod_wsgi的性能，请参考mod_wsgi的维基页：    [http://code.google.com/p/modwsgi/wiki/PerformanceEstimates](http://code.google.com/p/modwsgi/wiki/PerformanceEstimates)