---
layout: post
title: JavaScript 的怪癖 3：JavaScript quirk 3: normal equality (==)
keywords: javascript, quirks, equality
category : javascript
tags : [javascript, quirks]
---

原文：[JavaScript quirk 3: normal equality (==)](http://www.2ality.com/2013/04/quirk-undefined.html)

译文：[JavaScript quirk 3: normal equality (==)](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html)

译者：[未翻译](iranw翻译中)

----------------------------------------------------

此文是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第三篇。

Let’s start with a simple rule: 
the normal equality operators `==` and `!=` are so problematic that you should always use strict equality (`===` and `!==`). 
Some people say that there are exceptions to this rule, I disagree [2][]. 
Keeping this rule in mind, we can now take a look at what is strange about `==` without burdening our minds unnecessarily.

The “normal” equality operator (`==`) has many quirks. 
While it is forgiving, it does not adhere to the typical rules of truthy and falsy (see [quirk 1][]):

[quirk 1]: http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html "JavaScript 的怪癖 1：隐式类型转换"

    > 0 == false  // OK
    true
    > 1 == true  // OK
    true
    > 2 == true  // not OK
    false

    > '' == false  // OK
    true
    > '1' == true  // OK
    true
    > '2' == true  // not OK
    false

Apart from that, it lets you compare values that aren’t really comparable:

    > '' == 0
    true
    > '\n  123  \t' == 123
    true

The last check is true because conversion to number ignores leading and trailing whitespace in JavaScript.
If you are still interested in finding out how exactly `==` works, you can read up on it here: [1][]. 
With strict equality (`===`), values of different types are never equal [1][], which means that all of the above problems go away.

## References:

1. [Equality in JavaScript: === versus ==][1]

2. [When is it OK to use == in JavaScript?][2]

[1]: http://www.2ality.com/2011/06/javascript-equality.html
[2]: http://www.2ality.com/2011/12/strict-equality-exemptions.html
