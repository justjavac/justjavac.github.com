---
layout: post  
title: JavaScript quirk 5: parameter handling  
keywords: javascript, quirks, parameter 
category : javascript  
tags : [javascript, quirks]
---

原文：[JavaScript quirk 5: parameter handling](http://www.2ality.com/2013/04/quirk-automatic-globals.html)

译文：[JavaScript 的怪癖 5：parameter handling](https://github.com/justjavac/justjavac.github.com/blob/master/_posts/translation/12-javascript-quirk-5-parameter-handling.md)

译者：[未翻译]()

----------------------------------------------------

此文是 [javascript 的 12 个怪癖（quirks）](https://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第五篇。

The basics of parameter handling in JavaScript are simple, advanced tasks require manual work. 
This blog post first looks at the basics and then covers advanced topics.

## 一、The basics of parameter handling

Two facts form the core of JavaScript parameter handling.

### 1.1 Fact: you can always pass an arbitrary amount of parameters

When calling a function, you can pass as many or as few actual parameters as you want, 
independently of how many formal parameters are mentioned in the function declaration. 
Parameters that are missing have the value `undefined`. 
Parameters that are too many are ignored. 
Let’s use the following function for a demonstration:

    function f(x, y) {
        console.log('x: '+x);
        console.log('y: '+y);
    }

You can call this function with arbitrary many parameters:

    > f()
    x: undefined
    y: undefined

    > f('a')
    x: a
    y: undefined

    > f('a', 'b')
    x: a
    y: b

    > f('a', 'b', 'c')
    x: a
    y: b

### 1.2 Fact: all passed parameters are stored in arguments

All passed parameters are stored in the special, “Array-like” (see below for what that means) variable arguments. 
The following function lets us examine how that variable works.

    function g() {
        console.log('Length: '+arguments.length);
        console.log('Elements: '+fromArray(arguments));
    }

Function fromArray is shown below, it converts arguments to an array so that it can be logged. 
Using `g()`:

    > g()
    Length: 0
    Elements: 
    > g('a')
    Length: 1
    Elements: a
    > g('a', 'b')
    Length: 2
    Elements: a,b

arguments is always there, no matter how many parameters have been explicitly declared. 
It always contains all actual parameters.

## 二、Has a parameter been passed?

If a caller does not provide a parameter, `undefined` is passed to the function. Because `undefined` is falsy [\[1\]][1], 
you can use an `if` statement to check whether the parameter “exists” or not:

    function hasParameter(param) {
        if (param) {
            return 'yes';
        } else {
            return 'no';
        }
    }

Thus, you get the same result if you omit a parameter and if you pass `undefined`:

    > hasParameter()
    'no'
    > hasParameter(undefined)
    'no'

The test works also well for truthy values:

    > hasParameter([ 'a', 'b' ])
    'yes'
    > hasParameter({ name: 'Jane' })
    'yes'
    > hasParameter('Hello')
    'yes'

With falsy values, however, you have to be careful. 
For example, `false`, zero and the empty string are interpreted as missing parameters:

    > hasParameter(false)
    'no'
    > hasParameter(0)
    'no'
    > hasParameter('')
    'no'

Still, this pattern has proven itself. You do have to be vigilant, 
but the code becomes pleasantly compact and it does not matter whether callers omit a parameter, 
pass `undefined` or pass `null`.

## 三、Default values for parameters

The following function should accept zero or more parameters. 
Parameters `x` and `y` should have the value `0` if they are missing. 
A simple way of doing that is:

    function add(x, y) {
        if (!x) x = 0;
        if (!y) y = 0;
        return x + y;
    }

Interaction:

    > add()
    0
    > add(5)
    5
    > add(2, 7)
    9

You can write `add()` more compactly by using the “or” operator (`||`). 
This operator returns the first operand if it is truthy and otherwise the second operand. 

Examples:

    > 'abc' || 'def'
    'abc'
    > '' || 'def'
    'def'
    > undefined || { foo: 123 }
    { foo: 123 }
    > { foo: 123 } || 'def'
    { foo: 123 }

Let’s use `||` to assign parameter default values:

    function add(x, y) {
        x = x || 0;
        y = y || 0;
        return x + y;
    }

## 四、An arbitrary number of parameters

You can also use arguments to accept an arbitrary number of parameters. 
One example is the following function `format()` that is modeled after the classic C function sprintf:

    > format('Hello %s! You have %s new message(s).', 'Jane', 5)
    'Hello Jane! You have 5 new message(s).'

The first argument is a pattern in which '%s' marks blanks. 
The following arguments are filled into those blanks. 
A simple implementation of format looks like this:

    function format(pattern) {
        for(var i=1; i < arguments.length; i++) {
            pattern = pattern.replace('%s', arguments[i]);
        }
        return pattern;
    }

Note: the loop skips the first parameter (`arguments[0]`) and thus ignores pattern.

## 五、Enforcing a certain number of parameters

If you want to force a caller to provide a certain number of parameters, you need to check `arguments.length`, at runtime:

    function add(x, y) {
        if (arguments.length > 2) {
            throw new Error('Need at most 2 parameters');
        }
        return x + y;
    }

## 六、arguments is not an array

arguments is not an array, it is only array-like: you can access the i-th parameter via `arguments[i]` and you can determine how many parameters there are via `arguments.length`. 
But you can’t use Array methods such as `forEach` and `indexOf`. 
Further details, along with solutions are discussed in [quirk 8]()（原作者还没有写，因此没有译文）. 
As a preview, the following function converts an array-like value to an array.

    function fromArray(arrayLikeValue) {
        return Array.prototype.slice.call(arrayLikeValue);
    }

## 七、Reference

1. [JavaScript quirk 1: implicit conversion of values][1en] （[中文][1zh]）

[1en]: http://www.2ality.com/2013/04/quirk-implicit-conversion.html "JavaScript quirk 1: implicit conversion of values"
[1zh]: https://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html "JavaScript 的怪癖 1：隐式类型转换"