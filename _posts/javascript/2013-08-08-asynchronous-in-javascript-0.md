---
layout: post
title: JavaScript 中的异步梳理（0）
keywords: javascript, asynchronous
category : javascript
tags : [javascript, asynchronous]
---

原文：[JavaScript 中的异步梳理（0）](http://jimliu.net/?p=12)

作者：[JimLiu](http://jimliu.net)

----------------------------------------------------

JavaScript 中有大量异步操作，首先可以看看 JS 中什么东西会产生异步（这里先只考虑浏览器里的情况）：

- Ajax（XMLHttpRequest）
- Image Tag，Script Tag，iframe（原理类似）
- setTimeout/setInterval
- CSS3 Transition/Animation
- postMessage
- Web Workers
- Web Sockets
- and more…

实际上在我自己的理解中，**任何「在未来不确定的时间发生」的事情都可以理解为异步**，因此各种 DOM 事件也可以用类似的方式去理解和处理。

异步是JS中的重要话题，Ajax 和 Node.JS 出现以后更是让 JS 中的异步编程提升到了一个前所未有的高度。

但是对于异步+回调①的模式，当需要对一系列异步操作进行流程控制的时候似乎必然会面临着回调嵌套。
因此怎么把异步操作「拉平」，用更好的方法去优化异步编程的体验，同时也写出更健壮的异步代码，是这两年来前端圈子里很火的话题。

我大概总结一下，对异步操作的优化，总的来说有3种流派：

1. 消息驱动——代表：[@朴灵][1] 的 [EventProxy][2]
2. Promise模式——代表：[CommonJS Promises][3]，[jQuery][4]，[Dojo][5]
3. 二次编译——代表：[@老赵][6] 的 [Jscex][7]

[1]: http://weibo.com/shyvo
[2]: https://github.com/JacksonTian
[3]: http://wiki.commonjs.org/wiki/Promises
[4]: http://www.jquery.com
[5]: http://dojotoolkit.org
[6]: http://weibo.com/jeffz
[7]: https://github.com/JeffreyZhao/jscex

这个系列将会分别介绍这三种模式，以及我本人根据自身需要对它们进行的取舍。其中 1 和 2 会是重点。

**目录**：

1. [JavaScript 中的异步梳理（1）——使用消息驱动](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-1-message-driven.html)
2. [JavaScript 中的异步梳理（2）——使用 Promises/A](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-2-promises-a.html)
3. [JavaScript 中的异步梳理（3）——使用 Wind.js](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-3-windjs.html)

①：异步不一定非要回调，比如 jscex 就用了一种非常巧妙的二次编译方式来让代码可以「顺序编写、异步执行」，不再需要无尽的回调。