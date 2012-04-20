---
layout: post
title: Web.py Cookbook 简体中文版 - 保存上传的文件
description: Web.py Cookbook 简体中文版 - 保存上传的文件
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

上传文件，并将其保存到预先设定的某个目录下。

## 方法

    import web
    
    urls = ('/upload', 'Upload')
    
    class Upload:
        def GET(self):
            web.header("Content-Type","text/html; charset=utf-8")
            return """<html><head></head><body>
    <form method="POST" enctype="multipart/form-data" action="">
    <input type="file" name="myfile" />
    <br/>
    <input type="submit" />
    </form>
    </body></html>"""
    
        def POST(self):
            x = web.input(myfile={})
            filedir = '/path/where/you/want/to/save' # change this to the directory you want to store the file in.
            if 'myfile' in x: # to check if the file-object is created
                filepath=x.myfile.filename.replace('\\','/') # replaces the windows-style slashes with linux ones.
                filename=filepath.split('/')[-1] # splits the and chooses the last part (the filename with extension)
                fout = open(filedir +'/'+ filename,'w') # creates the file where the uploaded file should be stored
                fout.write(x.myfile.file.read()) # writes the uploaded file to the newly created file.
                fout.close() # closes the file, upload complete.
            raise web.seeother('/upload')


    if __name__ == "__main__":
       app = web.application(urls, globals()) 
       app.run()

## Hang ups

同时还需要注意如下几点:

* 转到 [fileupload](http://justjavac.com/python/2012/04/19/webpy-cookbook-fileupload)。
* 千万不要让用户把文件上传到那些不经过文件后缀和类型检查而执行文件的文件夹下。
* 事实上，一定要以"mb"模式打开文件（在windows下）， 也就是二进制可写模式, 否则图片将无法上传。