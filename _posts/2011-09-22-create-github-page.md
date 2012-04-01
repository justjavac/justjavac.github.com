---
layout: post
title: 在 github 上建立 pages 的过程
description: 这篇文章介绍的是使用 github 搭建自己的 pages。
keywords: GitHub, pages
category : git
tags : [pages, github]
---
##建立项目-Repository
  首先在 GitHub 上建立自己库，例如一个 test 库;
  接着在本地建立 test 库的连接：
####Global Setup:
    Set up git 
      git config --global user.name "yourname"
      git config --global user.email "yourmail"
####Next steps:
    mkdir Test
    cd Test
    git init
    touch README
    git add README
    git commit -m 'first commit'
    git remote add origin git@github.com:yourname/Test.git
    git push -u origin master
通过在本地建立一个和 github 上相应的库，然后 push 上去，你随后可以在 github 上
自己的 test 库里面看到你建立了一个 README 文件。这时候你的本地就和 github 连接上
了。
##创建页面-pages
进入 test 库，点击 Admin 菜单进入设置。这时候你就可以创建一个 page 了。创建的
page 是一个页面，其路径为  http://yourname.github.com/test
pages是怎么样的一个概念，你可以参考 <pages.github.com>
接着在本地创建相应的 pages 分支
    cd /path/to/fancypants
    git symbolic-ref HEAD refs/heads/gh-pages
    rm .git/index
    git clean -fdx
紧接着创建 gh-pages 分支并将内容提交到分支上
    echo "My GitHub Page" > index.html
    git add .
    git commit -a -m "First pages commit"
    git push origin gh-pages
因为我们在 github 上系统已经为我们生成了一个好的 index.html,但我们在本地建立了一
个，所以需要将本地的版本和线上的版本同步起来。
    //在本地：
    cd test
    //查看本地分支情况
    git branch
    //切换分支
    git checkout gh-pages
    //当你再次查看分支的时候，＊号就会在 gh-pages 前面
    //更新本地
    git pull origin gh-pages
更新到本地之后，你就会看到你在 github 上的 index.html 文件
    //尝试着编辑，上传，更新看看
    vi index.html
    ⋯⋯
###一些其他的内容
####简单的更新本地代码到 github
    git add . 
    git commit -m 'test'
    git push origin gh-pages
####jekyll 基本目录
    test
     |--- _layouts/
       |--- default.html
       |--- post.html
     |--- _posts/
       |--- 2011-09-22-title1
       |--- 2011-09-22-title2
     |--- css/
       |--- base.css
       |--- sytle.css
     |--- _config.yml
     |--- index.html
####一些函数数
    //页面相关
    page.title
    page.content
    //内容
    content
    //文章相关
    post.title
    post.url
    post.date
    post.id
    post.categories
    post.tags
    post.tags
    post.content
####一些对应的
    //一般都要
    ---
    layout: post
    title: Hello world
    ---
