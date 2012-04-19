---
layout: post
title: web.py 0.3 新手指南 - 如何用Gmail发送邮件
description: web.py 0.3 新手指南 - 如何用Gmail发送邮件
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

### 问题 

如何用Gmail发送邮件？

### 解法

安装和维护邮件服务器通常是沉闷乏味的。所以如果你有Gmail帐号，就可以使用Gmail做为SMTP服务器来发送邮件，我们唯一要做的就只是在`web.config`中指定Gmail的用户名和密码。

    web.config.smtp_server = 'smtp.gmail.com'
    web.config.smtp_port = 587
    web.config.smtp_username = 'cookbook@gmail.com'
    web.config.smtp_password = 'secret'
    web.config.smtp_starttls = True

设置好之后，web.sendmail就能使用Gmail帐号来发送邮件了，用起来和其他邮件服务器没有区别。

    web.sendmail('cookbook@gmail.com', 'user@example.com', 'subject', 'message')

可以在这里了解有关Gmail设置的更多信息 [GMail: Configuring other mail clients][1] 

[1]: http://mail.google.com/support/bin/answer.py?hl=en&answer=13287