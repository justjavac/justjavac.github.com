---
layout: post
title: JavaScript 的 typeof 的用途
description: JavaScript 中的 typeof 其实非常复杂，它可以用来做很多事情，但同时也有很多怪异的表现。本文列举出了它的多个用法，而且还指出了存在的问题以及解决办法。
keywords: javascript,typeof
category : javascript
tags : [javascript, typeof]
---

原文：[What is JavaScript’s typeof operator used for?](http://www.2ality.com/2012/01/typeof-use-cases.html)

译文：[JavaScript 的 typeof 的用途](http://justjavac.com/javascript/2012/12/23/what-is-javascripts-typeof-operator-used-for.html)

译者：[紫云飞](http://www.cnblogs.com/ziyunfei)

最近一直在翻译 <http://www.2ality.com> 的 JavaScript 文章，偶然发现 [紫云飞](http://www.cnblogs.com/ziyunfei) 已经翻译了不少，我也就不能再班门弄斧了，原始译文地址：<http://www.cnblogs.com/ziyunfei/archive/2012/09/21/2696374.html>，如无特殊说明，文中出现“译者注”的地方，均指紫云飞翻译过程中做的注释，凡是我添加注释的地方，都会在后面添加 @justjavac 以示区别。

----------------------------------------------------

JavaScript 中的 `typeof` 其实非常复杂，它可以用来做很多事情，但同时也有很多怪异的表现。
本文列举出了它的多个用法，而且还指出了存在的问题以及解决办法。

阅读本文的前提是，你现在应该已经知道**原始值**和**对象值**的区别了。

## 检查一个变量是否存在，是否有值

typeof在两种情况下会返回 "undefined":

1. 变量没有被声明

2. 变量的值是 `undefined`

例如:

    > typeof undeclaredVariable === "undefined"
    true
    
    > var declaredVariable;
    > typeof declaredVariable
    'undefined'

    > typeof undefined
    'undefined'

还有其他办法检测某个值是否是 `undefined`:

    > var value = undefined;
    > value === undefined
    true

但这种方法如果使用在一个未声明的变量上的时候，就会抛出异常，因为只有 `typeof` 才可以正常检测未声明的变量的同时还不报错：

    > undeclaredVariable === undefined
    ReferenceError: undeclaredVariable is not defined

注意：未初始化的变量，没有被传入参数的形参，不存在的属性，都不会出现上面的问题，因为它们总是可访问的，值总是 `undefined`：

    > var declaredVariable;
    > declaredVariable === undefined
    true

    > (function (x) { return x === undefined }())
    true

    > ({}).foo === undefined
    true

译者注：因此，如果想检测一个可能没有被声明的全局变量是否存在，也可以使用 `if(window.maybeUndeclaredVariable){}`。

问题：`typeof` 在完成这样的任务时显得很繁杂.

解决办法：这样的操作不是很常见，所以有人觉的没必要再找更好的解决办法了。
不过也许有人会提出一个专门的操作符：

    > defined undeclaredVariable
    false

    > var declaredVariable;
    > defined declaredVariable
    false

或者，也许有人还需要一个检测变量是否被声明的操作符：

    > declared undeclaredVariable
    false

    > var declaredVariable;
    > declared declaredVariable
    true

译者注：在 perl 里，上面的 `defined` 操作符相当于 `defined()`，上面的 `declared` 操作符相当于 `exists()`。

## 判断一个值不等于 undefined 也不等于 null

问题：如果你想检测一个值是否被定义过(值不是 `undefined` 也不是 `null`)，那么你就遇到了 `typeof` 最有名的一个怪异表现(被认为是一个 bug)：`typeof null` 返回了 "object"：

    > typeof null 
    'object'

译者注：这只能说是最初的 JavaScript 实现的 bug，而现在标准就是这样规范的。V8 曾经修正并实现过 `typeof null === "null"`，但最终证明不可行。<http://wiki.ecmascript.org/doku.php?id=harmony:typeof_null>。

（译注：typeof 在操作 null 时会返回 "object"，这是 JavaScript 语言本身的 bug。不幸的是，这个 bug 永远不可能被修复了，因为太多已有的代码已经依赖了这样的表现。但是 null 到底是不是 对象呢？stackoverflow 有关于这个问题的讨论：<http://stackoverflow.com/questions/801032/null-object-in-javascript/7968470#7968470>[@justjavac](http://weibo.com/justjavac)）

解决办法：不要使用 `typeof` 来做这项任务，用下面这样的函数来代替：

```javascript
function isDefined(x) {
	return x !== null && x !== undefined;
}
```

另一个可能性是引入一个 “默认值运算符”，在 myValue 未定义的情况下，下面的表达式会返回 defaultValue：

```javascript
myValue ?? defaultValue
```

上面的表达式等价于：
 
```javascript
(myValue !== undefined && myValue !== null) ? myValue : defaultValue
```

又或者：

```javascript
myValue ??= defaultValue
```

其实是下面这条语句的简化：

```javascript
myValue = myValue ?? defaultValue
```

当你访问一个嵌套的属性时，比如 bar，你或许会需要这个运算符的帮助：

```javascript
obj.foo.bar
```

如果 `obj` 或者 `obj.foo` 是未定义的，上面的表达式会抛出异常。
一个运算符 .?? 可以让上面的表达式在遍历一层一层的属性时，返回第一个遇到的值为 `undefined` 或 `null` 的属性：

```javascript
obj.??foo.??bar
```

上面的表达式等价于：

```javascript
(obj === undefined || obj === null) ? obj
	: (obj.foo === undefined || obj.foo === null) ? obj.foo
		: obj.foo.bar
```
  
## 区分对象值和原始值

下面的函数用来检测 x 是否是一个对象值：

```javascript
function isObject(x) {
	return (typeof x === "function"
			|| (typeof x === "object" && x !== null));
}
```

问题：上面的检测比较复杂，是因为 `typeof` 把函数和对象看成是不同的类型，而且 `typeof null` 返回 "object".

解决办法：下面的方法也经常用于检测对象值：

```javascript
function isObject2(x) {
	return x === Object(x);
}
```

警告：你也许认为这里可以使用 `instanceof Object` 来检测，但是 `instanceof` 是通过使用使用一个对象的原型来判断实例关系的，那么没有原型的对象怎么办呢：

    > var obj = Object.create(null);
    > Object.getPrototypeOf(obj)
    null

obj 确实是一个对象，但它不是任何值的实例:

    > typeof obj
    'object'
    > obj instanceof Object
    false

在实际中，你可能很少遇到这样的对象，但它的确存在，而且有它的用途。

译者注：`Object.prototype` 就是唯一的一个内置的，没有原型的对象。

    >Object.getPrototypeOf(Object.prototype)
    null
    >typeof Object.prototype
    'object'
    >Object.prototype instanceof Object 
    false

## 原始值的类型是什么?

`typeof` 是最好的用来查看某个原始值的类型的方式。

    > typeof "abc"
    'string'
    > typeof undefined
    'undefined'

问题：你必须知道 `typeof null` 的怪异表现。

    > typeof null  // 要小心!
    'object'

解决办法：下面的函数可以修复这个问题(只针对这个用例)。

```javascript
function getPrimitiveTypeName(x) {
	var typeName = typeof x;
	switch(typeName) {
		case "undefined":
		case "boolean":
		case "number":
		case "string":
			return typeName;
		case "object":
			if (x === null) {
				return "null";
			}
		default: // 前面的判断都没通过
			throw new TypeError("参数不是一个原始值: "+x);
	}
}
```

更好的解决办法：实现一个函数 `getTypeName()`，除了可以返回原始值的的类型，还可以返回对象值的内部 [[Class]] 属性。
这里讲了如何实现这个函数(译者注：jQuery 中的 `$.type` 就是这样的实现)

## 某个值是否是函数

typeof 可以用来检测一个值是否是函数。

    > typeof function () {}
    'function'
    > typeof Object.prototype.toString
    'function'

原则上说，`instanceof Function` 也可以进行这种需求的检测。
乍一看，貌似写法还更加优雅。
但是，浏览器有一个怪癖：每一个框架和窗口都有它自己的全局变量。
因此，如果你将某个框架中的对象传到另一个框架中，`instanceof` 就不能正常工作了，因为这两个框架有着不同的构造函数。
这就是为什么 ECMAScript5 中会有 `Array.isArray()` 方法的原因。
如果有一个能够跨框架的，用于检查一个对象是否是给定的构造函数的实例的方法的话，那会很好。
上述的 `getTypeName()` 是一个可用的变通方法，但也许还有一个更根本的解决方案。

## 综述

下面提到的，应该是目前 JavaScript 中最迫切需要的，可以代替一些 `typeof` 目前职责的功能特性：

* `isDefined()` (比如 `Object.isDefined()`): 可以作为一个函数或者一个运算符

* `isObject()`

* `getTypeName()`

* 能够跨框架的,检测一个对象是否是指定的构造函数的实例的机制

检查某个变量是否已经被声明这样的需求，可能没那么必要有自己的运算符。

## 参考文章

1. [JavaScript 并非所有的东西都是对象](http://justjavac.com/javascript/2012/12/22/javascript-values-not-everything-is-an-object.html)

2. [Improving the JavaScript typeof operator](http://www.2ality.com/2011/11/improving-typeof.html)

