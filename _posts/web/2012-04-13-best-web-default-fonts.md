---
layout: post
title: 最佳 Web 中文默认字体
keywords: web, 字体, css
category : web
tags : [web, 字体]
type: porter
---

作者：[@lifesinger](http://weibo.com/lifesinger)

----------------------------------------------------

最近淘宝网首页有个小小的 默认字体调整风波，中文默认字体远比我们想象中的复杂。以前主要关注 font-family 自身，忽略了 lang 属性和 charset 设置。今天做了个更详尽的测试：

<http://lifesinger.github.com/lab/2011/default-fonts/>

在不同操作系统下，用各个浏览器打开，特别是 Firefox 和 Opera，混乱的世界啊，真真的与浏览器斗，乐趣全无！

虽然沮丧悲情愤，但分析研究的工作还是得继续：

* lang, charset 和 font-family 都会对默认字体产生影响，规律很复杂。
* 浏览器偏好里的字体设置，对默认字体有直接影响，比如 WebKit 内核的 Chrome 浏览器。
* 宋体转成 “\5b8b\4f53” 也不能通吃所有浏览器。比如在 Mac OS 的 Chrome 中，只认识 simsun.
* <del>宋体其实是 serif 有衬线字体，后面跟 sans-serif, 逻辑上是错的。</del>
  （修正：并没有规定前面的 font name 要和最后的 general family 保持一致）
* 不同操作系统下，各个浏览器默认的 sans-serif 中文字体，一般都是最佳选择或用户已调整为最佳，不能强制用户都用宋体。

从目前用户反馈的情况来看，在以 12px 大小为主的网页设计中，**最佳的中文默认字体方案是：Windows 下用宋体，其他操作系统下用雅黑等无衬线字体**。未来随着电脑屏幕的变大和分辨率的提高，当字体的默认大小提高到 14px 以上时，或许所有操作系统下，最佳中文默认字体会统一为雅黑等无衬线字体。

为了让所有网页在尽可能多的情况下，都用最佳中文字体渲染，需要特别考虑以下几点：

* 在 Mac Chrome 等环境下，用 font-family: times, sans-serif 时，
  中文字体并不会根据 sans-serif 渲染，而是会根据 times 的 serif 属性，
  选择默认的 serif 中文字体来渲染。
  比如在 Mac Chrome 下，默认 serif 中文字体是很接近宋体的一个字体，比较难看。
  （修正：实际情况更为复杂，请参考评论中的讨论）
* 在 Firefox 中，只要 font-family 中有宋体，中文必然就用宋体展现。
  所以 font-family 中不能有宋体。
* 当 lang=“zh-CN”, charset=“utf-8” 时，
  font: arial 在 Mac Firefox 等环境下，默认中文字体是宋体。
* 在英文 Win7 下，只要 charset=“gbk”, 当 font-family 为 arial, sans-serif 时，
  <del>默认中文字体是很难看的 Microsoft Sans Serif Regular.</del>
  （修正：是 fallback 到了韩文字体 Dotum/Gulim（gulim.ttc）来显示，
  Dotum/Gulim 没有的字符最终会 fallback 到 SimSun，暂时不知道日文字体是否夹在中间。
  和 Microsoft Sans Serif 没有一点关系。）
* Opera 是个恐怖的世界，不要尝试分析其规律，最后测试一下就好。

可以总结出：

1. 如果页面 charset 是 utf-8, 完美的默认字体方案是：

	```css
	font-family: arial, sans-serif;
	```

  无论省略 lang 还是设置为 zh-CN, 在各种环境下都满足预期。

2. 如果页面 charset 是 gbk, 推荐默认字体方案为：

	```css
	font-family: arial;
	```

  Chrome OS 下未测试，根据陈成博客上的反馈，
  好像会因为没有 sans-serif 而导致中文字体很难看。
  不过考虑 Chrome OS 还未正式发布，目前可以先忽略。

最后，个人推荐简体中文页面的最佳实践为：

    html lang=zh-CN
    charset=utf-8
    font-family: arial, sans-serif;

测试环境说明：

    Mac OS X 10.6.7
    Chrome 10.0.648.204
    Firefox 4.0
    Safari 5.0.4
    Opera 11.01

    Win7 Ultimate
    IE 9.0.8080.16413

补充：

1. 关于字体的默认大小和行高等信息，推荐博文：[默认 Web 字体样式][1]
2. 关于字体的 fallback 等文本渲染信息，推荐博文：[浏览器如何渲染文本][2]

[1]: http://justjavac.com/web/2012/04/13/default-web-font-style.html
[2]: http://justjavac.com/web/2012/04/13/how-do-browsers-render-text.html