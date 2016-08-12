---
layout: post
title: 在 javascript 中，为什么 [1,2] + [3,4] 不等于 [1,2,3,4]？
description: 在 stackoverflow 上有人提问：arrays - Why does [1,2] + [3,4] = "1,23,4" in JavaScript?，规范并没有定义 + 运算符在数组上的行为，所以javascript 首先 把数组转换成字符串，然后在字符串上进行 + 运算。
keywords: JavaScript, array, 运算
category : javascript
tags : [JavaScript]
---

在 stackoverflow 上有人提问：[arrays - Why does [1,2] + [3,4] = "1,23,4" in JavaScript?](http://stackoverflow.com/q/7124884/343194)

## 问题

我想将一个数组追加到另一个数组的后面，于是我在 firebug 编写如下代码：

```javascript
[1,2] + [3,4]
```

但是，出乎意料，它却输出了：

```javascript
"1,23,4"
```

而没有输出我期望的：

```javascript
[1,2,3,4]
```

这是怎么回事呢？为什么 `[1,2] + [3,4]` **不等于** `[1,2,3,4]`？

类似问题还有：[为什么 ++[[]][+[]]+[+[]] = 10？](http://justjavac.com/javascript/2012/05/24/can-you-explain-why-10.html)

## 解答

JavaScript 的 `+` 运算符有两个目的：

1. 将两个数相加；

2. 将两个字符串连接。

规范并没有定义 `+` 运算符在数组上的行为，所以javascript 首先 **把数组转换成字符串**，然后在字符串上进行 `+` 运算。

如果想连接两个数组，可以使用数组的 `concat` 方法：

```javascript
[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

### javascript 中的 + 运算符概述

下面简单介绍一下 `+` 运算符，有兴趣的话可以看看我以前写的 [代码之谜（三）- 运算符](http://justjavac.com/codepuzzle/2012/10/28/codepuzzle-operator.html)。

JavaScript 具有 6 种内置 [数据类型](https://developer.mozilla.org/en/JavaScript/Reference/Operators/Special/typeof)：
（译注：从给出的连接看，原作者的意思应该是 **原始类型系统** 的数据类型，JavaScript 事实上有两套类型系统。
第一套类型系统是用 `typeof` 来识别，称之为原始(primitive)类型系统，而第二套类型系统是以它为基础，从 `object` 这一种类型中发展起来的，即对象类型系统，对象类型系统用 `instanceof` 来识别。[@justjavac](http://weibo.com/justjavac)）

* undefined

* boolean

* number

* string

* function

* object

需要注意的是，`null` 和 `[]` 是两个截然不同的类型，当使用 `typeof` 运算时，它们却都返回 `object`。
但是在使用 `+` 运算符时，在这两种情况下的工作方式是不同的。

在JavaScript 中，**数组不是基本类型**，它的存在仅仅是一个糖衣语法，它其实是 `Array` 类的实例。(ps：`function` 其实也是 `Function` 类实例的糖衣语法。)

如果说道现在你脑子还是清醒的，是时候加点儿猛料了。javascript 的对象包装器类型例如 `new Number(5)`, `new Boolean(true)` 和 `new String("abc")` 也都是 `object` 类型，它们不是数字，布尔，字符串。然而，对于算数运算符 `Number` 和 `Boolean` 表现的为数字。

还记得我前面说过的 `+` 运算符吗？它的操作对象是 **数字和字符串**，也就是 `Number`，`Boolean`，`String` 或者 `number`，`boolean`，`string`。

下面的表格就是 `+` 运算符对于不同类型进行运算后，得到的结果类型

    ----------------------------------------------------------------------------------------
               | undefined | boolean | number | string | function | object | null   | array
    ----------------------------------------------------------------------------------------

    undefined  | number    | number  | number | string | string   | string | number | string

    boolean    | number    | number  | number | string | string   | string | number | string

    number     | number    | number  | number | string | string   | string | number | string

    string     | string    | string  | string | string | string   | string | string | string

    function   | string    | string  | string | string | string   | string | string | string

    object     | string    | string  | string | string | string   | string | string | string

    null       | number    | number  | number | string | string   | string | number | string

    array      | string    | string  | string | string | string   | string | string | string

    -------------------------------------------------------------------------------------------

**本表适用于 Chrome 13, Firefox 6, Opera 11 and IE9。课外作业：检查其他的浏览器兼容性。**

**注意**：用户自定义对象进行 + 运算不一定总产生一个字符串结果。这主要取决于 **对象类型到原生类型转换** 的实现方式。

例如：

```javascript
var o = { 
	valueOf : function () { return 4; } 
};
```

计算 `o + 2` 将得到 6, 是一个数字 number；计算 `o + '2'` 得到 '42', 是一个字符串 string。

继续阅读：[写了10年Javascript未必全了解的连续赋值运算](http://justjavac.com/javascript/2012/04/05/javascript-continuous-assignment-operator.html)
