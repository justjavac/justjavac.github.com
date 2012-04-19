---
layout: post
title: Web.py Cookbook 简体中文版 - 怎样使用表单 forms
description: Web.py Cookbook 简体中文版 - 怎样使用表单 forms
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题：

怎样使用表单 forms

## 解决：

'web.form'模块提供支持创建，校验和显示表单。该模块包含一个'Form'类和各种输入框类如'Textbox'，'Password'等等。

当'form.validates()'调用时，可以针对每个输入检测的哪个是有效的，并取得校验理由列表。

'Form'类同样可以使用完整输入附加的关键字参数'validators'来校验表单。

这里是一个新用户注册的表单的示例：

    import web
    from web import form

    render = web.template.render('templates') # your templates

    vpass = form.regexp(r".{3,20}$", 'must be between 3 and 20 characters')
    vemail = form.regexp(r".*@.*", "must be a valid email address")

    register_form = form.Form(
        form.Textbox("username", description="Username"),
        form.Textbox("email", vemail, description="E-Mail"),
        form.Password("password", vpass, description="Password"),
        form.Password("password2", description="Repeat password"),
        form.Button("submit", type="submit", description="Register"),
        validators = [
            form.Validator("Passwords did't match", lambda i: i.password == i.password2)]

    )

    class register:
        def GET(self):
            # do $:f.render() in the template
            f = register_form()
            return render.register(f)

        def POST(self):
            f = register_form()
            if not f.validates():
                return render.register(f)
            else:
                # do whatever is required for registration


然后注册的模板应该像是这样： 

    $def with(form)

    <h1>Register</h1>
    <form method="POST">
        $:form.render()
    </form>