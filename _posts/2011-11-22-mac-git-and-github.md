---
layout:         post
title:          在 mac 上使用 Git 和 GitHub 连接
description:    在 mac 下连接 GitHub 的方法。
keywords: mac, GitHub, git
category : git
tags : [git, github, mac]
---
记得之前写过一篇 win 下面使用 Git 的文章，今天写下一篇在 mac 下面的。

###首先，需要在 mac 下安装 git.

mac git 的地址: <http://code.google.com/p/git-osx-installer/> 由于可能这个网址访问
不了，所以需要使用源码安装。

###安装好了 Git 之后，就开始设置 GitHub 连接了。

#####1, 检查是否存在 ssh keys
<pre class="js" name="colorcode">
$ cd ~/.ssh
</pre>
如果没有 .ssh 目录，请跳到第 3 步。

#####2, 如果有 .ssh 目录，请备份好你的 ssh key
<pre class="js" name="colorcode">
$ ls
$ mkdir key_backup //创建备份文件夹
$ cp id_rsa* key_backup //移动你的 key 文件到备份文件夹
$ mr id_rsa*
</pre>

#####3, 创建一个新的 ssh key

    $ ssh-keygen -t rsa -C "your_email@youremail.com" //记得输入你的github账号的邮箱
    //会输出下面语句
    Generating public/private rsa key pair.
    Enter file in which to save the keys 
    (/Users/your_user_directory/.ssh/id_rsa): <press enter> //这里需要按下 enter 键就好

按下 enter 之后，又会出现下面的提示：

    Enter passphrase(empty for no passphrase): <enter a passphrase> //输入一个密码
    Enter same passphrase again: <enter passphrase again>

随后，你会收到一大串的提示，大概的意思是告诉你创建好了 id_rsa 和 id_rsa.pub 文件。

#####4, 在 GitHub 上添加你的 ssh key

到刚刚的 .ssh 目录下，找到 id_rsa.pub 文件，拷贝里面的内容，输入到你的
GitHub 账户中的 Add key 区域。
创建成功会有相应的提示。

#####5, 验证你的 GitHub 连接
<pre class="js" name="colorcode">
$ ssh -T git@github.com
</pre>

如果验证成功，会有下面的提示：
<pre class="js" name="colorcode">
Hi username! You have successfully authenticated, but GitHub does not provide shell access.
</pre>

