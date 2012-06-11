---
layout: post
title: web.py 0.3 新手指南 - 实时语言切换
description: web.py 0.3 新手指南 - 实时语言切换
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---
---
layout: default
title: 实时语言切换
---

# 实时语言切换

## 问题:
如何实现实时语言切换？

## 解法:

 * 首先你必须阅读 [模板语言中的i18n支持](http://justjavac.com/python/2012/04/19/webpy-cookbook-i18n-support-in-template-file.html), 然后尝试下面的代码。

文件: code.py

    import os
    import sys
    import gettext
    import web
    
    # File location directory.
    rootdir = os.path.abspath(os.path.dirname(__file__))
    
    # i18n directory.
    localedir = rootdir + '/i18n'
    
    # Object used to store all translations.
    allTranslations = web.storage()
    
    def get_translations(lang='en_US'):
        # Init translation.
        if allTranslations.has_key(lang):
            translation = allTranslations[lang]
        elif lang is None:
            translation = gettext.NullTranslations()
        else:
            try:
                translation = gettext.translation(
                        'messages',
                        localedir,
                        languages=[lang],
                        )
            except IOError:
                translation = gettext.NullTranslations()
        return translation
    
    def load_translations(lang):
        """Return the translations for the locale."""
        lang = str(lang)
        translation  = allTranslations.get(lang)
        if translation is None:
            translation = get_translations(lang)
            allTranslations[lang] = translation
    
            # Delete unused translations.
            for lk in allTranslations.keys():
                if lk != lang:
                    del allTranslations[lk]
        return translation
    
    def custom_gettext(string):
        """Translate a given string to the language of the application."""
        translation = load_translations(session.get('lang'))
        if translation is None:
            return unicode(string)
        return translation.ugettext(string)
    
    urls = (
    '/', 'index'
    )
    
    render = web.template.render('templates/',
            globals={
                '_': custom_gettext,
                }
            )
    
    app = web.application(urls, globals())
    
    # Init session.
    session = web.session.Session(app,
            web.session.DiskStore('sessions'),
            initializer={
                'lang': 'en_US',
                }
            )
    
    class index:
        def GET(self):
            i = web.input()
            lang = i.get('lang', 'en_US')

            # Debug.
            print >> sys.stderr, 'Language:', lang

            session['lang'] = lang
            return render.index()
    
    if __name__ == "__main__": app.run()


模板文件: templates/index.html.

    $_('Hello')

不要忘记生成必要的po&mo语言文件。参考: [模板语言中的i18n支持](http://justjavac.com/python/2012/04/19/webpy-cookbook-i18n-support-in-template-file.html)

现在运行code.py:

    $ python code.py
    http://0.0.0.0:8080/

然后用你喜欢的浏览器访问下面的地址，检查语言是否改变:

    http://your_server:8080/
    http://your_server:8080/?lang=en_US
    http://your_server:8080/?lang=zh_CN

你必须:

 * 确保语言文件(en_US、zh_CN等)可以动态改变。
 * 确保custom_gettext()调用越省资源约好。

参考:

 * 这里有使用app.app_processor()的 [另一个方案](http://groups.google.com/group/webpy/browse_thread/thread/a215837aa30e8f80 )。