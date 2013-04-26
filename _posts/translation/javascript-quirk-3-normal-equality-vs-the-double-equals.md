---
layout: post
title: JavaScript 的怪癖 3：标准的等号 (==)
keywords: javascript, quirks, equality
category : javascript
tags : [javascript, quirks]
---

原文：[JavaScript quirk 3: normal equality (==)](http://www.2ality.com/2013/04/quirk-undefined.html)

译文：[JavaScript 的怪癖 3：标准的等号 (==)](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html)

译者：[iranw](http://www.phpno.com)

----------------------------------------------------

此文是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第三篇。

让我们先看一个简单的例子：
由于一般的等于符号 `==`、`!=`经常会出现问题，以至于我们不得不使用严格等于(`===`、`!==`)。
当然有人说这些规则也有例外，我不同意这个观点[[2]][]。
怀揣的这个问题，我们现在就来看一下这个奇怪的现象：`==` 是不必要。


这个“正常”的等号（`==`）有很多怪癖。
虽然他很宽容（非严格比较），当与真值或者假值比较时，它会忽略类型（详见[怪癖1][quirk 1]）：

[quirk 1]: http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html "JavaScript 的怪癖 1：隐式类型转换"

    > 0 == false  // OK
    true
    > 1 == true  // OK
    true
    > 2 == true  // not OK
    false

    > '' == false  // OK
    true
    > '1' == true  // OK
    true
    > '2' == true  // not OK
    false

除了这些，我们设置可以把那些明显不能比较的值进行比较（我勒个去～～比较的结果居然还是 `true`）：

    > '' == 0
    true
    > '\n  123  \t' == 123
    true

最后一次比较返回是 `true`，因为在 javascript 中把字符串转换数字类型时，会过滤掉首尾空白字符。
如果你仍然对关于 `==` 怎么工作感兴趣，你可以读读[这篇文章][1]。
对于严格比较符（`===`），不同类型的值比较是不相等的 [[1]][1]。也就是说试用严格比较符号，上诉的问题都不复存在。

## 参考文献:

1. [Equality in JavaScript: === versus ==][1]

2. [When is it OK to use == in JavaScript?][2]

[1]: http://www.2ality.com/2011/06/javascript-equality.html "Equality in JavaScript: === versus =="
[2]: http://www.2ality.com/2011/12/strict-equality-exemptions.html "When is it OK to use == in JavaScript?"
