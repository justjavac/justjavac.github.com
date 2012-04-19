---
layout: post
title: Web.py Cookbook 简体中文版
description: Web.py Cookbook 简体中文版
keywords: python, web.py, Cookbook
category : python
tags : [python, web.py]
---

欢迎来到web.py 0.3的Cookbook。提醒您注意：某些特性在之前的版本中并不可用。当前开发版本是0.3。

##格式

1. 在编排内容时，请尽量使用cookbook格式...如：
    
    ###问题：如何访问数据库中的数据？
     
    ###解法：使用如下代码...

1. 请注意，网址中不必含有"web"。如"/cookbook/select"，而非"/cookbook/web.select"。

1. 该手册适用于0.3版本，所以您在添加代码时，请确认代码能在新版本中工作。

-------------------------------------------------

##基本应用:
* [Hello World](helloworld.zh-cn)
* [提供静态文件访问](staticfiles.zh-cn)
* [理解URL控制](url_handling.zh-cn)
* [跳转与重定向](redirect%20seeother.zh-cn)
* [使用子应用](subapp.zh-cn)
* [提供XML访问](xmlfiles.zh-cn)
* [从post读取原始数据](postbasic.zh-cn)

##高级应用
* [用web.ctx获得客户端信息](ctx.zh-cn)
* [应用处理器，添加钩子和卸载钩子](application_processors.zh-cn)
* [如何使用web.background](background.zh-cn)
* [自定义NotFound信息](custom_notfound.zh-cn)
* [如何流传输大文件](streaming_large_files.zh-cn)
* [对自带的webserver日志进行操作](logging.zh-cn)
* [用cherrypy提供SSL支持](ssl.zh-cn)
* [实时语言切换](runtime-language-switch.zh-cn)

##Sessions and user state 会话和用户状态:
* [如何使用Session](sessions.zh-cn)
* [如何在调试模式下使用Session](session_with_reloader.zh-cn)
* [在template中使用session](session_in_template.zh-cn)
* [如何操作Cookie](cookies.zh-cn)
* [用户认证](userauth.zh-cn)
* [一个在postgreSQL数据库环境下的用户认证的例子](userauthpgsql.zh-cn)
* [如何在子应用中操作Session](sessions_with_subapp.zh-cn)


##Utils 实用工具:
* [如何发送邮件](sendmail.zh-cn)
* [如何利用Gmail发送邮件](sendmail_using_gmail.zh-cn)
* [使用soaplib实现webservice](webservice.zh-cn)

##Templates 模板
* [Templetor: web.py 模板系统](/docs/0.3/templetor.zh-cn)
* [使用站点布局模板](layout_template.zh-cn)
* [交替式风格 (未译)](alternating_style.zh-cn)
* [导入函数到模板中 (未译)](template_import.zh-cn)
* [模板文件中的i18n支持](i18n_support_in_template_file.zh-cn)
* [在web.py中使用Mako模板引擎 ](template_mako.zh-cn)
* [在web.py中使用Cheetah模板引擎](template_cheetah.zh-cn)
* [在web.py中使用Jinja2模板引擎](template_jinja.zh-cn)
* [如何在谷歌应用程序引擎使用模板](templates_on_gae.zh-cn)

##Testing 测试:
* [Testing with Paste and Nose (未译)](testing_with_paste_and_nose.zh-cn)
* [RESTful doctesting using an application's request method (未译)](restful_doctesting_using_request.zh-cn)

##User input 用户输入:
* [文件上传](fileupload.zh-cn)
* [保存上传的文件](storeupload.zh-cn)
* [上传文件大小限定](limiting_upload_size.zh-cn)
* [通过 web.input 接受用户输入](input.zh-cn)
* [怎样使用表单](forms.zh-cn)
* [显示个别表单字段](form_fields.zh-cn)

##Database 数据库
* [使用多数据库](multidbs.zh-cn)
* [Select: 查询数据](select.zh-cn)
* [Update: 更新数据 ](update.zh-cn)
* [Delete: 删除数据](delete.zh-cn)
* [Insert: 新增数据](Insert.zh-cn)
* [Query: 高级数据库查询](query.zh-cn)
* [怎样使用数据库事务](transactions.zh-cn)
* [使用 sqlalchemy](sqlalchemy.zh-cn)
* [整合 SQLite UDF (用户定义函数) 到 webpy 数据库层](sqlite-udf.zh-cn)
* [使用字典动态构造where子句](where_dict.zh-cn)

##Deployment 部署:
* [通过Fastcgi和lighttpd部署](fastcgi-lighttpd.zh-cn)
* [通过Webpy和Nginx with FastCGI搭建Web.py](fastcgi-nginx.zh-cn) 
* [CGI deployment through Apache (未译)](cgi-apache.zh-cn)
* mod_python deployment through Apache (requested)
* [通过Apache和mod_wsgi部署](mod_wsgi-apache.zh-cn)
* [mod_wsgi deployment through Nginx (未译)](mod_wsgi-nginx.zh-cn)
* [Fastcgi deployment through Nginx (未译)](fastcgi-nginx.zh-cn)

##Subdomains 子域名:
* Subdomains and how to access the username (requested)