---
layout: post
title: 强制对象（objects）为原始值（primitives）
keywords: javascript, object, primitive
category : javascript
tags : [javascript]
---

原文：[强制转换对象（objects）为原始值（primitives）](http://www.2ality.com/2012/11/coercing-objects.html)

译文：[]()

译者：[何欢爱HuangFeng]()

----------------------------------------------------

本博文讨论的是JavaScript如何强制转换对象 objects 为 primitives。 
如果你不明白原始值（primitive values）和 objects 之间的区别, 
建议在Adobe开发者版块阅读我的文章 “[JavaScript:如何判断值的类型][]”（感谢紫云飞翻译的中文版[JavaScript:如何判断值的类型](http://www.cnblogs.com/ziyunfei/archive/2012/10/11/2717057.html)） 。 
本文章由 [关注推特][] David Bruant 启发:

[JavaScript:如何判断值的类型]: http://www.adobe.com/devnet/html5/articles/categorizing-values-in-javascript.html
[关注推特]: https://twitter.com/DavidBruant/status/273451064764805120

	!!(new Boolean(false)) #wtfjs

以上表达式的结果是 `true`. 
我们先来认识一下 JavaScript 中的强制转换，
接着我们就能用这个知识来理解以上的结果了。

## 1. 强制转换

许多JavaScript里的操作符和函数都要求其参数为特定的类型。
如果不符合预期的类型，它们就会被强制（转换）成其他的类型。
强制将一个对象转换为一个原始值类型仅需两步: 首先，该对象被转为一个原始值。
然后，如果必要的话，该原始值会被转成正确的类型。 
要将对象（object）转换为原始值（primitive）用到两种方法：

1. `valueOf()`
2. `toString()`

有三种转换算法：

1. “Number”: 你期待该值是一个数字
2. “String”: 你期待该值是一个字符串
3. “Default”: 你对该值没有任何期待

number 算法首先会调用 `valueOf()` ，如果返回值是一个原始值（primitive） 就使用它。 
要不然，它会调用 `toString()` ，如果返回值是一个原始值（primitive） 就使用它。  
如若不然，则抛出异常。 
string 算法则以相反的顺序会调用这些函数。
default 算法用于非日期型的 “number” 和日期型的 “string”

我们可以用下面这个对象来实验一下强制转换:

    var obj = {
        valueOf: function () {
            console.log("valueOf");
            return '0';
        },
        toString: function () {
            console.log("toString");
            return 1;
        }
    };

### 1.1 强制转换为number

有两种常见的方法来 coercing to number: the unary plus operator and Number, used as a function (not as a constructor).

    > +obj
    valueOf
    0
    > Number(obj)
    valueOf
    0

In both cases, things work as expected: the number algorithm is used. 
Then the result returned by `valueOf()` is converted to number.

## 1.2 Coercing to string

Two common ways of coercing a value to string are: 
the binary plus operator where one operand is a string and `String`, 
used as a function (not as a constructor).

    > ''+obj
    valueOf
    '0'
    > String(obj)
    toString
    '1'

The binary plus operator uses the default algorithm, because one can add either numbers or strings.

## 1.3 Coercing to boolean

Two ways of coercing to boolean are: 
using the unary negation operator twice (once converts to boolean and negates) or using `Boolean` as a function.

    > !!obj
    true
    > Boolean(obj)
    true

Here we see that objects are never converted to primitive. 
The rule is simply: any object is always `true`. 
For primitives, only the following values are coerced to `false`, all other values are coerced to `true`.

* undefined
* null
* false
* +0, -0, NaN
* ""

## 2. Understanding the initial result

Now it should be obvious why `!!(new Boolean(false))` evaluates to `true`: 
Any instance of `Boolean` is always an object and those are always coerced to `true`.

## Recommendations

Here are a few recommendations for coercion and objects:

*	Stay away from instances of `Boolean`, `Number` and `String`. 
	You don’t normally need or encounter them in JavaScript.

*	However, I do like using `Boolean`, `Number` and `String` as functions, to coerce values. 
	They are nicely descriptive when used in this manner.

*	Obviously, all of the above ways of coercing to primitives work for any value, not just for objects:

	    > Number("123")
	    123
	    > Boolean(0)
	    false
	    > String(true)
	    'true'

*	One does not often coerce objects to primitives. 
	Doing so is, however, good for many [WTFs][1] and [hacks][2].

## 4. Further reading

1. [JavaScript中,{}+{}等于多少?][1] [Describes the binary plus operator and the conversion to number and string in detail]

2. [Fake operator overloading in JavaScript][2] [a fun hack involving objects being coerced to numbers]

3. [JavaScript’s two zeros][3]

[1]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html
[2]: http://www.2ality.com/2011/12/fake-operator-overloading.html
[3]: http://www.2ality.com/2012/03/signedzero.html
