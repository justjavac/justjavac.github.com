---
layout: post
title: 「译」JavaScript 的怪癖 1：两个「空值」：undefined 和 null
keywords: javascript, quirks, undefined, null
category : javascript
tags : [javascript, quirks]
---

原文：[JavaScript quirk 2: two “non-values” – undefined and null](http://www.2ality.com/2013/04/quirk-undefined.html)

译文：[「译」JavaScript 的怪癖 2：两个「空值」：undefined 和 null]()

译者：

----------------------------------------------------

[This post is part of a series on [JavaScript quirks](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html).]

Most programming languages have only one value for “no value” or “empty reference”. 
For example, that value is null in Java. 
JavaScript has two of those special values: `undefined` and `null`. 
They are basically the same (something that will change with ECMAScript 6, as will be explained in the last post of this series), 
but they are used slightly differently.

undefined is assigned via the language itself. 
Variables that have not been initialized yet have this value:

    > var foo;
    > foo
    undefined

Similarly, JavaScript assigns undefined to missing parameters:

    > function id(x) { return x }
    > id()
    undefined

`null` is used by programmers to explicitly indicate that a value is missing. 
E.g. for [JSON.stringify()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify):

    > console.log(JSON.stringify({ first: 'Jane' }, null, 4))
    {
        "first": "Jane"
    }

Check: does a variable have a value?

If you want to know whether a variable v has a value, you normally have to check for both undefined and null. 
Fortunately, both values are [falsy](http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html). 
Thus, checking for truthiness via if performs both checks at the same time:

    if (v) {
        // v has a value
    } else {
        // v does not have a value
    }

You’ll see more examples of the above check in the post for quirk 5 about parameter handling. 
There is one caveat: this check also interprets `false`, `-0`, `+0`, `NaN` and `''` as “no value”. 
If that isn’t what you want then you can’t use it. You have two choices.

Some people advocate lenient non-equality (!=) to check that v is neither `undefined` nor `null`:

    if (v != null) {
        // v has a value
    } else {
        // v does not have a value
    }

However, that requires you to know that != considers `null` to be only equal to itself and to `undefined`. 
I prefer the more descriptive use of !==:

    if (v !== undefined && v !== null) {
        // v has a value
    } else {
        // v does not have a value
    }

[Performance-wise](http://jsperf.com/definedness), all three checks shown in this section are more or less the same. 
Hence, which one you will end up using depends on your needs and your taste. 
Some minification tools even rewrite the last check to a check via !=.