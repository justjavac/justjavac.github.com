---
layout: post
title: JavaScript中,{}+{}等于多少?
description: 在把对象和数组混合相加时，会得到一些你意想不到的结果。本篇文章会依次讲解这些计算结果是如何得出的。
keywords: javascript,对象
category : javascript
tags : [javascript, 对象]
---

原文：[What is {} + {} in JavaScript?](http://www.2ality.com/2012/01/object-plus-object.html)

译文：[JavaScript中,{}+{}等于多少?](http://justjavac.com/javascript/2012/12/20/object-plus-object.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

最近，Gary Bernhardt 在一个简短的演讲视频“[Wat](https://www.destroyallsoftware.com/talks/wat)”中指出了一个有趣的 JavaScript 怪癖：
在把对象和数组混合相加时，会得到一些意想不到的结果。
本篇文章会依次讲解这些计算结果是如何得出的。

在 JavaScript 中，加法的规则其实很简单，只有两种情况:

* 把数字和数字相加
* 把字符串和字符串相加

所有其他类型的值都会被自动转换成这两种类型的值。 
为了能够弄明白这种隐式转换是如何进行的，我们首先需要搞懂一些基础知识。

**注意**：在下面的文章中提到某一章节的时候(比如§9.1)，指的都是 ECMA-262 语言规范(ECMAScript 5.1)中的章节。

让我们快速的复习一下。
在 JavaScript 中，一共有两种类型的值:

* 原始值(primitives)
    1. undefined
    2. null
    3. boolean
    4. number
    5. string
* 对象值(objects)。

除了原始值外，其他的所有值都是对象类型的值，包括数组(array)和函数(function)。

## 类型转换

加法运算符会触发三种类型转换：

1. 转换为原始值
2. 转换为数字
3. 转换为字符串

### 通过 ToPrimitive() 将值转换为原始值

JavaScript 引擎内部的抽象操作 `ToPrimitive()` 有着这样的签名:

    ToPrimitive(input，PreferredType?)

可选参数 `PreferredType` 可以是 `Number` 或者 `String`。
它只代表了一个转换的偏好，转换结果不一定必须是这个参数所指的类型（汗），但转换结果一定是一个原始值。
如果 `PreferredType` 被标志为 `Number`，则会进行下面的操作来转换 `input` (§9.1):

1. 如果 `input` 是个原始值，则直接返回它。

2. 否则，如果 `input` 是一个对象。则调用 `obj.valueOf()` 方法。
如果返回值是一个原始值，则返回这个原始值。

3. 否则，调用 `obj.toString()` 方法。
如果返回值是一个原始值，则返回这个原始值。

4. 否则，抛出 `TypeError` 异常。

如果 `PreferredType` 被标志为 `String`，则转换操作的第二步和第三步的顺序会调换。
如果没有 `PreferredType` 这个参数，则 `PreferredType` 的值会按照这样的规则来自动设置：

* `Date` 类型的对象会被设置为 `String`，
* 其它类型的值会被设置为 `Number`。

### 通过 ToNumber() 将值转换为数字

下面的表格解释了 `ToNumber()` 是如何将原始值转换成数字的 (§9.3)。

<table class="table table-bordered">
  <thead>
    <tr>
      <th>参数</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>NaN</td>
    </tr>
    <tr>
      <td>null</td>
      <td>+0</td>
    </tr>
    <tr>
      <td>boolean</td>
      <td>true被转换为1,false转换为+0</td>
    </tr>
    <tr>
      <td>number</td>
      <td>无需转换</td>
    </tr>
    <tr>
      <td>string</td>
      <td>由字符串解析为数字。例如，"324"被转换为324</td>
    </tr>
  </tbody>
</table>

如果输入的值是一个对象，则会首先会调用 `ToPrimitive(obj, Number)` 将该对象转换为原始值，
然后在调用 `ToNumber()` 将这个原始值转换为数字。

### 通过ToString()将值转换为字符串

下面的表格解释了 `ToString()` 是如何将原始值转换成字符串的(§9.8)。

<table class="table table-bordered">
  <thead>
    <tr>
      <th>参数</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>"undefined"</td>
    </tr>
    <tr>
      <td>null</td>
      <td>"null"</td>
    </tr>
    <tr>
      <td>boolean</td>
      <td>"true"  或者 "false"</td>
    </tr>
    <tr>
      <td>number</td>
      <td>数字作为字符串。比如，"1.765"</td>
    </tr>
    <tr>
      <td>string</td>
      <td>无需转换</td>
    </tr>
  </tbody>
</table>

如果输入的值是一个对象，则会首先会调用 `ToPrimitive(obj, String)` 将该对象转换为原始值，
然后再调用 `ToString()` 将这个原始值转换为字符串。

### 实践一下

下面的对象可以让你看到引擎内部的转换过程。

    var obj = {
        valueOf: function () {
            console.log("valueOf");
            return {}; // not a primitive
        }，
        toString: function () {
            console.log("toString");
            return {}; // not a primitive
        }
    }

`Number` 作为一个函数被调用(而不是作为构造函数调用)时，会在引擎内部调用 `ToNumber()` 操作:

    > Number(obj)
    valueOf
    toString
    TypeError: Cannot convert object to primitive value

## 加法

有下面这样的一个加法操作。

    value1 + value2

在计算这个表达式时，内部的操作步骤是这样的 (§11.6.1):

1. 将两个操作数转换为原始值 (以下是数学表示法的伪代码，不是可以运行的 JavaScript 代码):

        prim1 := ToPrimitive(value1)
        prim2 := ToPrimitive(value2)

    `PreferredType` 被省略，因此 `Date` 类型的值采用 `String`，其他类型的值采用 `Number`。

2. 如果 prim1 或者 prim2 中的任意一个为字符串，则将另外一个也转换成字符串，然后返回两个字符串连接操作后的结果。
3. 否则，将 prim1 和 prim2 都转换为数字类型，返回他们的和。

### 预料到的结果

当你将两个数组相加时，结果正是我们期望的:

    > [] + []
    ''

`[]` 被转换成一个原始值：首先尝试 `valueOf()` 方法，该方法返回数组本身(`this`):

    > var arr = [];
    > arr.valueOf() === arr
    true

此时结果不是原始值，所以再调用 `toString()` 方法，返回一个空字符串(`string` 是原始值)。
因此，`[] + []` 的结果实际上是两个空字符串的连接。

将一个数组和一个对象相加，结果依然符合我们的期望:

    > [] + {}
    '[object Object]'

解析：将空对象转换成字符串时，产生如下结果。

    > String({})
    '[object Object]'

所以最终的结果其实是把 `""` 和 `"[object Object]"` 两个字符串连接起来。

更多的对象转换为原始值的例子:

    > 5 + new Number(7)
    12
    > 6 + { valueOf: function () { return 2 } }
    8
    > "abc" + { toString: function () { return "def" } }
    'abcdef'

### 意想不到的结果

如果 `+` 加法运算的第一个操作数是个空对象字面量，则会出现诡异的结果(Firefox console 中的运行结果):

    > {} + {}
    NaN

天哪！神马情况？（译注：原文没有，是我第一次读到这儿的时候感到太吃惊了，翻译的时候加入的。[@justjavac](http://weibo.com/justjavac)）
这个问题的原因是，JavaScript 把第一个 `{}` 解释成了一个空的代码块（code block）并忽略了它。
`NaN` 其实是表达式 `+{}` 计算的结果 (`+` 加号以及第二个 `{}`)。
你在这里看到的 `+` 加号并不是二元运算符「加法」，而是一个一元运算符，作用是将它后面的操作数转换成数字，和 `Number()` 函数完全一样。例如:

    > +"3.65"
    3.65

以下的表达式是它的等价形式:

    +{}
    Number({})
    Number({}.toString())  // {}.valueOf() isn’t primitive
    Number("[object Object]")
    NaN

为什么第一个 `{}` 会被解析成代码块（code block）呢？ 
因为整个输入被解析成了一个语句：如果左大括号出现在一条语句的开头，则这个左大括号会被解析成一个代码块的开始。
所以，你也可以通过强制把输入解析成一个表达式来修复这样的计算结果:
（译注：我们期待它是个表达式，结果却被解析成了语句，表达式和语句的区别可以查看我以前的『代码之谜』系列的 [语句与表达式](http://justjavac.com/codepuzzle/2012/10/28/codepuzzle-expression-and-statement.html)。
[@justjavac](http://weibo.com/justjavac)）

    > ({} + {})
    '[object Object][object Object]'

一个函数或方法的参数也会被解析成一个表达式:

    > console。log({} + {})
    [object Object][object Object]

经过前面的讲解，对于下面这样的计算结果，你也应该不会感到吃惊了:

    > {} + []
    0

在解释一次，上面的输入被解析成了一个代码块后跟一个表达式 `+[]`。
转换的步骤是这样的:

    +[]
    Number([])
    Number([].toString())  // [].valueOf() isn’t primitive
    Number("")
    0

有趣的是，Node.js 的 REPL 在解析类似的输入时，与 Firefox 和 Chrome(和Node.js 一样使用 V8 引擎) 的解析结果不同。
下面的输入会被解析成一个表达式，结果更符合我们的预料:

    > {} + {}
    '[object Object][object Object]'
    > {} + []
    '[object Object]'

## 3. 这就是所有吗？

在大多数情况下，想要弄明白 JavaScript 中的 `+` 号是如何工作的并不难：你只能将数字和数字相加或者字符串和字符串相加。
对象值会被转换成原始值后再进行计算。如果将多个数组相加，可能会出现你意料之外的结果，相关文章请参考[在 javascript 中，为什么 [1,2] + [3,4] 不等于 [1,2,3,4]？](http://justjavac.com/javascript/2012/12/18/why-does-1-2-plus-3-4-equal-1-23-4-in-javascript.html) 和 [为什么 ++[[]][+[]]+[+[]] = 10？](http://justjavac.com/javascript/2012/05/24/can-you-explain-why-10.html)。

如果你想连接多个数组，需要使用数组的 concat 方法:

    > [1, 2].concat([3, 4])
    [1, 2, 3, 4]

JavaScript 中没有内置的方法来“连接" (合并)多个对象。
你可以使用一个 JavaScript 库，比如 Underscore:

    > var o1 = {eeny:1, meeny:2};
    > var o2 = {miny:3, moe: 4};
    > _.extend(o1, o2)
    {eeny: 1, meeny: 2, miny: 3, moe: 4}

注意：和 `Array.prototype.concat()` 方法不同，`extend()` 方法会修改它的第一个参数，而不是返回合并后的对象:

    > o1
    {eeny: 1, meeny: 2, miny: 3, moe: 4}
    > o2
    {miny: 3, moe: 4}

如果你想了解更多有趣的关于运算符的知识，你可以阅读一下 “[Fake operator overloading in JavaScript](http://www.2ality.com/2011/12/fake-operator-overloading.html)”（中文正在翻译中）。

## 参考

1. [JavaScript 并非所有的东西都是对象](http://justjavac.com/javascript/2012/12/22/javascript-values-not-everything-is-an-object.html)

2. [JavaScript：将所有值都转换成对象](http://justjavac.com/javascript/2012/12/21/converting-any-value-to-an-object.html)
