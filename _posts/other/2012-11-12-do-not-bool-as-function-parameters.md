---
layout:     post
title:      千万不要把 bool 当成函数参数
keywords: 参数,函数
category : other
tags : [参数,函数]
---

我们有很多 Coding Style 或 代码规范。
但这一条可能会经常被我们所遗忘，就是我们 **经常会在函数的参数里使用bool参数，这会大大地降低代码的可读性**。
不信？我们先来看看下面的代码。

当你读到下面的代码，你会觉得这个代码是什么意思？

	widget->repaint(false);

是不要 repaint 吗？还是别的什么意思？

看了文档后，我们才知道这个参数是 immediate，也就是说，false 代表不立即重画，true 代码立即重画。

Windows API 中也有这样一个函数：InvalidateRect，当你看到下面的代码，你会觉得是什么意思？

	InvalidateRect(hwnd, lpRect,  false);

我们先不说 InvalidateRect 这个函数名取得有多糟糕，我们先说一下那个 false 参数？
invalidate 意为 “让XXX无效”，false 是什么意思？
双重否定？
是肯定的意思？

如果你看到这样的代码，你会相当的费解的。
于是，你要去看一下文档，或是 InvalidateRect 的函数定义，
你会看到那个参数是 BOOL bErase，意思是：“是否要重画背景”。

这样的事情有很多，再看下面的代码，想把 str 中的 ”%USER%” 替换成真实的用户名：

	str.replace("%USER%", user, false);   // Qt 3

TNND，那个 false 是什么意思？不替换吗？还是别的什么意思？

看了文档才知道，false 代表： “大小写不敏感的替换”。

其实，如果你使用枚举变量/常量，而不是 bool 变量，你会让你的代码更易读，如：

	widget->repaint(PAINT::immediate);
	widget->repaint(PAINT::deffer);

	InvalidateRect(hwnd, lpRect, !RepantBackground);

	str.replace("%USER%", user, Qt::CaseInsensitive); // Qt 4

如果对这个事不以为然的话，我们再来看一些别的示例，你不妨猜猜看看下面的代码：

	component.setCentered(true, false);

这什么玩意儿啊？

看了文档你才知道，这原来是 setCentered(centered, autoUpdate);

	new Textbox(300, 100, false, true);

这又是什么啊？

看了文档才知道，这是创建一个文本框，第三个参数是：“是否要滚动条”，第四个是：“是否要自动换行”。TNND！

这种情况还不算最差，看看下面的双重否定。

	component.setDisabled(false);
	filter.setCaseInsensitive(false)

再来一个，如果你读到下面的代码，相信你会和我一样，要么石化了，要么凌乱了。

	event.initKeyEvent("keypress", true, true, null, null,
						false, false, false, false, 9, 0); 

看完这篇文章，我希望你再也 **不要把bool为作为函数参数了**。除非两个原因：

* 你 100% 确认不会带来阅读上的问题，比如 Java 的 `setVisible (bool)`. 
* 你 100% 确认你想去 [写出迷一样的代码](http://justjavac.com/codepuzzle/2012/09/25/codepuzzle-introduction.html)。 

如果你想设计一个好的 API，强烈推荐你读一下 Nokia 的 Qt 的《API Design Principles》，本文就是其中的 “Boolean Trap”。

文章来源：<http://coolshell.cn/articles/5444.html> 
