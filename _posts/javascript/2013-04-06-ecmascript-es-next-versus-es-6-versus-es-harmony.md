---
layout: post
title: ECMAScript：ES.next 和 ES6 以及 ES Harmony 之间的区别
keywords: javascript, ECMAScript
category: javascript
tags: [javascript, ECMAScript]
uids: 1708684567
---

原文：[ECMAScript: ES.next versus ES 6 versus ES Harmony](http://www.2ality.com/2011/06/ecmascript.html)

译文：[ECMAScript：ES.next 和 ES6 以及 ES Harmony 之间的区别](http://www.cnblogs.com/ziyunfei/archive/2012/09/24/2699065.html)

译者：[紫云飞](http://weibo.com/u/1708684567)

----------------------------------------------------

本文解释了 JavaScript 和 ECMAScript 之间的区别。
还解释了 ECMAScript.next 和 ECMAScript 6 以及 ECMAScript Harmony 之间的区别。

## 部分 ECMAScript 术语

你应该知道下面这些与 JavaScript 标准化相关的术语.

* **ECMAScript**: Sun (现在的 Oracle) 公司持有着「Java」和「JavaScript」的商标。
这就让微软不得不把自己的 JavaScript 方言称之为「JScript」。
然后，在这门语言被标准化的时候，就必须使用一个与二者都不同的名字。
「ECMAScript」就这样诞生了，这个名字的来由是因为执行标准化的组织是 Ecma 国际。
通常来说，术语「ECMAScript」和「JavaScript」指的是同一个东西。
但如果把 JavaScript 看成是「Mozilla 或其他组织的 ECMAScript 实现」，那么 ECMAScript 就是实现 JavaScript 所依据的标准。
术语「ECMAScript」也用来描述语言版本(比如 ECMAScript 5)。

* **ECMA-262**: [Ecma 国际](http://en.wikipedia.org/wiki/Ecmascript) (一个标准化组织) 创建了 ECMA-262 规范，这个规范就是 ECMAScript 语言的官方标准。

* **ECMAScript 5**: 如果有人提到 ECMAScript 5，那么他指的就是 ECMA-262 规范的第五版，同时也是当前最新的正式规范。

* **Ecma第39号技术委员会** ([TC39](http://www.ecma-international.org/memento/TC39.htm)): 
是一组开发 ECMA-262 标准规范的人(Brendan Eich 和其他一些人)。

## ECMAScript 的历史

* **ECMAScript 3** (1999 年 12 月)。这是目前大部分浏览器都支持的 ECMAScript 版本。
该版本引入了很多的新特性，这些特性已经成为该语言不可或缺的一部分:

	* [...] 正则表达式，
	* 更好的字符串处理，
	* 新的控制语句，
	* try/catch异常捕获，
	* 更严格的错误类型定义，
	* 格式化数字输出以及其他增强特性。 <sup>[1]</sup>

* **ECMAScript 4** (2008 年 7 月被废弃)。 ECMAScript 4 是作为下一代的 JavaScript 被开发的，同时有一个用 ML 写成的原型。
但是，TC39 委员会并不完全同意它的一些新特性。
为了防止陷入僵局， 委员会在 2008 年 7 月底会晤，并产生了一项协议，协议内容总结为以下四点 <sup>[2]</sup>:

	1. 开发一个增量式更新的 ECMAScript (后来成为了 ECMAScript 5).

	2. 开发一个重要的新版本规范，要比 ECMAScript 4 更先进，但会比 ECMAScript 3 之后的那个版本更新跨度更大。该版本的开发代号被定为 Harmony，因为这场会议的的性质就是倡导我们要和谐发展。

	3. ECMAScript 4 中引入的一些特性将被丢弃：包，命名空间，早期绑定。

	4. 其他的想法要在成为所有的TC39成员的共识下开发.

最终：ECMAScript 4 的开发者们同意把 Harmony 做的不要像 ECMAScript 4 那么激进，其余的 TC39 成员也表示同意，开发继续进行。

* **ECMAScript 5** (2009年12月)。 此版本带来了一些标准库的增强，甚至通过引入严格模式更新了语言的语义。<sup>[3]</sup>

* **ECMAScript.next** (计划于2013年)。 从问世以来，这个版本就显得有点太过雄心勃勃了，所以它的特性被分成了两组，
第一组是那些将要成为 ECMAScript 5 下一个版本的特性。这一版本的开发代号称之为 ECMAScript.next，并且很可能成为 ECMAScript 6。
第二组是 Harmony 特性，这些特性被认为是准备还不够充分或者重要程度还不够，所以不能进入 ECMAScript.next。
但仍然会进入某个更新的 ECMAScript 版本中，比如 ECMAScript.next.next。当前的目标是在 2013 年完成 ECMAScript.next，
在此之前，浏览器(主要是火狐)要实现部分规范。

## 总结

**ECMAScript 和 JavaScript 的关系**。ECMAScript 是语言的规范。而 JavaScript 是规范的实现，Microsoft 的 JScript 是另外一个实现。

**即将到来的 ECMAScript 版本**:

* ECMAScript.next 是 ECMAScript 下一版规范的开发代号(code name)。
使用这个术语就意味着当前讨论的特性可能会也可能不会被加入最终的规范中。

* ECMAScript 6 是 ECMAScript.next 的实际(最终)名称。
使用这个术语就意味着当前讨论的特性一定会被添加在最终的规范中。

* ECMAScript Harmony 是 ECMAScript.next 的超集，意味着「ECMAScript 5 之后的新特性」。
这些特性可能会被添加到 ECMAScript.next 中，也可能被添加到 ECMAScript.next.next 或者更新的版本中。

## 参考

1. [ECMAScript - Wikipedia， the free encyclopedia](http://en.wikipedia.org/wiki/Ecmascript)
2. [ECMAScript Harmony](https://mail.mozilla.org/pipermail/es-discuss/2008-August/003400.html) (电子邮件归档)
3. [What’s new in ECMAScript 5](http://www.2ality.com/2010/12/whats-new-in-ecmascript-5.html)
4. [JavaScript: how it all began](http://www.2ality.com/2011/03/javascript-how-it-all-began.html)
5. [Posts on ECMAScript.next](http://www.2ality.com/search/label/esnext)
	* Best overview of planned features: "[ECMAScript.next: the 'TXJS' update by Eich](http://www.2ality.com/2011/06/esnext-txjs.html)"

## 译者注

ECMAScript的读音大概为「艾克马 script」。

ECMA国际除了TC39还有很多[委员会](http://www.ecma-international.org/memento/org.htm)，他们制定的规范也不只有 ECMAScript，
还有很多[其他的规范](http://www.ecma-international.org/publications/standards/Stnindex.htm)，有数据压缩相关的，有无线通信相关的，
属于 ECMAScript 的规范只有三个，

1. ECMA-262：我们通常说的 ECMAScript 就指的这个；
2. ECMA-357：E4x，ES262 的扩展，只有火狐实现了；
3. 还有 ECMA-327。

John Resig 也有一篇相关的文章，[ECMAScript Harmony](http://ejohn.org/blog/ecmascript-harmony/)

我英语渣水平,翻译不对的地方请一定要指教。