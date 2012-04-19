---
layout: post
title: Web.py Cookbook 简体中文版 - File Upload Recipe
description: Web.py Cookbook 简体中文版 - File Upload Recipe
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如果你不是很了解表单上传或者CGI的话, 你会觉得文件上传有点奇特.

## 解决方法

    import web
    
    urls = ('/upload', 'Upload')
    
    class Upload:
        def GET(self):
            return """<html><head></head><body>
    <form method="POST" enctype="multipart/form-data" action="">
    <input type="file" name="myfile" />
    <br/>
    <input type="submit" />
    </form>
    </body></html>"""
    
        def POST(self):
            x = web.input(myfile={})
            web.debug(x['myfile'].filename) # 这里是文件名
            web.debug(x['myfile'].value) # 这里是文件内容
            web.debug(x['myfile'].file.read()) # 或者使用一个文件对象
            raise web.seeother('/upload')


    if __name__ == "__main__":
       app = web.application(urls, globals()) 
       app.run()

## 注意

需要注意以下内容:

* 表单需要一个enctype="multipart/form-data"的属性, 否则不会正常工作.
* 在webpy的代码里, 如果你需要默认值的话, myfile就需要默认值了(myfile={}), 文件会以字符串的形式传输 -- 这确实可以工作, 但是你会丢失文件的名称