---
layout: post
title: 现在就使用HTML5的十大原因
description: 现在就使用HTML5的十大原因
keywords: html5,
category : html5
tags : [html5]
---

你难道还没有考虑使用HTML5？
当然我猜想你可能有自己的原因；
它现在还没有被广泛的支持，在IE中不好使，或者你就是喜欢写比较严格的XHTML代码。
HTML5是Web开发世界的一次重大的改变，事实上不管你是否喜欢，它都是代表着未来趋势。
其实HTML5并不难理解和使用。我们这里能列出许多原因为什么现在要开始使用HTML5。

目前有很多的文章介绍使用HTML5并且介绍了使用它的优势和好处，没错，我们这篇文章也类似。
随着更多这样的文章，以及Apple的支持，Adobe围绕HTML5的产品开发，以及移动flash的死亡，
如此多网站的支持，我想对那些仍旧没有或者不想接受它的人说一些话。
我认为主要得原因是，它看起来像一个神秘的东西。
很多感觉它像喷气背包或者飞行汽车。
一个未经验证的非凡想法但是并不实际。
但是事实上现在已近非常的实际了。

为了解密HTML5并且帮助顽固的开发设计人员，我这里写了列出了使用HTML5的几大原因，希望对大家有帮助！

## 第十大原因：易用性

两个原因使得使用HTML5创建网站更加简单：
语义上及其ARIA。
新的HTML标签像`<header>，<footer>，<nav>，<section>， <aside>`等等，使得阅读者更加容易去访问内容。
在以前，即使你定义了class或者ID你的阅读者也没有办法去了解给出的一个div究竟是什么。
使用新的语义学的定义标签，你可以更好的了解HTML文档，并且创建一个更好的使用体验。

ARIA是一个W3C的标准主要用来对HTML文章中的元素指定“角色“，
通过角色属性来创建重要的页面地形, 例如`header`，`footer`，`navigation`或者`aritcle`很有必要。
这一点曾经被忽略掉了并且没有被广泛使用，因为事实上并不验证。
然而，HTML5将会验证这样属性。
同时，HTML5将会内建这些角色并且无法不覆盖。
更多的HTML5和ARIA讨论，请大家查看[这里](http://www.w3.org/WAI/intro/aria)。

## 第九大原因：视频和音频支持

忘了flash和其它第三方应用吧，让你的视频和音频通过HTML5标签`<video>`和`<audio>`来访问资源。
正确播放媒体一直都是一个非常可怕的事情，你需要使用`<embed>`和`<object>`标签，
并且为了它们能正确播放必须赋予一大堆的参数。
你的媒体标签将会非常复杂，大堆得令人迷惑的代码。
而且HTML5视频和音频标签基本将他们视为图片：`<video src=""/>`。

但是其它参数例如宽度和高度或者自动播放呢？
不必担心，只需要像其它HTML标签一样定义：

    <video src="url" width="640px" height="380px" autoplay/>。

实际上这个过长非常简答，然而我们的老浏览器可能并不喜欢我们的HTML5，
你需要添加更多代码来让他们正确工作。

但是这个代码还是比`<embed>`和`<object>`来的简答的多。

    <video poster="myvideo.jpg" controls>
     <source src="myvideo.m4v" type="video/mp4" />
     <source src="myvideo.ogg" type="video/ogg" />
     <embed src="/to/my/video/player"></embed>
    </video>

这里有些资源值得你查看一下：

[使用最简单的方式：HTML5的视频](http://www.gbin1.com/)

## 第八大原因：Doctype

没错，就是doctype，没有更多内容了。
是不是非常简答？不需要拷贝粘贴一堆无法理解的代码，也没有多余的head标签。
最大的好消息在于，除了简单，它能在每一个浏览器中正常工作即使是名声狼藉的IE6。

## 第七大原因：更清晰的代码

如果你对于简答，优雅，容易乐队的代码有所偏好的话，HTML5绝对是一个为你量身定做的东西。
HTML5允许你写出简单清晰富于描述的代码。
符合语义学的代码允许你分开样式和内容。

看看这个典型的简单拥有导航的heaer代码：

    <div id="header">
     <h1>Header Text</h1>
     <div id="nav">
      <ul>
       <li><a href="#">Link</a></li>
       <li><a href="#">Link</a></li>
       <li><a href="#">Link</a></li>
      </ul>
     </div>
    </div>

是不是很简单？但是使用HTML5后会使得代码更加简单并且富有含义：

    <header>
     <h1>Header Text</h1>
     <nav>
      <ul>
       <li><a href="#">Link</a></li>
       <li><a href="#">Link</a></li>
       <li><a href="#">Link</a></li>
      </ul>
     </nav>
    </header>

使用HTML5你可以通过使用语义学的HTML header标签描述内容来最后解决你的div及其class定义问题。
以前你需要大量的使用div来定义每一个页面内容区域，
但是使用新的 `<section>`，`<article>`，`<header>`，`<footer>`，`<aside>`和`<nav>`标签，
需要你让你的代码更加清晰易于阅读。

[HTML5和未来的网络](http://www.gbin1.com/technology/html/20111205top10reasonstousehtml5rightnow/index.html)

## 第六大原因：更聪明的存储

HTML5中最酷的特性就是本地存储。
有一点像比较老的技术cookie和客户端数据库的融合。
它比cooke更好用因为支持多个windows存储，它拥有更好的安全和性能，即使浏览器关闭后也可以保存。
因为它是个客户端的数据库，你不用担心用户删除任何cookie，并且所有主流浏览器都支持。

本地存储对于很多情况来说都不错，它是HTML5工具中一个不需要第三方插件实现的。
能够保存数据到用户的浏览器中意味你可以简单的创建一些应用特性例如：保存用户信息，缓存数据，加载用户上一次的应用状态。

## 第五大原因：更好的互动

我们都喜欢更好的互动，我们都喜欢对于用户有反馈的动态网站，用户可以享受互动的过程。
输入`<canvas>`，HTML5的画图标签允许你做更多的互动和动画，就像我们使用Flash达到的效果。

除了`<canvas>`，HTML5同样也拥有很多API允许你创建更加好的用户体验并且更加动态的web应用程序。
这里有一个列表：

*     Drag and Drop (DnD)
*     Offline storage database
*     Browser history management
*     document editing
*     Timed media playback

## 第四大原因：游戏开发

没错，你可以使用HTML5的`<canvas>`开发游戏。
HTML5提供了一个非常伟大的，移动友好的方式去开发有趣互动的游戏。
如果你开发Flash游戏，你就会喜欢上HTML5的游戏开发。

Script-tutorials目前提供了4个不部分的HTML5游戏开发教程，这里看看他们开发的有趣游戏：

* [HTML5 Gaming Development Lesson One](http://www.script-tutorials.com/html5-game-development-lesson-1/)
* [HTML5 Gaming Development Lesson Two](http://www.script-tutorials.com/html5-game-development-lesson-2/)
* [HTML5 Gaming Development Lesson Three](http://www.script-tutorials.com/html5-game-development-lesson-3/)
* [HTML5 Gaming Development Lesson Four](http://www.script-tutorials.com/html5-game-development-lesson-4/)

## 第三大原因：遗留及其跨浏览器支持

你的现代流行浏览器都支持HTML5（Chrome，Firefox，Safari，IE9和Opera），
并且创建了HTML5 doctype这样所有的浏览器，即使非常老非常令人厌恶浏览器像IE6都可以使用。
但是因为老的浏览器能够识别doctype并不意味它可以处理HTML5标签和功能。
幸运的是，HTML5已经使得开发更加简单了，更多支持更多浏览器，
这样老的IE浏览器可以通过添加javascript代码来使用新的元素：

    <!--[if lt IE 9]>
     <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->


* [HTML5 & CSS3 READINESS](http://html5readiness.com/)
* [When can I use](http://caniuse.com/)
* [HTML5 Cross Browser Polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills)
* [Modernizr](http://www.modernizr.com/)

## 第二大原因：移动，移动还是移动

你可以称之为“直觉"，但是我认为移动技术将会变得更加的流行。
我知道，这里有些非常疯狂的猜测，有些可能你也想到了-Mobile是一个时尚！移动设备将占领世界。
更多的接受移动设备将会增长的非常迅速。这意味着更多的用户会选择使用移动设备访问网站或者web应用。
HTML5是最移动化的开发工具。随着Adobe宣布放弃移动flash开发，你将会考虑使用HTML5来开发webp应用。

当手机浏览器完全支持HTML5那么开发移动项目将会和设计更小的触摸显示一样简单。
这里有很多的meta标签允许你优化移动：

viewport:允许你定义viewport宽度和缩放设置
全屏浏览器：ISO指定的数值允许Apple设备全屏模式显示
Home screen icons：就像桌面收藏，这些图标可以用来添加收藏到IOS和Android移动设备的首页

* [Mobile HTML5](http://mobilehtml5.org/)
* [Mobile Boilerplate](http://html5boilerplate.com/mobile)
* [HTML5 Mobile Web Applications](http://teamtreehouse.com/library/projects/html5-mobile-web-applications)

## 第一大原因： 它是未来，开始用吧！

最大的原因今天你就开始使用HTML5是因为它是未来，不要掉队了！
HTML5不会往每个方向发展，但是更多的元素已经被很多公司采用，并且开始着手开发。
HTML5其实更像HTML，它不是一个新的技术需要你重新学习！
如果你开发XHTMLstrict的话你现在就已经在开发HTML5了。
为什么不更完整的享受HTML5的功能呢？

你实际上没有任何借口不接受HTML5。
事实上我唯一一个原因使用HTML5是因为它书写代码简单清晰。
其它的特性其实我也没有真正使用。
你可以考虑现在开始使用HTML5书写代码，它能帮助你改变书写代码的方式及其设计方式。
开始用HTML5代码编写web应用吧，说不定下一个移动应用或者游戏应用就是用HTML5开发的！

分享一些不错的HTML5资源：
* <http://html5doctor.com>
* <http://html5rocks.com>
* <http://html5weekly.com>
* <http://www.remysharp.com>
* <http://www.script-tutorials.com>

英文出自：<http://tympanus.net/codrops/2011/11/24/top-10-reasons-to-use-html5-right-now/>

