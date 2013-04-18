---
layout: post
title: 「译」JavaScript 的怪癖 1：两个「空值」：undefined 和 null
keywords: javascript, quirks, undefined, null
category : javascript
tags : [javascript, quirks]
---

原文：[JavaScript quirk 2: two “non-values” – undefined and null](http://www.2ality.com/2013/04/quirk-undefined.html)

译文：[「译」JavaScript 的怪癖 2：两个「空值」：undefined 和 null](http://justjavac.com/javascript/2013/04/14/javascript-quirk-2-two-non-values-undefined-and-null.html)

译者：SingleSeeker

----------------------------------------------------

[此文是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第二篇。]

对于“空值”或“空引用”，大多数编程语言只有一个值。比如，在 Java 中用的是 `null`。
但是在 Javascript 中却有两个特殊的值: `undefined` 和 `null`。
他们基本上是相同，但用法上却略有些不同。
在这个[系列教程](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html "javascript 的 12 个怪癖（quirks）")的最后，我会解释一下在 ECMAScript 6 中的一些变化。

`undefined` 是被语言本身所分配的。
如果一个变量还没有被初始化，那么它的值就是 `undefined`:

    > var foo;
    > foo
    undefined

同理，当缺失参数时 JavaScript 会分配一个 `undefined`：

    > function id(x) { return x }
    > id()
    undefined

`null` 是被开发者用来明确指出某个值是缺失的，
例如，对于 [JSON.stringify()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify):   

    > console.log(JSON.stringify({ first: 'Jane' }, null, 4))
    {
        "first": "Jane"
    }

校检：一个变量是否有值？

如果你想知道变量 `v` 是否有值，正常情况下，你需要同时检验 `undefined` 与 `null`。
幸运的是两个值都是 [false 型](http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html)。
因此，只用一个判断，就可以同时检验这两项是否为真:

    if (v) {
        // v 有值
    } else {
        // v 没有值
    }

在本[系列](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html "javascript 的 12 个怪癖（quirks）")的第 5 部分——关于函数参数的处理——你将会看到更多的上面校检例子。
有一点要注意的是：这个检查也会把 `false`, `-0`, `+0`, `NaN` 与 '' 当成“空值”。
如果这不是你想要的，那么就不能使用上面的校检方法了。

你有两个选择。

有些人提倡使用不等于（`!=`）来校检 v 既不是 `undefined` 或 `null`:

    if (v != null) {
        // v 有值
    } else {
        // v 没有值
    }

不过，这要求你要明白 `!=` 认为 `null` 只等于它自己或是 `undefined`。
我喜欢用更有可读性的 `!==`:

    if (v !== undefined && v !== null) {
        // v 有值
    } else {
        // v 没有值
    }

[性能方面](http://jsperf.com/definedness)，所有在这个章节中提到的这三个校检基本是相同的。
所以，最后用哪个取决于你的需求还有你的品味。
一些压缩工具甚至用 `!=` 重写了最后一条校检。