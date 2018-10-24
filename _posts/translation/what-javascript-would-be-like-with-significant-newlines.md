---
layout: post
title: JavaScript 中的显式换行
description: javascript 中的显式换行
keywords: javascript,newlines
category : javascript
tags : [javascript]
---

原文：[What JavaScript would be like with significant newlines](http://www.2ality.com/2011/11/significant-newlines.html)

译文：[JavaScript 中的显式换行](https://justjavac.com/javascript/2012/12/24/what-javascript-would-be-like-with-significant-newlines.html)

译者：[未翻译]()

----------------------------------------------------

Brendan Eich recently repeated that he regrets not having given JavaScript significant newlines. 
This post explains what that would be like. 

[Quote][]：

[Quote]: https://gist.github.com/1332193#gistcomment-60988

> ... my only regret with [ASI](http://www.2ality.com/2011/05/semicolon-insertion.html) [automatic semicolon insertion, making them optional] was that I didn't use significant newlines throughout the grammar, but without requiring \ continuations for expressions spanning multiple lines where an operator ends the non-final lines.

## Current approach to optional semicolons

Approach, roughly:  "Continue as long as things are legal." 

Example:

    "abc"
    .length

This is interpreted as:

    "abc".length

The following are examples where you would expect a semicolon to be inserted, but it isn't.

Example 1:

    a = b + c
    (d + e).print()

One of the intermediate evaluation steps is the function call `c(d + e)`

Example 2:

    var foo = "bar"
    [ "red", "green" ].foreach(function(c) { console.log(c) })

Evaluates, among other things, the expression `"bar"[ "red", "green"]`. 
The expression inside the square brackets is the binary [comma operator](https://developer.mozilla.org/en/JavaScript/Reference/Operators/Comma_Operator) applied to the operands `"red"` and `"green"`. 
That operator evaluates both operands and returns the value of the second one. 
Hence, the original expression is equivalent to `"bar"["green"]` – the value of the property `green` of the string `"bar"`.

Example 3:

    a = b
    /hi/g.exec(c).map(d)

The above is interpreted as:

    a = b / hi / g.exec(c).map(d);

## Significant newlines

Approach, roughly: "Continue if encouraged to at the end of the line."

You would still delimit blocks with curly braces (as opposed to indentation being significant, like in Python or Haskell). 
But the default for a newline would be to terminate a statement. 
You may continue in the following line if there is a trailing (binary) operator (which includes dot and comma) or if there are unclosed parentheses, square brackets or curly braces.

    return a +
    b
    
    return (a
    + b)
    
    obj.foo(arg1,
    arg2)

The net result is that optional semicolons are safer and more intuitive. 
If you want to put multiple statements in a single line, you obviously still need them:

    obj.m1(); obj.m2()

**Significant newlines in current JavaScript**. 
Some statements such as `return` already have significant newlines: If you add a newline after the `return` keyword, 
it terminates the statement. 

Example:

    return
    { first: "Jane" }
    
    // interpreted as
    return;
    { first: "Jane" }

The second of the two lines is interpreted as a block with the expression statement `"Jane"`, prefixed by the label `first`.

## Related reading

1. [JavaScript 中的ASI（自动分号插入）]() （翻译中）
