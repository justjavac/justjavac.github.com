---
layout: post
title: Web.py Cookbook 简体中文版 - Import functions into templates
description: Web.py Cookbook 简体中文版 - Import functions into templates
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

`Problem`: How can I import a python module in template?

`Solution`:

While you write templates, inevitably you will need to write some functions which is related to display logic only.  web.py gives you the flexibility to write large blocks of code, including defining functions, directly in the template using `$code` blocks (if you don't know what is $code block, please read the [tutorial for Templator](http://justjavac.com/python/2012/04/19/webpy-tutorial-templetor) first).  For example, the following code block will translate a status code from database to a human readable status message:

    def status(c):
        st = {}
        st[0] = 'Not Started'
        st[1] = 'In Progress'
        st[2] = 'Finished'
        return st[c]

As you do more web.py development, you will write more such functions here and there in your templates. This makes the template messy and is a violation of the DRY (Don't Repeat Yourself) principle.

Naturally, you will want to write a module, say _displayLogic.py_ and import that module into every templates that needs such functionalities.  Unfortunately, `import` is disabled in template for security reason.  However, it is easy to solve this problem, you can import any function via the global namespace into the template:

    #in your application.py:
    def status(c):
        st = {}
        st[0] = 'Not Started'
        st[1] = 'In Progress'
        st[2] = 'Finished'
        return st[c]

    render = web.template.render('templates', globals={'stat':status})

    #in the template:
    $def with(status)
    ... ...
    <div>Status: $stat(status)</div>

Remember that you can import more than one name into the _globals_ dict. This trick is also used in [importing session variable into template](session_in_template.zh-cn).