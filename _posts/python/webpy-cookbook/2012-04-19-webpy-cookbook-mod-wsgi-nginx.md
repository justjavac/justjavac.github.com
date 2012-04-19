---
layout: post
title: Web.py Cookbook 简体中文版 - deploying web.py with nginx and mod_wsgi
description: Web.py Cookbook 简体中文版 - deploying web.py with nginx and mod_wsgi
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

It is possible to deploy web.py with nginx using a mod_wsgi similar to the module for Apache.

After compiling and installing nginx with mod_wsgi, you can easily get a web.py app up and running with the following config* (edit the paths and settings with your own):


    wsgi_python_executable  /usr/bin/python;

    server {
        listen 80;
        server_name www.domain_name.com domain_name.com;
        root /path/to/your/webpy;

        include /etc/nginx/wsgi_vars;
        location / {
            wsgi_pass /path/to/your/webpy/app.py;     
         }
    }

*Note: This is a snippet of the relevant information to setup mod_wsgi for your web app and NOT a full config for running nginx.

Helpful links:<br />
[ nginx website](http://nginx.net/ )<br />
[ wiki page on mod_wsgi](http://wiki.codemongers.com/NginxNgxWSGIModule )