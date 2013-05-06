---
layout: post  
title: JavaScript 的怪癖 4：unknown variable names create global variables  
keywords: javascript, quirks, global 
category : javascript  
tags : [javascript, quirks]
---

原文：[JavaScript quirk 4: unknown variable names create global variables](http://www.2ality.com/2013/04/quirk-automatic-globals.html)

译文：[JavaScript 的怪癖 4：unknown variable names create global variables](https://github.com/justjavac/justjavac.github.com/blob/master/_posts/translation/12-javascript-quirk-4-unknown-variable-names-create-global-variables.md)

译者：[未翻译]()

----------------------------------------------------

此文是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第四篇。

Normally, JavaScript automatically creates a global variable if you use an unknown variable name:

    > function f() { foo = 123 }
    > f()
    > foo
    123

Thankfully, you get a warning in ECMAScript 5 strict mode [\[1\]][1]:

    > function f() { 'use strict'; foo = 123 }
    > f()
    ReferenceError: foo is not defined

## Reference:

1. [JavaScript’s strict mode: a summary][1]

[1]: http://www.2ality.com/2011/01/javascripts-strict-mode-summary.html "JavaScript’s strict mode: a summary"
