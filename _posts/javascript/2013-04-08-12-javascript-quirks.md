---
layout: post
title: javascript 的 12 个怪癖（quirks）
keywords: javascript, quirks
category : javascript
tags : [javascript, quirks]
---

原文：[12 JavaScript quirks](http://www.2ality.com/2013/04/12quirks.html)

译文：[javascript 的 12 个怪癖（quirks）](https://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

本系列文章托管在 github：<https://github.com/justjavac/12-javascript-quirks>，您可以通过 pull reqeust 的方式参与翻译。

实际上 javascript 是一个相当简洁的语言，但是也难免会有一些怪癖（quirks）。
本章是 [javascript 的 12 个怪癖](https://justjavac.com/javascript/2013/04/08/12-javascript-quirks.html) 系列的第一篇，
也是一个目录，为的是你能更好的了解它们：

1. [隐式数值转换](https://justjavac.com/javascript/2013/04/08/javascript-quirk-1-implicit-conversion-of-values.html) （已翻译）

2. [两个「空值」：undefined 和 null](https://justjavac.com/javascript/2013/04/14/javascript-quirk-2-two-non-values-undefined-and-null.html) （已翻译）

3. [标准的等号 (==)](https://justjavac.com/javascript/2013/04/26/12-javascript-quirk-3-normal-equality-vs-the-double-equals.html)

4. [未知的变量名将创建一个全局变量](https://github.com/justjavac/12-javascript-quirks/blob/master/cn/4-unknown-variable-names-create-global-variables.md)

5. [参数处理方式](https://github.com/justjavac/12-javascript-quirks/blob/master/cn/5-parameter-handling.md)

6. [变量的作用范围](https://github.com/justjavac/12-javascript-quirks/blob/master/cn/6-the-scope-of-variables.md)

7. [闭包和自由(外部)变量](https://github.com/justjavac/12-javascript-quirks/blob/master/cn/7-inadvertent-sharing-of-variables-via-closures.md)

8. “对象、数组——傻傻分不清楚”（Array-like objects）

9. 子类的构造函数（Subtyping constructors）

10. 属性的读写（Reading and writing of properties）

11. 函数中的 this（this in real functions）

12. for-in循环（The for-in loop）

本系列文章，需要您了解 ECMAScript 5 和 javascript 的基本知识，凡涉及到比较复杂的，文章中将会给出解释。
在这个 [系列（德语）](http://www.2ality.com/2013/01/fallgruben.html) 的结尾有关于 [ECMAScript 6](http://www.2ality.com/2011/06/ecmascript.html) 「[中文](https://justjavac.com/javascript/2013/04/06/ecmascript-es-next-versus-es-6-versus-es-harmony.html)」 的解释，
ECMAScript 6 消除了许多 javascript（ECMAScript 5） 的怪癖。

## 参考:

1. [ECMAScript: ES.next versus ES 6 versus ES Harmony](http://www.2ality.com/2011/06/ecmascript.html) 「[中文](https://justjavac.com/javascript/2013/04/06/ecmascript-es-next-versus-es-6-versus-es-harmony.html)」