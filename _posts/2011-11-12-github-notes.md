---
layout:        post
title:        Git/SVN 常用命令笔记
description:    很久没有更新 GitHub 了，以至于那些熟悉的命令也忘记了。今天更新一下，把最基础的内容记下。
keywords: git, svn
category : git
tags : [git, svn]
---
很久没有更新 GitHub 了，以至于那些熟悉的命令也忘记了。今天更新一下，最基础的一些
命令，以备以后翻阅。
加之最近工作团队需要，经常使用 SVN ，所有将 SVN 的常用命令也记在后面。以备后用。

####下载源码
    git clone xx@xx:/xxx.git
    
####更新源码
    git pull

####分支相关
    git branch --查看分支
    git checkout -b name  --创建分支

####更新相关
    git add . -- 增加新的内容
    git commit -m '修改的信息' -- 提交的内容的信息
    git push -u origin master -- 将内容提交到主分支
    
####Git状态
    git status

####查看提交内容的差异
    git log -p -1(1是最新的一条)
 
###SVN相关

####将文件下载到本地
    svn checkout path(服务器上的目录)
    //简写 svn co

####往版本库添加新文件
    svn add file(文件名)

####提交文件到版本库
    svn commit -m 'logMassage' (文件名)
    
####加锁／解锁
    svn lock -m 'lockMessage' (文件名)
    svn unlock path

####更新到某个版本
    svn update -r m path -- m是版本号，path为文件名
    //简写 svn up

####查看文件或者目录状态
    svn status path
    
####删除文件
    svn delete path -m 'delete message'
    //简写 svn (del, remove, rm)
    
####查看日志
    svn log path
    
####比较差异
    svn diff 文件名
    //简写 svn di
