---
layout: post
title: 反for-if编程模式
description: 这些年来，我看到过大量的反编程模式。我感觉应该向大家分享一些。今天，我要介绍的是被我称作反for-if编程模式的反模式，也就是人们所说的”我们卖给你整个座位，但你需要的只是一个边。”
keywords: 编程, for, if
category : other
tags : [编程]
---

这些年来，我看到过大量的反编程模式。我感觉应该向大家分享一些。

今天，我要介绍的是被我称作反for-if编程模式的反模式「如果感兴趣可以查看一下这篇文章：[for 循环为何可恨？](http://justjavac.com/other/2012/05/15/whats-wrong-with-the-for-loop)」，也就是人们所说的”我们卖给你整个座位，但你需要的只是一个边。”

这是一个特殊的反for-case模式，其中所有的情况中只有一次会是null。

    for (int i = 0; i < 100; i++) {
      if (i == 42) { do_something(i); }
    }

这种情况可以简单的写成

    do_something(42);

这个反for-if模式可以表现成各种各样的形式。比如：

    foreach (string filename in Directory.GetFiles("."))
    {
        if (filename.Equals("desktop.ini", StringComparison.OrdinalIgnoreCase))
        {
            return new StreamReader(filename);
        }
    }
    
它是在一个目录里遍历查找一个指定文件，如果找到了，就返回文件的数据流。这段代码的一种不是那么折腾的写法是

    if (File.Exists("desktop.ini"))
    {
        return new StreamReader("desktop.ini");
    }

请注意，两个版本的代码片段具有相同的竞争条件：如果这个desktop.ini本来是存在的，但在你创建Stream­Reader之前被删掉了，
你就会得到一个File­Not­Found­Exception错误。

再举一个例子：

    foreach (object o in hashtable.Keys)
    {
        if (o == "target") return hashtable["target"];
    }

等同于

    return hashtable["target"];

我猜测这些家伙不喜欢在图书馆里通过书名找一本书，因为他们的做法是如此的繁琐：

他们来到图书馆里员面前说，“把你所有的书都给我，”然后他们拿着装满了上千本书的篮子，坐到墙角里自言自语：

“不是，这本书的书名不对”，

“不是，这本也不是”，

“标题还是不对。”

“这本书呢？”

”不是，也不是这本。“

”老天，我要这样一本一本翻到什么时候…“
