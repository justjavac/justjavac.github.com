---
layout: post
title: javascript 的 quine 程序升级版
keywords: javascript, quine
category : javascript
tags : [javascript, quine]
---

Quine 以哲学家 Willard van Orman Quine (1908-2000) 而命名，在[维基百科](http://en.wikipedia.org/wiki/Quine_(computing))中她的定义是：

> 一个 quine 是一个计算机程序，它不接受任何输入，且唯一的输出就是自身的源代码。

编写出某个语言中最简短的 quine 通常作为黑客们的消遣，比如下面的 javascript 代码就是一个 [quine 程序](http://www.2ality.com/2012/09/javascript-quine.html)：

	!function $(){console.log('!'+$+'()')}()

网上已经有很多黑客写出了各种各样的 quine 程序，因此我就不再班门弄斧了。
但是，既然我博客的[关于页面](http://justjavac.com/about-v2.html)都已经折腾出升级版了，那么我们就再折腾一个 quine++ 出来。

quine 程序的升级版——动态的 quine。

<iframe width="100%" height="300" src="http://jsfiddle.net/justjavac/RN2PL/embedded/js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

点此查看对比版：<http://jsfiddle.net/justjavac/RN2PL/> **注意输出结果的红字部分**

通过查看源代码的几个 javascript 关键字可以看出：

* `setInterval` 和 `Date` 用来做动态效果
* 他自己输出了自己，而且 `Date` 还是动态的：

	```javascript
	s = ( "setInterval(z='" // 外层代码
		  + z.replace(/[\\\']/g,"\\$&") // COOL
		+ "\')" ) // 赋值结束
		.match(/.{1,37}/g).join("\\\n"); // 组装
	```

* 输出到 `document.body.innerHTML`，并用 `<pre>` 标签包围起来
* 动态替换字符串的一部分。

最后在附赠一个，这个其实不能算是严格的 quine 程序：可以[滚动的地球仪](http://segmentfault.com/q/1010000000318477)：

<iframe width="100%" height="300" src="http://jsfiddle.net/justjavac/KbetG/embedded/js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>