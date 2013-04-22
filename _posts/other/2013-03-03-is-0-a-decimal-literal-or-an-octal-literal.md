---
layout: post
title: C++ 中 0 是十进制还是八进制？
description: C++ 中 0 是十进制还是八进制？。
keywords: 0, 进制, 八进制
category : other
tags : [进制]
---

原文：[Is 0 a decimal literal or an octal literal?](http://stackoverflow.com/questions/6895522/is-0-a-decimal-literal-or-an-octal-literalpt)

译文：[C++ 中 0 是十进制还是八进制？](http://justjavac.com/other/2013/03/03/is-0-a-decimal-literal-or-an-octal-literal.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

C++ 中 0 是十进制还是八进制？

虽然在任何进制数种， 0 只有一个值——那就是「零」，之所以问这个问题，纯粹是闲着蛋疼。

最近和朋友们讨论关于数的话题，他说，八进制数现在几乎从未使用过。
我一时无法反驳，确实，除了我们经常使用的十进制，在计算机中用的最多的就是二进制和十六进制了，八进制数确实很“小众”。

等我回到家仔细一琢磨，八进制，八进制，「八进制就是以 0 开头的数字」，咦，那 0 算吗？0 也是以 0 开头的数字啊！如果 0 是八进制的话，那么我们几乎每天都在使用八进制数。
计算机中确实有很多东西值得深究，比如[简单类型其实一点都不简单](http://justjavac.com/codepuzzle/2012/11/02/codepuzzle-float-from-surprised-to-ponder.html)，更多蛋疼的计算机问题可以去我的[《代码之谜》系列](http://justjavac.iteye.com/category/249538)去看看。

那么 0 是八进制数吗？C++ 规范如何定义的？

是的，在 C++ 中，0 是 **八进制** 的。

根据 C++ 标准：

**2.14.2 整数 [lex.icon]**

    integer-literal:  
        decimal-literal integer-suffixopt  
        octal-literal integer-suffixopt  
        hexadecimal-literal integer-suffixopt  
    decimal-literal:  
        nonzero-digit  
        decimal-literal digit  
    octal-literal:  
        0                    <--------------------<这里>
        octal-literal octal-digit

以后我们设置可以自豪的说，“在计算机中，八进制比二进制，甚至十六进制更普遍”。
