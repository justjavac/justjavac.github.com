---
layout: post
title: Web.py Cookbook 简体中文版 - Testing with Paste and Nose
description: Web.py Cookbook 简体中文版 - Testing with Paste and Nose
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## Problem

You want to test your web.py application.

## Solution

    from paste.fixture import TestApp
    from nose.tools import *
    from code import app

    class TestCode():
        def test_index(self):
            middleware = []
            app = TestApp(app.wsgifunc(*middleware))
            r = app.get('/')
            assert_equal(r.status, 200)
            r.mustcontain('Hello, world!')

## Background

This example makes use of the Paste and Nose libraries. [Paste](http://pythonpaste.org/) lets you throw test requests at your application, and adds some helpful [custom methods to the response objects](http://pythonpaste.org/webtest/#the-response-object), such as mustcontain(), seen above. [Nose](http://somethingaboutorange.com/mrl/projects/nose/) makes writing and running your tests dead simple. When run from the base of your tree, it automatically finds and runs anything which is named like a test, adding necessary modules to your PYTHONPATH. This gives you the flexibility to run your tests from other directories, as well. Another benefit of Nose is that you no longer need to have every test class inherit from unittest.TestCase. Many more details are outlined on the project page.

## Explanation

This code resides in a file called test_code.py. The directory layout of the application looks like this:

    ./
    code.py
    ./test
        test_code.py        

Most of the code example above should be fairly self-explanatory. From our main module, code, we import app, which is defined in the usual way:

    app = web.application(urls, globals())

To set up the test, we pass its wsgifunc() to Paste's TestApp, as you have already seen in the example.

    app = TestApp(app.wsgifunc(*middleware))

assert_equal() is one of the methods provided by nose's utils, and works just like unittest's assertEqual().

## Setting Up the Test Environment

In order to avoid kicking off web.py's webserver when we run our tests, a change is required to the line which calls run(). It normally looks something like this:

    if __name__ == "__main__": app.run()

We can define an environment variable, such as WEBPY_ENV=test, when we run our tests. In that case, the above line becomes the following:

    import os

    def is_test():
        if 'WEBPY_ENV' in os.environ:
            return os.environ['WEBPY_ENV'] == 'test'

    if (not is_test()) and __name__ == "__main__": app.run()

Then, it's simply a matter of running nosetests like so:

    WEBPY_ENV=test nosetests

The is_test() function comes in handy for other things, such as doing conditional database commits to avoid test database pollution.