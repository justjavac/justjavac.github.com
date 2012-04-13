---
layout:     post
title:      Git教程 快速上手
keywords: git, github
category : git
tags : [github, git]
---

### 1 配置git身份信息

    git config --global user.name "abc"
    git config --global user.email "abc@email.com"

### 2 下载项目代码

在工作目录下，比如 D:/work/

    git clone root@abc.com:~/web/projectname
    
即可在 D:/work/projectname目录下生成一份projectname工程代码

### 3 目录切换到D:/work/projectname 更新代码至最新版本

    git pull root@abc.com:~/web/projectname test
    
我们的最新代码都会提交到版本库的某个分支上面，所以要从分支pull最新的代码下来

### 4 修改代码以后，查看改了哪些东西

    git status

### 5 提交修改的代码到本地版本库

    git commit -a -m "代码注释"

注释很重要，一定要写。

### 6 把本地代码push到代码服务器的test分支上面

先pull一下最近的代码，因为在你修改代码的时候，其他人有可能已经提交了最新的代码到服务器上面

    git pull root@abc.com:~/web/projectname test
    
这步完成以后，如果有冲突，要先在IDE里面解决冲突

然后提交代码

    git push root@abc.com:~/web/project master:test

### 7 大功告成！你已经是个精通Git的高级程序猿了。

