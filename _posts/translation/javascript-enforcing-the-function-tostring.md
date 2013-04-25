---
layout: post
title: javascript 中强制执行 toString()
keywords: javascript, toString
category : javascript
tags : [javascript]
---

原文：[Enforcing toString()](http://www.2ality.com/2013/04/enforcing-tostring.html)

译文：[javascript 中强制执行 toString()]()

译者：[singleseeker](http://weibo.com/singleseeker)

----------------------------------------------------

Javascript通常会根据方法或运算符的需要而自动把值转成所需的类型，这可能导致各种错误。Brian McKenna ([@puffnfresh][puffnfresh]) [suggests][] 提供了下列测试代码：

JavaScript usually automatically converts values to the type that a method or operator needs, which can lead to a variety of bugs. 
As a counter-measure, Brian McKenna ([@puffnfresh][puffnfresh]) [suggests][] using the following code for your tests:

[puffnfresh]: https://twitter.com/puffnfresh
[suggests]: https://twitter.com/puffnfresh/status/316630924198572032

    Object.prototype.valueOf = function () {
        throw new Error('Use an explicit toString');
    };

这些代码会产生什么效果？你现在再也不能用加号运算符去把一个对像转成一个字符串了：

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
    
这个又是怎么回事呢？要把一个对象转成一个特定的基本类型T，首先是它的值被转化成基本类型，然后才是转换成T，前一个转换由两步完成：    

How does this work? To convert an object to a specific primitive type T, 
it is first converted to any primitive value which is then converted to T. 
The former conversion happens in [two steps][1]:

1. 调用“valueOf()”方法，如果返回一个基本类型，那么就结束
2. 不然，调用方法“toString()”。如果返回一个基本类型，那么结束。
3. 再不然，抛出错误。

1. Call method `valueOf()`. If it returns a primitive, we are done.

2. Otherwise, call method `toString()`. If it returns a primitive, we are done.

3. Otherwise, throw an error.

如果最后的转换是个数值，会是上述调用“valueOf()”与"toString"的这个顺序。

The above order of first invoking `valueOf()` and then `toString()` is chosen if the final conversion is to a number. 

如果最后的转换是字符串，那么“toString”会被先调用。加号运算符可能会被值转成数值型或是字符串型，但它通常根据数字运算产生一个基本类型。

If the final conversion is to string then `toString()` is invoked first. 
The plus operator converts to either number or string, but it [produces a first primitive via the “number” algorithm][2].

不用在文章开始发的代码片段，“Object.prototype.valueOf()”会返回这个对象本身，这个是从原生对象继续来的没有被重写的方法。

Without the code snippet at the beginning of this post, `Object.prototype.valueOf()` returns this (an object) and is inherited by all objects that don’t override this method:

    > var obj = {};
    > obj.valueOf() === obj
    true
    
加号运算符最终会调用“toString()”。上面的code阻止了调用，在能调用那个方法前抛出了错误。

The plus operator therefore eventually calls `toString()`. 
The code snippet prevents that and throws an error before the operator can get to that method. 


注意这个错误信息并不总是完全正确。

Note that the error message is not always completely correct:

    > Number(obj)
    Error: Use an explicit toString

但是这一招扔然是有用的。

But this trick can still be useful. 

如果一个对象真想被转化成数字，那么它无论如何还是要调用自己的“valueOf”方法。

If an object really wants to be converted to a number then it will bring its own `valueOf()`, anyway.

[@singleseeker](http://weibo.com/singleseeker)罗嗦：这篇文章翻译起来真心是想更种吐槽，知识点总结的倒是不错，不过做为一个不是英语为母语的老外写的英文技术文章交给我一个母语不是英语的菜鸟翻译，着实够折磨人。下面进行简单的总结。

1. 通常"valuOf()"指示返回一个未转换的对象，也就是其本身
2. 加号运算符除了"Date"对象外，几乎全是先调用"valueof()"方法
3. 如果使得"valueof()"返回一个明确的基本数值类型，那么当一个对象与字符串相加时，"toString()"将不会被调用。

## References

1. [强制转换对象（objects）为原始值（primitives）][1]

2. [JavaScript中,{}+{}等于多少?][2]

[1]: http://justjavac.com/javascript/2013/04/22/javascript-coercing-objects-to-primitives.html "强制转换对象（objects）为原始值（primitives）"
[2]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html "JavaScript中,{}+{}等于多少?"
