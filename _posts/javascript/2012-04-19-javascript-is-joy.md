---
layout: post
title: javascript 是一门令人愉悦的语言
description: javascript 是一门令人愉悦的语言
keywords: javascript, web
category : javascript
tags : [javascript, web]
---

作为一名前端工程师，我承认我可能是有偏见的，但是我真的非常享受编写 javascript 程序。

javascript 代码可以 [非常的优雅][1]，也可以让人 [崩溃][2]。在很长一段时间内 js 在开发者社区中都是一个笑话。

[1]: https://justjavac.com/javascript/2012/04/05/can-your-programming-language-do-this.html
[2]: https://justjavac.com/javascript/2012/04/05/javascript-syntax-trap.html

但是现在 js 是一门聚光灯下的明星语言，越来越多的开发者加入到这个阵营。

这篇文章例举了几个我喜欢 js 的理由。

## 速度

Google 的 V8 js 引擎让我们可以在客户端和服务端更好的执行 js 代码，这就给复杂的 js 程序提供了基础。

我们现在可以发送几百KB的压缩后的 js 代码到客户端，并且可以预期客户端可以流畅的执行这些代码。

除此以外，js 也是非常容易编写和测试的。编写-保存-刷新，简单三个步骤就可以看到效果，这比任何其他开发环境都要快速。

我们现在也有 webkit 控制台和调试器，可以帮助我们方便的调试代码。

我最近也在尝试使用 Jasmine 来做单元测试。

## 简单

js 是一门非常轻量级的语言，没有大量复杂的保留字，没有各种复杂的数据类型。json已经成为了流行的数据传输格式。js 也是 Web 浏览器的本地语言，还有很多工具支持，几乎不用任何安装工作。

## 自由

也许是 js 框架的作者希望把代码尽量精简，或者他们只是默认事情就应该保持简单，我发现所有js的框架都没有很强的侵入性，不像 Rails，Rjango，CakePHP那样必须按照约定的格式去写代码。

流行的 js 框架例如 jQuery, Underscore.js, Backbone.js 的代码是完全可读，并且很专注，而且他们的设计是可以互相整合的。

## 可塑性

删除代码是一个很幸福的过程，因为它减少了复杂性，修复了bug，缩减了代码量。所以我很享受删除自己写的垃圾代码的过程。

由于页面的重新设计或者需求的变化，前台代码天然具有短生命周期。模块化是浏览器端js的天然属性，这让我可以重构一个组件而不用把所有的代码都搞的一团糟。