---
layout: post
title: JavaScript 的怪癖 3：JavaScript quirk 3: normal equality (==)
keywords: javascript, quirks, equality
category : javascript
tags : [javascript, quirks]
---

###
标题： JavaScript的怪癖之三：标准的等号 (==)
关键词: javascript, 等号，怪癖
分类 : javascript
标签: [javascript, 怪癖]
###

原文：[JavaScript quirk 3: normal equality (==)](http://www.2ality.com/2013/04/quirk-undefined.html)

译文：[JavaScript quirk 3: normal equality (==)](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html)

译者：[未翻译](iranw翻译[http://www.phpno.com/])

----------------------------------------------------

此文是 [javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第三篇。

Let’s start with a simple rule: 
the normal equality operators `==` and `!=` are so problematic that you should always use strict equality (`===` and `!==`). 
Some people say that there are exceptions to this rule, I disagree [2][]. 
Keeping this rule in mind, we can now take a look at what is strange about `==` without burdening our minds unnecessarily.

让我们先看一个简单的例子：
由于一般的等于符号‘==’、‘!=’经常会出现问题以至于我们不得不适用严格等于('==='、'!==')。
当然有人说这些规则也有厉害，我是不同意这个观点的[2][](这个是什么意思呢？).
怀揣的这个问题，我们现在就来看一下这个奇怪的现象：‘==’是不必要的







The “normal” equality operator (`==`) has many quirks. 
While it is forgiving, it does not adhere to the typical rules of truthy and falsy (see [quirk 1][]):



[quirk 1]: http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html "JavaScript 的怪癖 1：隐式类型转换"

这个“正常”的等号（'=='）有很多怪相
虽然他很宽容（非严格比较），但它不管类型的错与对

（详见怪癖1：http://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html隐式类型转换）


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

Apart from that, it lets you compare values that aren’t really comparable:
除了这些，我们也可以看到它在比较值的时候也不是真的比较(值)

    > '' == 0
    true
    > '\n  123  \t' == 123
    true

The last check is true because conversion to number ignores leading and trailing whitespace in JavaScript.
If you are still interested in finding out how exactly `==` works, you can read up on it here: [1][]. 
With strict equality (`===`), values of different types are never equal [1][], which means that all of the above problems go away.

最后一次比较返回是true，因为在js中转换num类型会过滤掉收尾空白字符
如果你仍然对关于'=='怎么工作感兴趣，你可以读读下满的文章.
对于严格比较符（'==='），不同类型的值比较是不相等的。也就是说试用严格比较符号，上诉的问题都不复存在

## References:


1. [Equality in JavaScript: === versus ==][1]

2. [When is it OK to use == in JavaScript?][2]

[1]: http://www.2ality.com/2011/06/javascript-equality.html
[2]: http://www.2ality.com/2011/12/strict-equality-exemptions.html


##参考文献
[1]: http://www.2ality.com/2011/06/javascript-equality.html
[2]: http://www.2ality.com/2011/12/strict-equality-exemptions.html
