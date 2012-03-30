---
layout: post
title: 优化 Jekyll 站点的 SEO 技巧
description: 在使用 Jekyll 搭建个人博客的时候，将 SEO 优化的细节融入到博客主题中，有利于搜索引擎的对站点内容的抓取，为您的网站带来有价值的流量。本文将为你分享一些 Jekyll SEO 技巧。
keywords: Jekyll, SEO, title, blog, site, google, violet, GitHub, 搜索引擎, 标题, 关键字, 描述, description, keywords
category : seo
tags : [seo, jekyll]
---
很多时候，我们搭建了一个博客，但很少有人来访问。一方面可能是因为我们没有做好推广，另外一方面可能是我们没做好 <strong>SEO</strong> 。在使用 <strong>Jekyll</strong> 搭建这个博客的时候，我将 <strong>SEO</strong> 的一些优化点融入到 <strong>Violet</strong> 主题中来。经过一段时间的测试和观察，期望的效果已经达到。

虽然我不是 SEO 高手，但喜欢折腾。通过对 SEO 的学习和实践，我希望能将好的文章让更多人知道，并通过 Jekyll 实现。本文将为你分享一些 <strong>Jekyll SEO</strong> 技巧。

###优化博客标题及副标题

<strong>博客标题</strong>，即站点的名称。它能够使访问者在第一时间知道所在的是什么网站，是站点的重要标识。副标题，它与博客主题并不一样，它能为博客标题做一些描述，一些优化性。通常，我都会为站点的主标题设置 <code class="v-code">h1</code> 标签，为副主题设置 <code class="v-code">h2</code> 标签。

###优化页面标题

在之前一直使用这样的标题方式 "xxx | PIZn", 本来还觉得挺好的，既有博客名称，又有页面标题。但后来查看搜索引擎的显示结果，基本上每个链接的标题里面，也就有了多余的 "| PIZn" 了。

有人说这样好，也有人说这样不好。这次我决定砍掉后面的博客名称，让标题来的简洁些，让标题与内容的权重比更高一些。

具体的实现方法如下：

<pre class="html" name="colorcode">
&lt;title&gt;
    if page.title
         page.title  //显示页面标题
    else
         site.title  //显示博客标题
    endif
&lt;/title&gt;
</pre>

###Description 和 Keywords

<strong>Description</strong> 是为搜索引擎提供网页的描述信息，<strong>Keywords</strong> 为搜索引擎提供网页包含的核心内容。

为 Jekyll 站点创建这Description 和 Keywords 有很多种方法。一种可以通过全局定义，
把预定好的内容写在配置文件 <code class="v-code">_config.yml</code> 中，一种是在
每个页面添加 <code class="v-code">YAML</code> ， 还有一种是写个插件，自动配置。写在配置文件中的比较统一，可以作为全局使用。写在页面的比较灵活，但是每次编写文章的时候都要自己手动加上去。写个插件，难度较大。

经过对 <strong>Wordpress</strong> 的 SEO 的一些借鉴方法，在这次改版过程中，我采用了手动配置的方法。基本为所有页面都添加了 Description 和 Keywords 。

如果你查看我的页面源码，你就可以发现，在所有文档的头部都会多了 2 个标识。而在文章页面，我会在文章输出 Description , 同时将其作为文章的摘要在首页输出。

###使用 hground, strong 标签

一篇好的文章，条例同顺，层次分明。同时，为文章加上语义化的标签，更有利于搜索引擎抓取。

<strong>hground</strong> 标签指的是 <code class="v-code">h1</code>, <code class="v-code">h2</code>, <code class="v-code">h3</code>, <code class="v-code">h4</code>, <code class="v-code">h5</code>, <code class="v-code">h6</code> 等标签, <code class="v-code">strong</code> 标签则是标识该文章的关键字。

###处理链接的 rel 标签

页面的菜单，为 Home 设置 <code class="v-code">nofollow</code> ，为 Archives ，Plugins ，Works，Contact 页面添加 <code class="v-code">bookmark</code> 。在首页的文章 Read More 中，为其添加的也是 nofollow ，这样写的好处是同个链接在搜索爬虫抓取的时候，不会抓取两次，避免权重下降。

###文章列表页显示文章摘要

在 Archives 页面，我将 <strong>Description</strong> 输出到摘要信息里面。这里有个好处，就是在查看这个页面的时候，很方便地看到页面的基本内容，搜索爬虫也能抓取到页面的摘要。坏处就是所有的文章在这里都输出，表示页面会很长！

###添加 Atom.xml 和 Sitemap.xml

为网站添加订阅功能，主要将最新的 10 篇文章输出到 Atom.xml 中。网站地图 <strong>Sitemap.xml</strong> 则是将全站的文章，页面都输出。最后将其提交到 <strong>Google</strong> 。

###简单总结

以上内容是我在使用 <strong>Jekyll</strong> 搭建自己的博客的过程中实践和总结过来的，如有不对，请尽快联系我。我们互相学习，共同交流。

在使用 <strong>Wordpress</strong> 的时候，就注意到 <strong>SEO</strong> 的重要性了。此次<strong>Violet</strong> 的实践，应该算是一种学习和尝试，在使用<strong>Jekyll</strong> 搭建站点的过程中，具体应该注意的一些细节，下面列个表格作最后总结。

<table>
    <tbody>
        <tr>
            <th style="width:15%">页面类型</th>
            <th>标题</th>
            <th>描述</th>
            <th style="width:18%">关键词</th>
            <th>其他</th>
        </tr>
        <tr>
            <td>首页</td>
            <td>默认显示博客标题</td>
            <td>全局描述</td>
            <td>全局关键词</td>
            <td>为 <code class="v-code">Read More</code> 添加 <code class="v-code">nofollow</code></td>
        </tr>
        <tr>
            <td>普通页面</td>
            <td>页面标题</td>
            <td>页面描述</td>
            <td>页面关键字</td>
            <td>为 <code class="v-code">Read More</code> 添加 <code class="v-code">nofollow</code></td>
        </tr>
        <tr>
            <td>文章页面</td>
            <td>文章标题</td>
            <td>文章摘要</td>
            <td>文章关键字</td>
            <td>为文章格式化，hground, strong 等标签的使用</td>
        </tr>
    </tbody>
</table>

###一个半月之后的成果

这篇文章是在 2012年1月16日 发布的，那个时候我查了一下，google 的 PR 值为 0 。现在是 2012月2月24日，我再查一下，如今的 PR 值为 3 。小小欣慰一下，但仍然还有很多问题。

经过为博客添加 category之后的一些总结，一个网站的文章路径是非常关键了，于是固定链接成为重中之中，坚固固定链接，保证从搜索引擎过来的链接不会出现 404 结果，是提升 seo 的保障。
