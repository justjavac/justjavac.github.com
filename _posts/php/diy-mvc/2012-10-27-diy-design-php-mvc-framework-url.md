---
layout: post
title: 自己动手设计 PHP MVC 框架（一）——URL
keywords: php, MVC, 自己动手
category: php
tags: [php, MVC]
---

在框架盛行的今天，MVC 也不再是神话。
经常听到很多程序员讨论哪个框架好，哪个框架不好，
其实 **框架只是工具，没有好与不好，只有适合与不适合，适合自己的就是最好的。**

每次我面试应届生时都会问他使用过什么框架，并谈谈对这些框架的理解。
当面试有经验的程序员时，会让他自己写一个框架出来。
其实也不是让他编码，只要有思路就 OK 了。
我觉得，如果一个有一年经验的程序员连一个 Framework v0.0.1 都开发不出来的话，肯定是没有深入理解一个框架。

前几天 @phoenixg 说要自己写个 MVC 框架。
而且他也确实不仅仅是说说而已，短短一个周末，这个框架雏形就神奇的出现在了 [github](https://github.com/phoenixg/phx) 上。

这篇博文的名字是『自己动手<strong>设计</strong> PHP MVC框架』，
所以本文不会涉及太多的编码，文中出现的任何代码片段都是我直接在 vim 里面敲的，
没做任何测试，如果想使用文中代码需自行测试。

跟随本教程，将从零开始设计一个属于自己的 MVC 框架。

我使用过 ZendFramwork、CodeIgniter，每个框架都有自己的优点和不足。
在写本文之前，我又看了 Symfony、cakephp、MooPHP、doitphp 等的核心源码，
下面说说我将把我的框架设计成什么样子，这一章主要讨论 URL 的设计。

## 1. REST

在这个 REST 横行的时代，如果一个框架不支持 REST，肯定被<strong>前卫程序员</strong>所瞧不起，所以本框架也要支持 REST。

第一个设计准则： **所有东西都是资源，资源有多种表现形式**。

不管实际上存在的，还是抽象上的，
所有资源都会有一个不变的标识（ID），对资源的任何 API 操作都不应该改变资源的标识。

事实上，上面的这些完完全全是按照互联网的特性提出来的。

* 互联网中，一个 URL 就是一个资源；
* 资源的内容就是 HTML 页面；
* 不管怎么改 HTML 内容，URL 都不会改变；
* 资源之间通过 HTML 里的连接联系起来；
* 每次获取的时候，获取到的都是完整的 HTML 内容。

比如

    GET http://justjavac.com/users         // 所有用户
    GET http://justjavac.com/users/phper   // 标识为phper的用户

## 2. 扩展名

在此我不讨论扩展名和文件类型之间的关系，以及“扩展名只是约定，而文件类型记录在文件头”。

我通常把扩展名理解为“约定”，而不是文件类型。
当我们请求一个 news.html 时，我们并不能确信它就是一个存在于服务器上的news.html文件，
它也可能是php文件，也可能是jsp文件，在nodejs流行的今天，它也可能是一个js文件。
但不管页面是如何生成的，有一点是明确的——最终我们得到了一个html文档。

虽然rest不要求使用扩展名，但有人告诉我，如果在一个女生名字后面加一个.rmvb 的扩展名，将变得非常……因此本框架将支持扩展名，但是扩展名并是资源的一部分。

什么意思呢？

还是前面的例子，所有用户这个资源该如何表示呢？
用 url `http://justjavac.com/users` 就可以唯一标识，
而 **扩展名可以用来标识资源的不同表现形式**。

a、当我们请求 `http://justjavac.com/users` 时，框架将返回一个html文档，
数据可能在表格中，也可能在 form 中，也可能在 div 中（如下图）。

![table of users](/assets/images/diy-design-php-mvc-framework-url-users.png "table of users")

b、当我们请求 `http://justjavac.com/user.json` 时，将返回 json 格式数据。

    [
        {
            "firstName" : "just",
            "lastName" : "javac",
            "userName" : "@justjavac"
        },
        {
            "firstName" : "Tom",
            "lastName" : "Cat",
            "userName" : "@tomcat"
        },
        ……
    ]

c、当我们请求 `http://justjavac.com/user.xml` 时，
将返回 xml 格式的数据，xml 文档可由 DTD 或者 XSD 定义。

d、如果我们想把所有用户的列表发给管理员，或者打印出来呢？

可以直接访问 `http://justjavac.com/user.xls`，框架将会返回 Excel 电子表格。
当我们高高兴兴把文件下载下来，却发现电脑没有安装 Excel，怎么办？
没关系，我们还可以访问 `http://justjavac.com/user.jpg`，毕竟看图工具我们还是有的。

用过 Google 短网址服务的同学都知道，
比如我的网站 `http://justjavac.com` 的短网址是 `http://goo.gl/JMQJ8`，
Google 还提供了二维码表示法，只需要在后面添加 .qr 例如 `http://goo.gl/JMQJ8.qr`。

总之，**不管用了什么扩展名，将返回同一个资源，只是表现形式不同罢了**。
这也就是经常所说的 **数据 + 模板 = 输出**。

如果没有扩展名呢？返回 HTML 文档？

别忘了 http 请求的 Accept。
设置请求头的 `Accept: application/x-excel` 我们依然可以得到一个电子表格。

甚至当我们访问某个用户时， `http://justjavac.com/user/justjavac`，我们可以使用 `Accept: text/x-vcard`，如果不知道嘛意思，自己Google去。

![justjavac.vcard](/assets/images/diy-design-php-mvc-framework-url-vcard.png "justjavac.vcard")

下面说说设计模式，在这个功能上，可以用一个适配器模式，**根据不同的扩展名选择不同的适配器，执行不同的功能，最后提供相同的接口**，具体实现就不多说了。

## 3. 多语言支持

**@TODO** 多语言支持的 url 结构设计

## 4. 充分利用 HTTP

和请求有关的错误和其他重要的状态信息怎么办呢？

简单，使用 HTTP 的状态码！
通过使用 HTTP 状态码，你不需要为你的接口想出 error/success 规则，它已经为你做好。

比如：假如一个消费者提交数据（POST）到 `/api/users`，

* 你需要返回一个成功创建的消息，此时你可以简单的发送一个 201 状态码（201=Created)。
* 如果失败了，服务器端失败就发送一个 500（500=内部服务器错误），
* 如果请求中断就发送一个 400（400=错误请求）。
* 也许他们会尝试向一个不接受 POST 请求的接口提交数据，你就可以发送一个 501 错误（未执行）。
* 又或者你的 MySQL 服务器挂了，接口也会临时性的中断，发送一个503错误（服务不可用）。

幸运的是，你已经知道了这些，假如你想要了解更多关于状态码的资料，可以在维基百科上查找。 

HTTP 支持客户端缓存，在HTTP响应里利用 Cache-Control，Expires，Last-Modified 三个头字段，
我们可以让浏览器缓存资源一段时间。

REST 也可以利用这些头，告诉客户端在一定时间内不需要再次请求资源。
这对提高性能有很大好处。Expires、Last-Modified 以及 ETag 可以通过资源的属性提供，这个在有关 Model 层的设计中再详细介绍。

## 5. 测试与调试

PHP 的灵活使得自动化测试或者 TDD 变得困难，至少和 Java 比就差了好大一截。
在框架中，将很自由的开启调试，比如我的设计是通过添加 url 参数：

    http://justjavac.com/user/justjavac?DEBUG=2
    
通过添加 DEBUG 参数告诉框架开启调试模式，后面的参数值是调试的级别 level。
类似的，你也可以加入 LOG 参数来启动日志。

这样设计还有一个好处就是，不需要修改配置文件，而且还可以 **针对某一个页面来开启或者关闭**。
当我用 CI 时，每次我发现程序中的问题，都在配置文件中将 log 级别设置为 all，
再重新打开页面，当我再看 log 文件时，居然已经几百行了，因为我访问的每个页面都被记录到了日志里面。

测试和 url 好像没有多大关系，测试放在单独的章节讨论。
我为测试约定的 url 是添加 test，比如为控制器 justjavac.controller.php 写的测试用例（Test Case）可以通过 `http://justjavac.com/test/user/justjavac` 访问。

但我还是比较喜欢在命令行测试，毕竟当你手动点击浏览器，并手动输入 url，
手动敲回车键时，已经违背了 **自动化测试**。

## 6. Ajax

**@TODO** 应用于单页 Ajax 的 url 结构设计
