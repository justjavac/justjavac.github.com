---
layout: post
title: Enforcing toString()
keywords: javascript, toString
category : javascript
tags : [javascript]
---

原文：[Enforcing toString()](http://www.2ality.com/2013/04/enforcing-tostring.html)

译文：[javascript 中强制执行 toString()]()

译者：[未翻译]()

----------------------------------------------------

JavaScript usually automatically converts values to the type that a method or operator needs, which can lead to a variety of bugs. 
As a counter-measure, Brian McKenna ([@puffnfresh][puffnfresh]) [suggests][] using the following code for your tests:

[puffnfresh]: https://twitter.com/puffnfresh
[suggests]: https://twitter.com/puffnfresh/status/316630924198572032

    Object.prototype.valueOf = function () {
        throw new Error('Use an explicit toString');
    };

What is the effect of this code? You now can’t use the plus operator to convert an object to string, any more:

    > var obj = {};

    > 'Hello '+obj
    Error: Use an explicit toString

    > String(obj)
    '[object Object]'
    > obj.toString()
    '[object Object]'

    > 'Hello '+String(obj)
    'Hello [object Object]'

How does this work? To convert an object to a specific primitive type T, 
it is first converted to any primitive value which is then converted to T. 
The former conversion happens in [two steps][1]:

1. Call method `valueOf()`. If it returns a primitive, we are done.

2. Otherwise, call method `toString()`. If it returns a primitive, we are done.

3. Otherwise, throw an error.

The above order of first invoking `valueOf()` and then `toString()` is chosen if the final conversion is to a number. 
If the final conversion is to string then `toString()` is invoked first. 
The plus operator converts to either number or string, but it [produces a first primitive via the “number” algorithm][2].

Without the code snippet at the beginning of this post, `Object.prototype.valueOf()` returns this (an object) and is inherited by all objects that don’t override this method:

    > var obj = {};
    > obj.valueOf() === obj
    true

The plus operator therefore eventually calls `toString()`. 
The code snippet prevents that and throws an error before the operator can get to that method. 
Note that the error message is not always completely correct:

    > Number(obj)
    Error: Use an explicit toString

But this trick can still be useful. 
If an object really wants to be converted to a number then it will bring its own `valueOf()`, anyway.

## References

1. [Coercing objects to primitives][1]

2. [JavaScript中,{}+{}等于多少?][2]

[1]: http://www.2ality.com/2012/11/coercing-objects.html
[2]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html "JavaScript中,{}+{}等于多少?"