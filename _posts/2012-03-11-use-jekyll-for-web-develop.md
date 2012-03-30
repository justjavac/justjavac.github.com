---
layout: post
title: 使用 Jekyll 提高 Demo 开发效率
description: 在前端开发的前期，编写 Demo 的过程是最初的开始，但由于开发环境等问题，我们需要等待或者做一些多余的工作。通过 Jekyll ，可以适当提高开发效率。
keywords: Jekyll, Demo, Web Development, head, foot, content
category : Jekyll
tags : [jekyll]
---

使用 Jekyll 来提高 Demo 的开发效率？也许真有点儿可能喔。经过一个星期的实践，我感
觉还是挺方便的。今天分享下。

###Demo 开发遇到的问题

在前端开发的过程中，前期的 Demo 制作，需要依据 PRD 和视觉稿产出相应的 HTML 页面
。很多时候，由于环境的问题，使用单纯的 HTML 来编写页面，效率比较慢。或者适当地使
用 Copy And Write 的方式，也不是很灵活。

总结我个人遇到的一些妨碍效率的问题，有下面几点：

* 头部底部只能通过 Copy & write 的方式应用到各个页面，页面多的话，需要修改很多次。不灵活。
* 编写模板的时候，需要再从 Demo 筛选出对应的模块，重复性成本高。
* 使用 PHP 或者其他语言进行编写 Demo，似乎小题大作了。

###如何使用 Jekyll 开发 Demo ？

恩，也许你还不知道啥是 <a href="http://www.jekyllrb.com" target="_blank"
rel="nofollow" title="Jekyll"><strong>Jekyll</strong></a>，没关系，
<strong>justjavac.com</strong> 就是使用 <strong>Jekyll</strong> 搭建起来的。你可以在这里找到 <strong>Jekyll</strong> 的很多相关文章。

Ok，基于平时自己遇到的一些问题，还有 Jekyll 的方便性，我尝试着这样去做页面的开发，舒服多了，效率也提上来了。

* 本地安装 Jekyll 。
* 新建项目文件夹，至少需要下面几个文件：
<pre class="html" name="colorcode">
xxx项目
    |--_layouts(布局)
        |--default.html
    |--_includes(模块化)
        |--head.html
        |--foot.html
    |--css
    |--js
    |--html
    |--images
    |--_config.yml(配置文件)
</pre>
* 通过布局来配置我们的公用模块，简化每个 Demo 的工作量。
* 通过 include 来规划组件化模块，一个页面可以看成是很多组件构建起来的。
* 在项目文件夹运行<code class="v-code">jekyll --server</code>。
* 待服务启动成功到浏览器访问<code class="v-code">localhost:4000/你的页面</code>，进行测试和其他工作。

###人无完人，适合才是好的

每个人的工作方式都不一样。我个人觉得这样挺好的，必要的适合再建个项目发出来。但也有个不足，就是每次测试需要输入<code class="v-code">jekyll --server</code>，其他的还好。

使用 Jekyll 来提高前端开发 Demo 效率，如果你觉得还不错，或者不懂，或者有新的想法，欢迎交流。
