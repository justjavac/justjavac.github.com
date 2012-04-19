---
layout: post
title: Web.py Cookbook 简体中文版 - Webpy + Nginx with FastCGI搭建Web.py
description: Web.py Cookbook 简体中文版 - Webpy + Nginx with FastCGI搭建Web.py
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

这一节讲解的是如何使用Nginx和FastCGI搭建Web.py应用

## 环境依赖的软件包

* Nginx 0.8.\* or 0.7.\* (需要包含fastcgi和rewrite模块)。
* Webpy 0.32
* Spawn-fcgi 1.6.2
* Flup

注意：Flup是最常见的忘记装的软件，需要安装

更老的版本应该也可以工作，但是没有测试过，最新的是可以工作的

## 一些资源

* [Nginx wiki](http://wiki.nginx.org/NginxInstall)
* [Spawn-fcgi](http://redmine.lighttpd.net/projects/spawn-fcgi/news)
* [Flup](http://trac.saddi.com/flup)

## Notes

* 你可以重命名`index.py`为任何你想要的文件名。
* `/path/to/www` 为代码路径。
* `/path/to/www/index.py`为python代码的完整路径。

## Nginx 配置文件

	location / {
	    include fastcgi_params;
	    fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;  # [1]
	    fastcgi_param PATH_INFO $fastcgi_script_name;        # [2]
	    fastcgi_pass 127.0.0.1:9002;
	}

对于静态文件可以添加如下配置:

	location /static/ {
	    if (-f $request_filename) {
		rewrite ^/static/(.*)$  /static/$1 break;
	    }
	}

__注意:__ 地址和端口号可能会是不同的。

## Spawn-fcgi

可以通过一下命令启动一个Spawn-fcgi进程:

	spawn-fcgi -d /path/to/www -f /path/to/www/index.py -a 127.0.0.1 -p 9002

### 启动和关闭的命令

启动:

	#!/bin/sh
	spawn-fcgi -d /path/to/www -f /path/to/www/index.py -a 127.0.0.1 -p 9002

关闭:

	#!/bin/sh
	kill `pgrep -f "python /path/to/www/index.py"`

__Note:__ 你可以随意填写地址和端口信息，但是一定需要和Nginx配置文件相匹配。

## Hello world!

讲下面的代码保存为index.py（或者任何你喜欢的），注意，使用Nginx配置的话，`web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)`这一行代码是必须的。

	#!/usr/bin/env python
	# -*- coding: utf-8 -*-

	import web

	urls = ("/.*", "hello")
	app = web.application(urls, globals())

	class hello:
		def GET(self):
			return 'Hello, world!'

	if __name__ == "__main__":
		web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
		app.run()

注意: 同样需要给代码设置权限，代码如下chmod +x index.py。

## 运行

1. 打开一个 `spawn-fcgi` 进程.
2. 打开 Nginx.

如果需要检查应用程序是否运行，使用`ps aux|grep index.py`可以很容易的查看。

重启nginx配置:

	/path/to/nginx/sbin/nginx -s reload

停止nginx:

	/path/to/nginx/sbin/nginx -s stop

注意：运行后可访问http://localhost访问网站，更多信息可以去参考nginx官方文档。