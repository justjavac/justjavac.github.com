---
layout: post
title: 避免常见的六种HTML5错误用法
description: 避免常见的六种HTML5错误用法
category : html5
tags : [html5]
---

原文链接请点击 [此处](http://html5doctor.com/avoiding-common-html5-mistakes/)，
作者为[Richard Clark](http://html5doctor.com/author/richc/).

本文为原创翻译，同时对原文做了一些简化处理。
本文遵循 [署名-非商业性使用协议](http://creativecommons.org/licenses/by-nc/2.5/cn/)。

## 一、不要使用section作为div的替代品

人们在标签使用中最常见到的错误之一就是随意将HTML5的`<section>`等价于`<div>`——具体地说，
就是直接用作替代品(用于样式)。

在XHTML或者HTML4中，我们常看到这样的代码：

    <!-- HTML 4-style code -->
    <div id="wrapper">
      <div id="header">
        <h1>My super duper page</h1>
        <!-- Header content -->
      </div>
      <div id="main">
        <!-- Page content -->
      </div>
      <div id="secondary">
        <!-- Secondary content -->
      </div>
      <div id="footer">
        <!-- Footer content -->
      </div>
    </div>
    
而现在在HTML5中，会是这样：

    <!-- 请不要复制这些代码！这是错误的！ -->
    <section id="wrapper">
      <header>
        <h1>My super duper page</h1>
        <!-- Header content -->
      </header>
      <section id="main">
        <!-- Page content -->
      </section>
      <section id="secondary">
        <!-- Secondary content -->
      </section>
      <footer>
        <!-- Footer content -->
      </footer>
    </section>
    
这样使用并不正确：*`<section>`并不是样式容器*。
section元素表示的是内容中用来帮助构建文档概要的语义部分。它应该包含一个头部。
如果你想找一个用作页面容器的元素(就像HTML或者XHTML的风格)，那么考虑如Kroc Camen所说，
直接把样式写到body元素上吧。
如果你仍然需要额外的样式容器，还是继续使用div吧。

基于上述思想，下面才是正确的使用HTML5和一些ARIA roles特性的例子（注意，
根据你自己的设计，你也可能需要加入div）

    <body>
      <header>
        <h1>My super duper page</h1>
        <!-- Header content -->
      </header>
      <div role="main">
        <!-- Page content -->
      </div>
      <aside role="complementary">
        <!-- Secondary content -->
      </aside>
      <footer>
        <!-- Footer content -->
      </footer>
    </body>
    
如果你还是无法确定使用哪种元素，那么我建议你参考[HTML5 sectioning content element flowchart](http://html5doctor.com/flowchart)

## 二、只在需要的时候使用header和hgroup

写不需要写的标签当然是毫无意义的。
不幸的是，我经常看到header和hgroup被无意义的滥用。
你可以阅读一下关于header和hgroup元素的两篇文章做一个详细的了解，
其中内容我简单总结如下：

*   header元素表示的是一组介绍性或者导航性质的辅助文字，经常用作section的头部
*   当头部有多层结构时，比如有子头部，副标题，各种标识文字等，
    使用hgroup将h1-h6元素组合起来作为section的头部

### header的滥用

由于header可以在一个文档中使用多次，可能使得这样代码风格受到欢迎：

    <!-- 请不要复制这段代码！此处并不需要header -->
    <article>
      <header>
        <h1>My best blog post</h1>
      </header>
      <!-- Article content -->
    </article>

如果你的header元素只包含一个头部元素，那么丢弃header元素吧。
既然article元素已经保证了头部会出现在文档概要中，而header又不能包含多个元素（如上文所定义的），
那么为什么要写多余的代码。简单点写成这样就行了：

    <article>
      <h1>My best blog post</h1>
      <!-- Article content -->
    </article>
    
### `<hgroup>`的错误使用

在headers这个主题上，我也经常看到hgroup的错误使用。
有时候不应该同时使用hgroup和header:

* 如果只有一个子头部
* 如果hgroup自己就能工作的很好。。。这不废话么

第一个问题一般是这样的：

    <!-- 请不要复制这段代码!此处不需要hgroup -->
    <header>
      <hgroup>
        <h1>My best blog post</h1>
      </hgroup>
      <p>by Rich Clark</p>
    </header>

此例中，直接拿掉hgroup，让heading果奔吧。

    <header>
      <h1>My best blog post</h1>
      <p>by Rich Clark</p>
    </header>

第二个问题是另一个不必要的例子：

    <!-- 请不要复制这段代码!此处不需要header -->
    <header>
      <hgroup>
        <h1>My company</h1>
        <h2>Established 1893</h2>
      </hgroup>
    </header>

如果header唯一的子元素是hgroup，那还要header干神马？
如果header中没有其他的元素（比如多个hgroup），还是直接拿掉header吧

    <hgroup>
      <h1>My company</h1>
      <h2>Established 1893</h2>
    </hgroup>

## 三、不要把所有列表式的链接放在nav里

随着HTML5引入了30个新元素（截止到原文发布时），我们在构造语义化和结构化的标签时的选择也变得有些不慎重。
也就是说，我们不应该滥用超语义化的元素。
不幸的是，nav就是这样一个被滥用的例子。

nav元素的规范描述如下：

    nav元素表示页面中链接到其他页面或者本页面其他部分的区块；包含导航连接的区块。

    注意：不是所有页面上的链接都需要放在nav元素中——这个元素本意是用作主要的导航区块。
    举个具体的例子，在footer中经常会有众多的链接， 比如服 务条款，主页，版权声明页等等。
    footer元素自身已经足以应付这些情况，虽然nav元素也可以用在这里，但通常我们认为是不必要的。

    [WHATWG HTML spec](http://www.whatwg.org/specs/web-apps/current-work/complete/sections.html#the-nav-element)

关键的词语是“主要的"导航。当然我们可以互相喷上一整天什么叫做“主要的"。而我个人是这样定义的：

* 主要的导航
* 站内搜索
* 二级导航（略有争议）
* 页面内导航（比如很长的文章）

既然并没有绝对的对错，所以根据一个非正式投票以及我自己的解释，以下的情况，不管你放不放，我反正不放在`<nav>`中：

* 分页控制
* 社交链接（虽然有些社交链接也是主要导航，比如“关于"“收藏"）
* 博客文章的标签
* 博客文章的分类
* 三级导航
* 过长的footer

如果你不确定是否要将一系列的链接放在nav中，问你自己：“它是主要的导航吗？"
为了帮助你回答这个问题，考虑以下首要原则：

* 如果使用section和hx也同样合适，那么不要用nav — [Hixie on IRC](http://krijnhoetmer.nl/irc-logs/whatwg/20091209#l-480)
* 为了方便访问，你会在某个“快捷跳转"中给这个nav标签加一个链接吗？

如果这些问题的答案是“不"，那就跟`<nav>`鞠个躬，然后独自离开吧。

## 四、figure元素的常见错误

figure以及figcaption的正确使用，确实是难以驾驭。
让我们来看看一些常见的错误，
不是所有的图片都是figure上文中，我曾告诉各位不要写不必要的代码。
这个错误也是同样的道理。我看到很多网站把所有的图片都写作figure。
看在图片的份上请不要给它加额外的标签了。
你只是让你自己蛋疼，而并不能使你的页面内容更清晰。

规范中将figure描述为“一些流动的内容，有时候会有包含于自身的标题说明。一般在文档流中会作为独立的单元引用。"
这正是figure的美妙之处——它可以从主内容页移动到sidebar中，而不影响文档流。

这些问题也包含在之前提到的[HTML5 element flowchart](http://html5doctor.com/flowchart)中。

如果纯粹只是为了呈现的图，也不在文档其他地方引用，那就绝对不是`<figure>`。
其他视情况而定，但一开始可以问自己：“这个图片是否必须和上下文有关？"
如果不是，那可能也不是<figure>（也许是个<aside>）。
继续：“我可以把它移动到附录中吗？"
如果两个问题都符合，则它可能是 `<figure>`。

### Logo并不是figure

进一步的说，logo也不适用于figure。
下面是我常见的一些代码片段：

    <!-- 请不要复制这段代码!这是错的 -->
    <header>
      <h1>
        <figure>
          <img src="/img/mylogo.png" alt="My company" />
        </figure>
        My company name
      </h1>
    </header>

    <!-- 请不要复制这段代码!这也是错的 -->
    <header>
      <figure>
        <img src="/img/mylogo.png" alt="My company" />
      </figure>
    </header>

没什么好说的了。这就是很普通的错误。
我们可以为logo是否应该是H1标签而互相喷到牛都放完回家了，但这里不是我们讨论的焦点。
真正的问题在于 figure元素的滥用。
figure只应该被引用在文档中，或者被section元素围绕。

我想你的logo并不太可能以这样的方式引用吧。
很简单，请 勿使用figure。你只需要这样做:

    <header>
      <h1>My company name</h1>
      <!-- More stuff in here -->
    </header>

### Figure也不仅仅只是图片

另一个常见的关于figure的误解是它只被图片使用。
figure可以是视频，音频，图表，一段引用文字，表格，一段代码，一段散文，以及任何它们或者其他的组合。
不要把figure局限于图片。
web标准的职责是精确的用标签描述内容。

## 五、不要使用不必要的type属性

这是个常见的问题，但并不是一个错误，我认为我们应该通过最佳实践来避免这种风格。

在HTML5中，script和style元素不再需要type属性。
然而这些很可能会被你的CMS自动加上，所以要移除也不是那么的轻松。
但如果 你是手工编码或者你完全可以控制你的模板的话，那真的没有什么理由再去包含type属性。
所有的浏览器都认为脚本是javascript而样式是css样 式，你没必要再多此一举了。

    <!-- 请不要复制这段代码!它太冗余了! -->
    <link type="text/css" rel="stylesheet" href="css/styles.css" />
    <script type="text/javascript" src="js/scripts" /></script>

其实只需要这样写：

    <link rel="stylesheet" href="css/styles.css" />
    <script src="js/scripts" /></script>

甚至指定字符集的代码都可以省略掉。
Mark Pilgrim在[Dive into HTML5](http://diveintohtml5.org/semantics.html)的语义化一章中作出了解释。

## 六、form属性的错误使用

HTML5引入了一些form的新属性，以下是一些使用上的注意事项：

### 布尔属性

一些多媒体元素和其他元素也具有布尔属性。
这里所说的规则也同样适用。

有一些新的form属性是布尔型的，意味着它们只要出现在标签中，就保证了相应的行为已经设置。

这些属性包括：

* `autofocus`
* `autocomplete`
* `required`

坦白的说，我很少看到这样的。
以required为例，常见的是下面这种：

    <!-- 请不要复制这段代码! 这是错的! -->
    <input type="email" name="email" required="true" />
    <!-- 另一个错误的例子 -->
    <input type="email" name="email" required="1" />

严格来说，这并没有大碍。
浏览器的HTML解析器只要看到required属性出现在标签中，那么它的功能就会被应用。
但是如果你反过来写`equired="false"`呢？

    <!-- 请不要复制这段代码! 这是错的! -->
    <input type="email" name="email" required="false" />

解析器仍然会将`required`属性视为有效并执行相应的行为，尽管你试着告诉它不要去执行了。
这显然不是你想要的。

有三种有效的方式去使用布尔属性。（后两种只在xthml中有效）

* `required`
* `required=""`
* `required="required"`

上述例子的正确写法应该是:

    <input type="email" name="email" required />

