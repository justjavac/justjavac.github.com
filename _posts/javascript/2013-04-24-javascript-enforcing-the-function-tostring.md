---
layout: post
title: javascript 中强制执行 toString()
keywords: javascript, toString
category : javascript
tags : [javascript]
uids: 2127182625
---

原文：[Enforcing toString()](http://www.2ality.com/2013/04/enforcing-tostring.html)

译文：[javascript 中强制执行 toString()](http://justjavac.com/javascript/2013/04/24/javascript-enforcing-the-function-tostring.html)

译者：[singleseeker](http://weibo.com/singleseeker)

----------------------------------------------------

Javascript通常会根据方法或运算符的需要而自动把值转成所需的类型，这可能导致各种错误。
Brian McKenna ([@puffnfresh][puffnfresh]) [suggests][] 提供了下列测试代码：

[puffnfresh]: https://twitter.com/puffnfresh
[suggests]: https://twitter.com/puffnfresh/status/316630924198572032

```javascript
Object.prototype.valueOf = function () {
	throw new Error('Use an explicit toString');
};
```

这些代码会产生什么效果？
你现在再也不能用加号运算符去把一个对像转成一个字符串了：

    > var obj = {};

    > 'Hello '+obj
    Error: Use an explicit toString

    > String(obj)
    '[object Object]'
    > obj.toString()
    '[object Object]'

    > 'Hello '+String(obj)
    'Hello [object Object]'
    
这个又是怎么回事呢？
要把一个对象转成一个特定的基本类型 T，首先是它的值被转化成基本类型，然后才是转换成 T，前一个转换由[两步完成][1]：    

1. 调用 `valueOf()` 方法，如果返回一个基本类型，那么就结束

2. 不然，调用方法 `toString()`。如果返回一个基本类型，那么结束

3. 再不然，抛出错误

如果最后的转换是个数值，会是上述调用 `valueOf()` 与 `toString()` 的这个顺序。

如果最后的转换是字符串，那么 `toString` 会被先调用。
加号运算符可能会被值转成数值型或是字符串型，但它通常[根据数字运算产生一个基本类型][2]。

不用在文章开始发的代码片段， `Object.prototype.valueOf()` 会返回这个对象本身，这个是从原生对象继续来的没有被重写的方法：

    > var obj = {};
    > obj.valueOf() === obj
    true
    
加号运算符最终会调用 `toString()`。
上面的代码片段阻止了调用，在能调用那个方法前抛出了错误。

注意这个错误信息并不总是完全正确。

    > Number(obj)
    Error: Use an explicit toString

但是这一招扔然是有用的。

如果一个对象真想被转化成数字，那么它无论如何还是要调用自己的 `valueOf` 方法。

[@singleseeker](http://weibo.com/singleseeker)罗嗦：这篇文章翻译起来真心是想更种吐槽，知识点总结的倒是不错，
不过做为一个不是英语为母语的老外写的英文技术文章交给我一个母语不是英语的菜鸟翻译，着实够折磨人。
下面进行简单的总结。

1. 通常 `valuOf()` 指示返回一个未转换的对象，也就是其本身

2. 加号运算符除了 `Date` 对象外，几乎全是先调用 `valueOf()` 方法

3. 如果使得 `valueOf()` 返回一个明确的基本数值类型，那么当一个对象与字符串相加时，`toString()` 将不会被调用

## 参考

1. [强制转换对象（objects）为原始值（primitives）][1]

2. [JavaScript中,{}+{}等于多少?][2]

[1]: http://justjavac.com/javascript/2013/04/22/javascript-coercing-objects-to-primitives.html "强制转换对象（objects）为原始值（primitives）"
[2]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html "JavaScript中,{}+{}等于多少?"
