---
layout: post
title: Web.py Cookbook 简体中文版 - Web.py using FastCGI and Apache 2
description: Web.py Cookbook 简体中文版 - Web.py using FastCGI and Apache 2
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## Requirements

* Apache 2.x
* [mod_fcgid](http://fastcgi.coremail.cn/)
* [mod_rewrite](http://httpd.apache.org/docs/2.0/rewrite/)
* [Flup](http://trac.saddi.com/flup)

Note, on CentOS compiling mod_fcgid requires apache-devel be installed (available via yum).

##Apache Configuration

Replace '/var/www/myapp/' with the path to your apps directory

    LoadModule rewrite_module modules/mod_rewrite.so
    LoadModule fcgid_module modules/mod_fcgid.so

    SocketPath /tmp/fcgidsock
    SharememPath /tmp/fcgid_shm

    Alias /static "/var/www/myapp/static"
    Alias / "/var/www/myapp/"
    <Directory "/var/www/myapp/">
        allow from all
        SetHandler fcgid-script    
        Options +ExecCGI
        AllowOverride None
        <IfModule mod_rewrite.c>      
           RewriteEngine on
           RewriteBase /
           RewriteCond %{REQUEST_URI} !^/icons
           RewriteCond %{REQUEST_URI} !^/favicon.ico$
           RewriteCond %{REQUEST_URI} !^(/.*)+code.py/
           RewriteRule ^(.*)$ code.py/$1 [PT]
        </IfModule>
    </Directory>

    <Directory "/var/www/myapp/static">
          allow from all
          AllowOverride None
          Options -ExecCGI
          SetHandler None
      </Directory>




## Hello World

Note the following line is required:
web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)

    #!/usr/bin/python

    import web

    urls = ("/.*", "hello")
    app = web.application(urls, globals())

    class hello: 
        def GET(self):
        return 'Hello, world!'

    web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
    if __name__ == "__main__":
        app.run()


## Run

1. Start your server. 
1. Open your application with your browser
1. To confirm your application is running try:

<code>
 ps aux | grep code.py
</code>

## Troubleshooting

<br>
###Check your apache error log for information!

<br>
##Common problems
<br>

###File permissions. 
You might see error code 255 in your logs.
Ensure the directory is readable and that code. py is executable:

<code>
chmod +x code.py
</code>

###404 Not Found. 
Is your Alias path correct in your apache configuration?

###Other problems
Web.py spawns http://0.0.0.0:8080, dies unexpectedly, or returns nothing. 
Did you add this line?
<pre>
 web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
</pre>
#Misc
After updating your application you may need to restart your web server to see the changes.