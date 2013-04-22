---
layout: post
title: 强制转换对象（objects）为原始值（primitives）
keywords: javascript, object, primitive
category : javascript
tags : [javascript]
---

原文：[Coercing objects to primitives](http://www.2ality.com/2012/11/coercing-objects.html)

译文：[强制转换对象（objects）为原始值（primitives）](http://justjavac.com/javascript/2013/04/22/javascript-coercing-objects-to-primitives.html)

译者：[何欢 love HuangFeng]

----------------------------------------------------

本博文讨论的是 JavaScript 如何强制转换对象 objects 为 primitives。 
如果你不明白原始值（primitive values）和 objects 之间的区别, 
建议在 Adobe 开发者版块阅读我的文章 “[JavaScript:如何判断值的类型][]”（感谢紫云飞翻译的中文版[JavaScript:如何判断值的类型](http://www.cnblogs.com/ziyunfei/archive/2012/10/11/2717057.html)） 。 
本文章由 [关注推特][] David Bruant 启发:

[JavaScript:如何判断值的类型]: http://www.adobe.com/devnet/html5/articles/categorizing-values-in-javascript.html
[关注推特]: https://twitter.com/DavidBruant/status/273451064764805120

	!!(new Boolean(false)) #wtfjs

以上表达式的结果是 `true`. 
我们先来认识一下 JavaScript 中的强制转换，
接着我们就能用这个知识来理解以上的结果了。

## 1. 强制转换

许多 JavaScript 里的操作符和函数都要求其参数为特定的类型。
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

### 1.1 强制转换为 number

有两种常见的方法可以将一个值强制转换为 number: + 单目操作符以及作为函数的 Number（而不是作为构造函数）.

    > +obj
    valueOf
    0
    > Number(obj)
    valueOf
    0

两种方法都像预期那样工作：它们都用了 number 算法. 
结果由 `valueOf()` 所返回的结果被转成了 number.

### 1.2 强制转换为 string

有两种常见的方法可以将一个值强制转换为 string： 
二元 `+` 操作符，其中一个是 string 类型，以及作为函数的 `String`（而不是作为构造函数）.

    > ''+obj
    valueOf
    '0'
    > String(obj)
    toString
    '1'

二元 `+` 操作符使用了 default 算法，因为 1 跟 numbers 和 strings 都能进行累加操作.

### 1.3 强制转换为 boolean

有两种方法可以将一个值强制转换为 boolean：
使用两次二元逻辑反操作符（先一次转成 boolean，然后取反） 或使用作为函数的 `Boolean` .

    > !!obj
    true
    > Boolean(obj)
    true

现在我们看到，对象从未被转成原始值。
规则很简单: 任何对象永远是 `true`. 
对于原始值（primitives）来讲，只有以下值才会被转成 `false`，其他所有值都会被转成 `true`.

* undefined
* null
* false
* +0, -0, NaN
* ""

## 2. 了解初始的结果

现在，很明显就能预料为什么 `!!(new Boolean(false))` 的值为 `true`: 
任何 `Boolean` 的实例永远都是一个对象，因此他们总是被转换成 `true`.

## 3. 推荐的方法

现在我们推荐一些强制转换对象的方法:

*	远离 `Boolean`, `Number` 和 `String` 的实例。
	JavaScript里通常你不需要或者不会遇到它们。

*	然而，我喜欢把 `Boolean`, `Number` 和 `String` 用作函数来强制转换值。 
	这样使用的话，表述性就非常好。

*	很明显，以上所有强制转成原始值的方法适用于任何值，而非仅仅对象:

	    > Number("123")
	    123
	    > Boolean(0)
	    false
	    > String(true)
	    'true'

*	1 并不总是会强制将对象转成原始值（primitives）。 
	不过这样做通常受益良多。[WTFs][1] 和 [hacks][2].

## 4. 进深阅读

1. [JavaScript中,{}+{}等于多少?][1] [Describes the binary plus operator and the conversion to number and string in detail]

2. [Fake operator overloading in JavaScript][2] [a fun hack involving objects being coerced to numbers]

3. [JavaScript’s two zeros][3]

[1]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html
[2]: http://www.2ality.com/2011/12/fake-operator-overloading.html
[3]: http://www.2ality.com/2012/03/signedzero.html
