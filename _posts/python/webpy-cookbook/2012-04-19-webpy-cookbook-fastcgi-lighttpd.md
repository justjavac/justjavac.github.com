---
layout: post
title: Web.py Cookbook 简体中文版 - 通过Fastcgi和lighttpd部署
description: Web.py Cookbook 简体中文版 - 通过Fastcgi和lighttpd部署
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---


如果你对这个主题有任何问题，可以点击下面的链接访问相应的话题:

http://www.mail-archive.com/webpy@googlegroups.com/msg02800.html

下面的代码基于lighttpd 1.4.18，更高版本也可以工作

##Note:  
* 你可以重命名 <code>code.py</code>为任何你自己愿意的名字，该例子还是以code.py为例。
* <code>/path-to/webpy-app</code> 为包含你的 <code>code.py</code>代码的路径。
* <code>/path-to/webpy-app/code.py</code> 应该是你的**python file**的完整路径。

如果你还不确定你的lighttpd版本的话，你可以在命令行中使用<code>lighttpd -v</vode>查看相应的版本信息。

Note: 较早版本的lighttpd可能会按照不同的方式组织.conf文件，但是它们应该遵循的是相同的原则。

###ligghttpd 在 Debian GNU/Linux 下的配置文件

<pre>
Files and Directories in /etc/lighttpd:
---------------------------------------

lighttpd.conf:
         main configuration file

conf-available/
        This directory contains a series of .conf files. These files contain
        configuration directives necessary to load and run webserver modules.
        If you want to create your own files they names should be
        build as nn-name.conf where "nn" is two digit number (number
        is used to find order for loading files)

conf-enabled/
        To actually enable a module for lighttpd, it is necessary to create a
        symlink in this directory to the .conf file in conf-available/.

Enabling and disabling modules could be done by provided
/usr/sbin/lighty-enable-mod and /usr/sbin/lighty-disable-mod scripts.
</pre>

<strong>
对于web py， 你需要允许 mod_fastcgi 模块和 mod_rewrite模块, 运行: <code>/usr/sbin/lighty-enable-mod</code> 启用 <code>fastcgi</code> （Mac OS X可能不需要）  
(mod_rewrite 模块可能需要启用 <code>10-fastcgi.conf</code>文件).

##下面是文件的基本结构（Mac OS X不同）:
* <code>/etc/lighttpd/lighttpd.conf</code>
* <code>/etc/lighttpd/conf-available/10-fastcgi.conf</code>
* <code>code.py</code>

对于Mac OS X或任何以Mac Ports邓方式安装的lighttpd，可以直接在路径下编写.conf文件并用lighttpd -f xxx.conf启动lighttpd，而无需去修改或考虑任何文件结构。

<code>/etc/lighttpd/lighttpd.conf</code>

<pre>
server.modules              = (
            "mod_access",
            "mod_alias",
            "mod_accesslog",
            "mod_compress",
)
server.document-root       = "/path-to/webpy-app"
</pre>

对我来说，我使用 postgresql，因此需要授予对的数据库权限，可以添加行如下（如果不使用则不需要）。

<pre>
server.username = "postgres"
</pre>

<code>/etc/lighttpd/conf-available/10-fastcgi.conf</code>

<pre>
server.modules   += ( "mod_fastcgi" )
server.modules   += ( "mod_rewrite" )

 fastcgi.server = ( "/code.py" =>
 (( "socket" => "/tmp/fastcgi.socket",
    "bin-path" => "/path-to/webpy-app/code.py",
    "max-procs" => 1,
   "bin-environment" => (
     "REAL_SCRIPT_NAME" => ""
   ),
   "check-local" => "disable"
 ))
 )

如果本地的lighttpd跑不起来的话，需要设置check-local属性为disable。

 url.rewrite-once = (
   "^/favicon.ico$" => "/static/favicon.ico",
   "^/static/(.*)$" => "/static/$1",
   "^/(.*)$" => "/code.py/$1",
 )
</pre>

<code>/code.py</code>  
在代码头部添加以下代码，让系统环境使用系统环境中当前的python

<pre>
#!/usr/bin/env python
</pre>

最后不要忘记了要对需要执行的py代码设置执行权限，否则你可能会遇到“permission denied”错误。

<pre>
$ chmod 755 /path-to/webpy-app/code.py
</pre>