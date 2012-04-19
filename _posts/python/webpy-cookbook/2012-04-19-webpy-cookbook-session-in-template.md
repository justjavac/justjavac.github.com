---
layout: post
title: web.py 0.3 新手指南 - 在template中使用session
description: web.py 0.3 新手指南 - 在template中使用session
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

`问题`: 我想在模板中使用session（比如：读取并显示session.username）

`解决`:

在应用程序中的代码:

    render = web.template.render('templates', globals={'context': session})

在模板中的代码:

    <span>You are logged in as <b>$context.username</b></span>

你可以真正的使用任何符合语法的python变量名，比如上面用的_context_。我更喜欢在应用中直接使用'session'。