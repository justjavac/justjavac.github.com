---
layout: post
title: Web开发者不可不知的15条编码原则
description: TML已经走过了近20的发展历程。从HTML4到XHTML，再到最近十分火热的HTML5，它几乎见证了整个互联网的发展。但是，即便到现在，有很多基础的概念和原则依然需要开发者高度注意。
keywords: web, 浏览器
category : web
tags : [web, 浏览器]
type: porter
---

HTML已经走过了近20的发展历程。
从HTML4到XHTML，再到最近十分火热的HTML5，它几乎见证了整个互联网的发展。
但是，即便到现在，有很多基础的概念和原则依然需要开发者高度注意。

下面，向大家介绍这些应该遵循的开发原则。 

## 1、善用DIV来布局 

当开发一个Web页面时，要考虑第一件事就是区分页面重点。
将这些内容用DIV标签包含起来，页面的代码会呈现出整洁、缩进良好的风格。

```html
<div id="header"></div>
<div id="body-container">
		<div id="content"> <!-- Content -- > </div> 
		<div id="right-side-bar"> <!-- Right Side Bar Content Area -- ></div>
</div> 
<div id="footer"></div>
```

## 2、将HTML标签和CSS样式表分割开来 

好的页面应该将HTML标签和CSS样式表分割开来。
这是每一个Web开发者在首次接触Web开发时就应该知道的一条原则。
然而，直到今天，仍然有很多开发者没有严格遵循这一原则。 

不要在HTML标签里内嵌样式表代码。
开发者应该养成习惯，单独建立文件，用以存放CSS样式表。
而这也将方便其他开发者在修改你的代码时，能迅速完成工作。

```html
<p style="color: #CCC; font-size:16px; font-family: arial">An example to illustrate inline style in html</p>
```

## 3、优化CSS代码 

现如今，为网站添加多个CSS文件的做法已经很普遍。
但是，当网站包含的CSS文件过多时，会降低网站的响应速度。

解决办法是：精简代码并对多个CSS文件进行优化，将其合并成一个文件。
这个办法能显著提升网站的加载速度。

此外，有很多工具可以用来优化CSS文件，例如CSS Optimizer 、Clean CSS 等。 

## 4、优化Javascript文件，并将其放到页面底部 

和CSS一样，为页面添加多个Javascript文件也是很普遍的做法。
但这同样会降低网站的响应速度。
为此，开发者应该精简、优化这些Javascript文件。 

但有一点和CSS不同，浏览器通常不支持并行加载。
这也就是说，当浏览器加载Javascript文件时，将不再同时加载其它内容。
而这就导致了网页的加载速度好像变慢了。 

一个好的解决办法是：将Javascript文件的加载顺序放在最后。
为了实现这一目标，开发者可以把Javascript代码放在HTML文档的底部，而最好的位置是放在接近`</body>`标签的地方。 

## 5、善用标题元素 

`<h1>` 到 `<h6>` 这些元素用来突出页面的重点内容。
这有助于用户更加关注页面的重点部分。

对于博客，我（指本文作者）推荐使用`<h1>`标签来突出博客标题。
因为，博客标题几乎是页面中最重要的部分。

```html
<h1>This is the topmost heading</h1>
<h2>This is a sub-heading underneath the topmost heading.</h2>
<h3>This is a sub-heading underneath the h2 heading.</h3>
```

## 6、在合适的地方使用合适的HTML标签 

HTML标签是构造规范内容结构的关键。
例如，`<em>` 标签用来强调重点内容。`<p>` 标签适用于突出文章段落。
如果想要在段落间加空行，就不要使用 `<br />` 标签。

```html
<em>emphasized text</em>
<strong>strongly emphasized text</strong>
```

对于一组相关的元素，建议使用`<ul>`、`<ol>`或 `<dl>`标签。
但是，不要错误的使用`<blockquote>`标签，因为它原本是用来定义块应用的。 

## 7、避免滥用div标签 

并不是所有块元素都应该用`<div>`标签来创建。

例如，可以在内联元素的属性里添加 `display:block`，将其以块元素的方式显示。 

## 8、使用列表创建导航 

使用`<ul>`列表标签，再配以相应的CSS样式，可以创建美观的导航菜单。 

## 9、别忘了封闭标签 

现在，每当我回忆起在大学里学到的关于Web开发的第一堂课时，教授提到的HTML结构的重要性总是浮现在我的脑海。

根据W3C标准，标签应该被封闭。
那是因为，在一些浏览器下，如果没有按照标准来将标签封闭，会出现显示不正常的问题。
而这一情况在IE6、7和8里尤为明显。 

## 10、标签小写语法 

标签采用小写语法是一项行业标准。
虽然大写语法并不影响页面的显示效果，但是，代码的可读性很差。

下面这段代码可读性就非常差：

```html
<DIV>
<IMG SRC="images/demo_image.jpg" alt="demo image"/>
<A HREF="#" TITLE="click here">Click Here</A>
<P>some sample text</P>
</DIV>
```

## 11、为图片标签添加alt属性 

在`<img>`标签里，alt属性通常非常有用。
因为搜索引擎通常无法直接抓取图片文件。
但是，如果开发者在alt属性里添加了图片的描述内容，将会方便搜索引擎的抓取。

```html
<!-- has an alt attribute, which will validate, but alt value is meaningless -- >
<img id="logo" src="images/bgr_logo.png" alt="brg_logo.png" />

<!-- The correct way -- > 
<img id="logo" src="images/bgr_logo.png" alt="Anson Cheung - Web Development" />
```

## 12、在表格里使用 label 和 fieldset

为了提高代码质量，并让用户容易理解表格内容，我们应该用 `<label>` 和 `<fieldset>` 标签创建表格元素。

```html
<fieldset>
	<legend>Personal Particular</legend>
	<label for="name">Name</label><input type="text" id="name" name="name" />
	<label for="email">E-mail</label><input type="text" id="email" name="email" />
	<label for="subject">Subject</label><input type="text" id="subject" name="subject" />
	<label for="message" >Message Body</label><textarea rows="10" cols="20" id="message" name="message" ></textarea>
</fieldset>
```

## 13、将浏览器兼容代码标明信息并相互分开 

对一名Web开发者来说，跨浏览器兼容是一个被重点关注的问题。
通常，开发者会针对不同的浏览器来编码，也即是CSS hack。
但是，如果开发者在编码时，能注明代码为哪一个版本的浏览器所写，会为以后的维护工作带来极大方便。

下面就是一个很好的示例：

```html
<!--[if IE 7]>
<link rel="stylesheet" href="css/ie-7.css" media="all">
<![endif]-->

<!--[if IE 6]>
<link rel="stylesheet" href="css/ie-6.css" media="all">
<script type="text/javascript" src="js/DD_belatedPNG_0.0.8a-min.js"></script>
<script type="text/javascript">
		DD_belatedPNG.fix('#logo');
</script>
<![endif]-->
```

## 14、避免过度注释 

作为一名开发者，在代码中添加注释是一个好习惯，能方便理解并易于维护。
这在其它编程语言如PHP、JAVA 和 C#里很普遍。

但是，HTML/XHTML是文本标记语言，非常容易理解。
因此，无需为每行代码都添加注释。 

## 15、测试代码 

推荐开发者使用W3C文本标记验证服务来测试代码。
它是一个高效的测试工具，能帮助你发现页面中存在的错误。
而且，它还能从页面错误出发，帮你定位到相应的代码。

这一点通常在编码完成后很难做到。
但开发者需要注意的是，验证通过的代码并非就是性能优异的代码。 

英文原文：[10+ HTML Best practices for Web Developer](http://www.ansoncheung.tk/articles/10-html-best-practices-web-developer)
