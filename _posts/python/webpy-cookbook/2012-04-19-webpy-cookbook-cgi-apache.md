---
layout: post
title: Web.py Cookbook 简体中文版 - CGI deployment on Apache
description: Web.py Cookbook 简体中文版 - CGI deployment on Apache
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

Here are the simple steps needed to create and run an web.py application.

* Install web.py and flups

* Create the application as documented

        if __name__ == "__main__":
            web.run(urls, globals())

For our example, let it be named `app.py`, located in `/www/app` and we need it accessible as `http://server/app/app.py`.

* Configure Apache (version 2.2 in this example)

        ScriptAlias /app "/www/app/"
        <Directory "/www/app/">
                Options +ExecCGI +FollowSymLinks
                Order allow,deny
                Allow from all
        </Directory>

That's it. Your application is accessible via `http://server/app/app.py/`. Additional URLs handled by the application are added to the end of the URL, for examples `http://server/app/app.py/myurl`.

* .htaccess configuration 

              Options +ExecCGI
              AddHandler cgi-script .py
              DirectoryIndex index.py
              <IfModule mod_rewrite.c>
                  RewriteEngine on
                  RewriteBase /
                  RewriteCond %{REQUEST_FILENAME} !-f
                  RewriteCond %{REQUEST_FILENAME} !-d
                  RewriteCond %{REQUEST_URI} !^/favicon.ico$
                  RewriteCond %{REQUEST_URI} !^(/.*)+index.py/
                  RewriteRule ^(.*)$ index.py/$1 [PT]
              </IfModule>

Here it is assumed that your application is called index.py. The above htaccess checks if some static file/directory exists failing which it routes the data to your index.py. Change the Rewrite Base to a sub-directory if needed.