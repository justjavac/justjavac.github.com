---
layout: post
title: 「译」JavaScript 的怪癖 1：隐式类型转换
keywords: javascript, quirks
category : javascript
tags : [javascript, quirks]
---

原文：[JavaScript quirk 1: implicit conversion of values](http://www.2ality.com/2013/04/quirk-implicit-conversion.html)

译文：[「译」JavaScript 的怪癖 1：隐式类型转换](http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

## 零：提要

[此贴子是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第一篇。]

JavaScript 是非常宽容的，「来者不拒」，不在乎什么[类型](http://justjavac.com/javascript/2012/12/23/what-is-javascripts-typeof-operator-used-for.html "JavaScript 的 typeof 的用途")。
例如，它如果想要接受数字，它并不拒绝其他类型的值，而是试图把它们转换成数字：

    > '5' - '2'
    3
    > '5' * '2'
    10

自动转换为布尔值通常不会引起问题，而且往往很有用（译注：比如在C语言里，根本就没有布尔类型。by [@justjavac](http://weibo.com/justjavac)）。
即使如此，这些隐式转换也会引起怪癖（quirks）。
但是当自动转换为字符串时，可能会引起问题。

## 一：隐式转换为布尔：“truthy”和“falsy”

当 JavaScript 需要一个布尔值时（例如：`if` 语句），任何值都可以被使用。
最终这些值将被转换为 `true` 或 `false`。

下面的值被转换为 `false`：

* undefined, null
* Boolean: false
* Number: -0, +0, NaN
* String: ''

所有其他值都认为是 `true`。
被转换成 'false' 的值我们成之为 falsy，被转换成 'true' 的值我们成之为 truthy。
您可以使用 Boolean 来测试一个值到底被转换成了什么。

Boolean 将其参数转换为布尔值（boolean）：

    > Boolean(undefined)
    false
    > Boolean(0)
    false
    > Boolean(3)
    true

## 二、字符串的隐式转换

在 Web 开发中，我们经常得到字符串值，实际上我们期望的却是数字或者布尔值。
例如，用户输入的表单中的数据。
如果你忘了对这些字符串进行显式的转换，那么 JavaScript 会令你感到惊讶，主要体现在两个方面：

1. 首先，系统不会有任何警告。
2. 其次，这些值将被自动转换，但确实错误的。

例如，加运算符（+），就有这方面的问题，因为**只要其中一个操作数是字符串，那么它就执行连接字符串的操作（而不是加法操作，即使它们是数字）**。

在下面的 JavaScript 代码中，我们本来预期是把 1 和 5 相加。
但是，我们使用了字符串 '5' 和 '1' 。

    > var x = '5';  // 错误的假设：x 是一个数字

    > x + 1
    '51'

此外，还有一些看似是 `false` 的值，如果转换成字符串，却成了 'true'。

例如：`false`。

    > Boolean(false)
    false
    > String(false)
    'false'
    > Boolean('false')  // ！！
    true

例如： `undefined`.

    > Boolean(undefined)
    false
    > String(undefined)
    'undefined'
    > Boolean('undefined')  // ！！
    true

## 三、对象的隐式转换

只有在 JavaScript 表达式或语句中需要用到数字或字符串时，对象才被隐式转换。
当需要将对象转换成数字时，需要以下三个步骤：

1. 调用 `valueOf()`。如果结果是原始值（不是一个对象），则将其转换为一个数字。
2. 否则，调用 `toString()` 方法。如果结果是原始值，则将其转换为一个数字。
3. 否则，抛出一个类型错误。

第一步示例:

    > 3 * { valueOf: function () { return 5 } }
    15

第三步示例:

    > function returnObject() { return {} }
    > 3 * { valueOf: returnObject, toString: returnObject }
    TypeError: Cannot convert object to primitive value

如果把对象转换成字符串时，则转换操作的第一步和第二步的顺序会调换：
先尝试 `toString()` 进行转换，如果不是原始值，则再尝试使用 `valueOf()`。

## 四、相关阅读

1. [JavaScript中,{}+{}等于多少?](http://justjavac.com/javascript/2012/12/20/object-plus-object.html)
2. [JavaScript：将所有值都转换成对象](http://justjavac.com/javascript/2012/12/21/converting-any-value-to-an-object.html)
3. [为什么 ++[[]][+[]]+[+[]] = 10？](http://justjavac.com/javascript/2012/05/24/can-you-explain-why-10.html)
