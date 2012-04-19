---
layout: post
title: Web.py Cookbook 简体中文版 - 个别显示表单字段
description: Web.py Cookbook 简体中文版 - 个别显示表单字段
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题：

怎样在模板中个别显示表单字段？

## 解决：

你可以使用'render()'方法在你的模板中显示部分的表单字段。

假设你想创建一个名字/姓氏表单。很简单，只有两个字段，不需要验证，只是为了测试目的。

    from web import form
    simple_form = form.Form(
        form.Textbox('name', description='Name'),
        form.Textbox('surname', description='Surname'),
    )

通常你可以使用`simple_form.render（）`或`simple_form.render_css（）`。
但如你果你想一个一个的显示表单的字段，或者你怎样才能对模板中的表单显示拥有更多的控制权限？如果是这样，你可以对你的个别字段使用`render()`方法。

我们定义了两个字段名称为`name`和`surname`。这些名称将自动成为`simple_form`对象的属性。

    >>> simple_form.name.render()
    '<input type="text" name="name" id="name" />'
    >>> simple_form.surname.render()
    '<input type="text" name="surname" id="surname" />' 

你同样可以通过类似的方法显示个别的描述：

    >>> simple_form.surname.description
    'Surname'

如果你有一个小模板片段（局部模板），你想统一的使用你所定义的所有表单字段？你可以使用表单对象的`inputs`属性迭代每个字段。下面是一个示例：

    >>> for input in simple_form.inputs:
    ...     print input.description
    ...     print input.render()
    ... 
    Name
    <input type="text" name="name" id="name" />
    Surname
    <input type="text" name="surname" id="surname" />