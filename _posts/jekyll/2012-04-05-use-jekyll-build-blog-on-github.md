---
layout: post
title: 使用jekyll在Github上搭建博客
description: 使用jekyll在Github上搭建博客
keywords: jekyll, github
category : jekyll
tags : [github, jekyll]
---

jekyll是一个使用Ruby编写的静态站点生成工具，使用Liquid模板渲染引擎，支持Markdown和Textile标记语言，并且可以为所有以 .html、.markdown、.textile扩展名结尾的文件使用YAML配置，内置语法高亮功能。

而Github的Pages服务可以为每个Github主机上的仓库提供静态页面服务，并且Pages服务支持jekyll。因为Github Pages有两种Pages，分别是用户页面和项目页面，所以我们可以使用用户页面来创建自己的Blog。

在开始前，请确保你已经有了Github账号一枚和Git的正确配置。没有的朋友可以先移步Github注册并安装配置Git。

首先，创建你的 Blog 仓库 `username.github.com`:

    $ mkdir username.github.com
    $ cd username.github.com
  
新建一个 `index.html` 文件，像下面这样:

    <!doctype html>
    <html>
      <head>
        <title>Hello</title>
      </head>

      <body>
        <h1>Hello!</h1>
      </body>
    </html>

初始化仓库、提交并push到Github:

    $ git init
    $ git add .
    $ git commit -a -m 'init commit.'
    $ git remote add origin
    $ git push origin master
  
现在你打开 `username.github.com` 就可以看到刚才新建的页面了，就是这么简单。当然也可以为你的Blog仓库绑定独立域名，具体做法就是：

1. 在你的仓库中新建内容为 www.youdomain.com 的 CNAME 文件；
2. 在你的域名管理页或者是DNS解析的地方，增加一个记录，记录类别为CNAME(Alias)类型.

*Note：* 如果你在CNAME中填写的是顶级域名，就得设置DNS的记录类别为A(Host)型，并设置主机为 `207.97.227.245`。详细介绍请移步Github的Pages页面。

接下来我们只需要按照自己的喜好设计页面。首先认识下jekyll的文件及目录配置:

      .
      |-- _includes
      |-- _plugins 
      |-- _layout 
      |   |-- default.html
      |   `-- post.html
      |-- _post
      |   |-- yyyy-mm-dd-title.markdown
      |   `-- yyyy-mm-dd-title.markdown
      |-- _site
      |-- _config.yml
      `-- index.html

*_includes*存放你需要在模板文件中包含的文件，你可以使用Liquid标签 `{‰ include file.ext ‰} `来引用相应的文件。

*_plugins*可以增加你自己的插件

*_layout*存放布局模板，请参考<https://github.com/taberhuang/taberhuang.github.com/tree/master/_layouts>

*_post*存放文章列表，文件命名一定要遵循 yyyy-mm-dd-title.html|markdown|textile 规则，请参考<https://github.com/taberhuang/taberhuang.github.com/tree/master/_posts>

*_sitejekyll*自动生成的，所以可以忽略，如果你有在本地安装jekyll并预览了的话，可以使用.gitignore设置Git停止对本目录的跟踪。

*_config.yml*设置经常使用的配置选项，这样在本地启动预览时就不用每次都手动输入了。

*index.html 和所有的 HTML/Markdown/Textile 文件* 所有的HTML/Markdown/Textile文件都可以包含 YAML 配置，这类文件都会被jekyll解析。

现在你可以在自己的仓库中配置好你自己的目录及文件，也可以`clone`我的仓库，然后修改。

    $ git clone https://github.com/taberhuang/taberhuang.github.com.git

修改完后就可以`push`你的代码到Github上，看到结果了。刚才有说到本地预览，如果你想在本地预览后，确保没错误再`push`的话，就需要在本地安装jekyll，下面介绍下jekyll的安装方法。

一、安装Ruby运行环境和RubyGem:Windows用户只要下载 RubyInstaller。下载安装后请手动升级gem.

    $ gem update --system
    
二、安装DevKit。DevKit是windows平台编译和使用本地C/C++扩展包工具。用来模拟Linux平台下的 make,gcc,sh 进行编译。下载文件后，解压到 `C:\DevKit'，再通过命令行安装:

    $ cd C:\DevKit
    $ ruby dk.rb init
    $ ruby dk.rb install
    
三、安装并检查刚才的DevKit安装是否成功。如果成功安装，则DevKit也就安装成功，如果不成功，请重新安装DevKit。

    $ gem install jekyll
    
四、安装Rdiscount，这个是用来解析Markdown标记的解析包。如果你使用Textile的话，就是安装Kramdown。

  $ gem install rdiscount
  
所有的环境和依赖包都安装成功后，进入你的仓库目录，用下面的命令便可启动jekyll，并在本地预览了，预览地址默认为 `127.0.0.1:4000`，当然你也可以通过 _config.yml 配置:

    jekyll --server
  
是不是很爽?

参考及相关资料：

* <http://pages.github.com/>
* <https://github.com/mojombo/jekyll/wiki>
* <http://blog.envylabs.com/2009/08/publishing-a-blog-with-github-pages-and-jekyll/>
* <http://daringfireball.net/projects/markdown/syntax>

