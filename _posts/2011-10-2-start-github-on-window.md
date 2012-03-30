---
layout:       post
title:        window 下建立 github 连接
description:    在 window 下如何使用 GitHub 呢？这篇文章一步一步教你。
keywords: GitHub, windows
category : Markdown
tags : [github, Windows]
---
在 window 下搭建 github 连接。
###前提
这个前提还是比较简单的，你需要有一个 email，然后在 GitHub 上注册一个账户。

###工具
在 window 建立 ssh 连接的工具挺多的。GitHub 也有自己的一个工具来帮助用户建立 Git
连接--Git。
哈哈，[这儿下载Git](http://code.google.com/p/msysgit/downloads/list),具体的安装
方法参考[这里](http://help.github.com/win-set-up-git/)

###输入命令，建立连接
安装好 Git 之后，可别把它丢在一边不理了。这里有一些命令需要你手动输入。
1.  检查是否含有 SSH keys。（如果有的话，直接跳到第 4 步）不要太急哈，你刚刚才注
册，怎么会有呢？
    $ cd ~/.ssh
如果你在这里显示 "No such file or dirdectory" 请先跳到第 3 步，然后再跳回第 2 步
，挺好玩的哈。

2.  备份和删除已经存在的 SSH keys
        $ ls
        //这里大概会显示出你的几个文件，如下：
        config id_rsa id_rsa.pub know_hosts
        $ mkdir key_backup 
        //创建一个备份目录
        $ cp id_rsa* key_backup
        //将 keys 保存到 key_backup, *号表示各种后缀
        $ rm id_rsa*
        //删除啦

3.  新建一个 SSH keys
输入下面的代码哈。到了需要路径的时候，点击 enter 就好。
        $ ssh-keygen -t rsa -C "your_email@yourmail.com"
        //引号部分是你的刚刚申请的 github 帐号的邮箱噢,这个时候会输出如下内容：
        Generating public/private rsa key pair.
        Enter file in which to save the key
        //让你输入要保存 key 的路径
        (/users/your_user_directory/.ssh/id_rsa):
        //你只需要 enter 就好

    接着还要输入 ssh 密码
        Enter passphrase (empty for no passphrase):
        //输入密码
        Enter same passphrase again:
        //再次输入密码

    紧接着你会看到如下的输出：
        Your identification has been saved in
        /Users/your_user_directory/.ssh/id_rsa.
        Your public key has been saved in
        /User/your_user_directory/.ssh/id_rsa.pub.
        The key fingerpring is:
        01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db user_name@username.com
        +--[ RSA 2048]----+
        |                 |
        |                 |
        |                 |
        |                 |
        |                 |
        +-----------------+
    注：是不是你没看到下面那个框框呢？只看到一串这样格式的字符01:0f:f4...?这没关系，
待会你按照下面说的做就好了。

4.  把 SSH key 加到你的 GitHub
嘿嘿，登录 GitHub，然后点击 "Account Setting" > "SSH Public Keys" > "Add another public key"
然后打开 id_rsa.pub 文件（用 txt 打开就好，或者 vim ）。这就是你的公钥。
注：id_rsa.pub 的路径是 C:\Documents and Settings\Administrator\.ssh\ ，如果你刚
刚按上面的做的话。

5.  测试啦
  现在可以尝试使用 SSH 连接到 GitHub 啦。输入下面命令：
        $ ssh -T git@github.com

    接着会出现这样的代码：
        The authenticity of host 'github.com(207.97.227.239)' can not be established.
        RSA key fingerprint is 10:10:10:....
        //省略后面那一串
        Are you sure you want to connitnue connecting(yes/no)?

    别当心，输入 yes，成功的话，会显示这样：
        Hi username! ...

    如果显示 fail 的话，请检查一下你刚刚在 GitHub 上的公钥，是否少了空格或者换行之类
的。

###后续的工作
现在你已经可以通过使用 Git 设置 SSH keys 来连接到你的 GitHub 上面了。接下来你可
以设置你的个人信息，token 或者其他等。这里不列举了。
万事开头难，加油。

###参考文章
[GitHub 上的帮助文档](http://help.github.com/win-set-up-git/)
