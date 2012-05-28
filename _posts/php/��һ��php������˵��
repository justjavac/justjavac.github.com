---
layout: post
title: 从一道php面试题说起
description: 总的来说，程序员算是英语水平比较好的群体，因为在这个行业，英文资料是最全面、最及时、需求也最迫切的。因此，据我观察，即便刚入门不久的程序员，面对陌生的问题，一般也能查阅英文文档，找到需要的信息。
keywords: php, cookie, 面试
category : php
tags : [php, 面试]
---

面试题目：

    setcookie(‘name’,'test');
    echo $_cookies['name'];

请说出程序结果（能说出第一次与第二次的区别者加分）

本来一开始我认为不就是设置一个cookie，然后读出来的问题，但是被那个后面的提示搞迷惑了从来没有想过这样的问题。
面试的时候也没有想出答案，后来在面试官的指点下搞清楚了。

答案：

1. 第一次为空;
2. 第二次输出 test.

解释：**cookies是保存在客户端的，服务器要想获得cookie必须是客户端通过http的header传递给服务器**。

* 第一次：首先设置一个cookie值，然后读取cookie值（由于第一次客户端没有传递cookie给服务器），没有cookie值
* 第二次：cookie值传递给了服务器，就读出来了

在面试官的指点后，我才想起来了之前有项目的bug与这个有关，但是换个方法避开了。

碰巧这几天看php手册看到了setcookie中有这样一段代码：

    <?php
    // set the cookies
    setcookie("cookie[three]", "cookiethree");
    setcookie("cookie[two]", "cookietwo");
    setcookie("cookie[one]", "cookieone");

    // after the page reloads, print them out
    if (isset($_COOKIE['cookie'])) {
        foreach ($_COOKIE['cookie'] as $name => $value) {
            $name = htmlspecialchars($name);
            $value = htmlspecialchars($value);
            echo "$name : $value <br />\n";
        }
    }
    ?> 

    亮点
    // after the page reloads, print them out

我想这个提示太低调了，我想我们很多人在在调试

    setcookie(‘name’,'test');
    echo $_cookies['name'];

第一次没有值，然后刷新一下出来了，就以为没问题了，就不想这个问题是为什么。

都说手册很重要，但是手册这么多东西，你能保证你看手册的时候就一定会注意到这个地方的代码。
于是我很好奇，面试官是在什么情景下遇到这个问题的，于是问了一下面试官，得到了以下回答：

> 呵呵，[认证](http://justjavac.com/2012/04/13/can-you-do-the-login-function-on-the-web "你会做Web上的用户登录功能吗")应该算所有web项目的最开始，也是最重要的一个环节。 
> 所以，对认证这块，需要很熟悉。

这个问题主要是考COOKIE是什么时候被服务端发往浏览器， 浏览器又是什么时候传递给服务器的。 

确实如果从这个角度出发，就有可能发现这个问题。然后面试官也说，他也才知道手册上有这个东西。

最后确实手册很重要，但是也太低调了，如果你发现手册中类似如此低调的问题，请分享一下，我也准备收集一下手册中低调的问题。
