---
layout: post
title: Javascript 的兴起是否意味的 LAMP 的灭亡
description: 三个月前，我们决定废弃仪表盘选用的框架：Python 的 Django，并用 Node.js（服务器端的 Javascript）重新构建了框架。鉴于LAMP堆栈已经死亡，我们才做出了这个决定。
keywords: javascript, LAMP
category : javascript
tags : [javascript, LAMP]
---

Metamarket 的 CTO Mike Driscoll 最近发表了一篇[略带煽动性的帖子，讨论了 Web 应用的架构(英文)][1]。
他认为 Node.js 等框架预示着 LAMP 的终结。

> 三个月前，我们决定废弃仪表盘选用的框架：Python 的 Django，并用 Node.js（服务器端的 Javascript）重新构建了框架。
> 鉴于 LAMP 堆栈已经死亡，我们才做出了这个决定。

Mike 认为 Web 有三个阶段：

> * 1991-1999：HTML 时代——这是个文档的时代。
> * 2000-2009：LAMP 时代——使用数据库的时代。
> * 2010-??：Javascript 时代。Javascript 时代是事件流的时代。
> 
> **现代的 Web 页面已经不再是页面了，它们都是事件驱动的应用，信息会通过这些应用流转**。

他解释道：

> LAMP 架构已经死了，因为对于响应里的 Mashup，很少有应用愿意把全部的有效负载转移到很小的事件上去；
> 他们只想用 Javascript 更新 DOM 的一个片段。
> AJAX 做到了这一点，但如果服务器端的LAMP模板有 10% 的 HTML 和 90% 的 Javascript，这么做显然是不对的……

Mike 认为，**服务器的主要作用就是带着数据（JSON）把应用发送到客户端（Javascript），并让客户端从中构造 UI**。
服务器的次要作用则是监听处理事件的流，并有效地把响应推回客户端，
这些事件可能是一次新的编辑、一条消息、或是 Ticker 发生了变化。

一些人对此发表了评论：

Bruce Atherton 赞成 Mike 的观点，但他认为事件并不会通过 HTTP 来流转：

> Websockets 和 SPDY 将会接管这方面的处理，因为和 HTTP 相比，它们更合适这个任务。

Chase Sechrist 已经在很多地方使用了 Node.js，即便如此，他仍然列举了一些对 Node.js 的担忧：

> 你还需要知道一些高级知识，比如竞态条件的调试方法、事件循环的工作原理，甚至在递归回调导致栈溢出时，调用堆栈的处理方式。
> 正因为如此，对那些写了二十年 C 的人、还有刚开始编程的初级工程师来说，控制流还是非常奇怪、令人费解的。

“Jorjun” 指出，以现在的变化速度来看，即使 Javascript 这个新的架构是合理的，它也不会太持久：

> 两年之内会有一种更高效的方式对宝贵的 IP 进行编码。
> 需要注意的是，新的方式正在出现，Java 对它们没有任何意义——这些方式在九十年代末还没有出现。
> Javascript 的愚蠢名副其实。
> 它有大括号、奇怪的 Fudgery、极其恼人的 Artefact，对我这样的老学究来说，Javascript 看起来轻率、讨厌、太复杂而容易混淆。

NOLOH 的联合创始人 Asher Snyder 认同帖子的前提条件：“**Web 应该、也正在转向事件**。”
但并不相信 Javascript 能引领方向。
他认为“我们正在走向一个平台或统一语言的时代，因为只有平台或统一语言才能让快速开发真正处理好 Web 的疯狂”。

Subbu Allamaraju 最近发布了[Node.js和Play的一些性能对比数据(英文)][2]，InfoQ 和他简单讨论了一下：

> 就个人而言，我发现 Node.js 和 Play 等框架让 Web 开发人员觉得很兴奋，因为它们带来了一些新的思想。
> 在 Web 框架领域，特别是在 Java 端，这样的简单性已经很久违了。
> 尤其是 Play，它在 Netty 之上，而不是传统的 Servlet 框架，是一个很不错的选择。

Web 应用架构的演进确实很快。
由于 Web 应用变得越来越“厚重”，特别是在事件驱动的世界里，人们只能思考 REST 还剩下什么，看来我们要回到最初开始的地方了。
最近我们确实没怎么听说有关 REST 及其统一接口的消息，还有它怎样成功改变Web应用架构的相关内容。
你对 Web 应用架构的未来持什么观点呢？ 你怎么看 Javascript 成为主流的编程语言？

查看英文原文：[Will the Rise of Javascript Mean the End of LAMP?][3]

[1]: http://metamarketsgroup.com/blog/node-js-and-the-javascript-age/
[2]: http://www.subbu.org/blog/2011/03/nodejs-vs-play-for-front-end-apps
[3]: http://www.infoq.com/news/2011/04/javascript-lamp
