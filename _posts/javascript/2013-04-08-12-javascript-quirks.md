---
layout: post
title: 「译」javascript 的 12 个怪癖（quirks）
keywords: javascript, quirks
category : javascript
tags : [javascript, quirks]
---

原文：[12 JavaScript quirks](http://www.2ality.com/2013/04/12quirks.html)

译文：[「译」javascript 的 12 个怪癖（quirks）](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

实际上 javascript 是一个相当简洁的语言，但是也难免会有一些怪癖（quirks）。
本章是 [javascript 的 12 个怪癖](http://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第一篇，
也是一个目录，为的是你能更好的了解它们：

1. [隐式数值转换（Implicit conversion of values）](http://www.2ality.com/2013/04/quirk-implicit-conversion.html) [中文(正在翻译)]()

2. 两个「空值」：undefined 和 null（Two "non-values" undefined and null）

3. Normal equality ==

4. 未知的变量名将创建一个全局变量（Unknown variable names create global variables）

5. 参数处理方式（Parameter handling）

6. 变量的作用范围（The scope of variables）

7. 闭包和自由(外部)变量（Closures and free (external) variables）

8. “对象、数组——傻傻分不清楚”（Array-like objects）

9. 子类的构造函数（Subtyping constructors）

10. 属性的读写（Reading and writing of properties）

11. 函数中的 this（this in real functions）

12. for-in循环（The for-in loop）

本系列文章，需要您了解 ECMAScript 5 和 javascript 的基本知识，凡涉及到比较复杂的，文章中将会给出解释。
在这个 [系列（德语）](http://www.2ality.com/2013/01/fallgruben.html) 的结尾有关于 [ECMAScript 6](http://www.2ality.com/2011/06/ecmascript.html) 「[中文](http://justjavac.com/javascript/2013/04/06/ecmascript-es-next-versus-es-6-versus-es-harmony.html)」 的解释，
ECMAScript 6 消除了许多 javascript（ECMAScript 5） 的怪癖。

## 参考:

1. [ECMAScript: ES.next versus ES 6 versus ES Harmony](http://www.2ality.com/2011/06/ecmascript.html) 「[中文](http://justjavac.com/javascript/2013/04/06/ecmascript-es-next-versus-es-6-versus-es-harmony.html)」