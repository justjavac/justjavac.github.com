---
layout: post
title: 为 jekyll 博客添加 category 分类
description: jekyll 搭建起来的博客系统，本身就具备了 category 的功能，为了更好地将 category 页面展示出来，我们能做到的方法有很多，例如使用插件。本文为您分享如何为你的博客添加分类。
keywords: jekyll, category, blog, 分类, plugins
category : jekyll
tags : [jekyll, category, blog]
---

为了深化 **jekyll** 博客里面的内联关系，我们通常会对一篇文章进行分类，贴标签等，这样能做到文章的更好的区分和快速查找到相关文章。

假如您也想在你的博客上实现这样的效果（如右图）, 请看下文。

<img src="/resources/category-list.jpg" alt="categroy list" class="img-right">

在某些地方，例如文章页面，你可能希望在侧边栏添加这样的功能。有一个分类目录，还能显示出分类文章的篇数。

## 一、为文章添加分类

在编辑一篇文章的时候，我们会在文章的头部写上一些 key 值, 同样的道理，我们可以为
这篇文章添加上 category 来分类。
<pre class="html" name="colorcode">
---
layout: post
title: 为 jekyll 博客添加 category 分类
category: jekyll
---
</pre>

## 二、添加分类功能到你希望它出现的地方

在这里，你只需要把下面的代码拷贝到你的博客中，就能看到你添加的文章出现的分类了。
<pre class="html" name="colorcode">
&lt;h4&gt;Category&lt;/h4&gt;
&lt;ul&gt;
    //这里使用了 jekyll 语法，会被编译，所以加多个"\"
    {\% for category in site.categories %\}
    &lt;li&gt;&lt;a href="/categories/{\{ category | first }\}/" title="view all
posts"&gt;{\{ category | first }\} {\{ category | last | size }\}&lt;/a&gt;
    &lt;/li&gt;
    {\% endfor %\}
&lt;/ul&gt;
</pre>

## 三、为博客添加 category 插件

添加 category 插件很简单，只要在根目录下建立一个 "plugins" 文件夹，然后拷贝category_plugin.rb 文件到里面就好了。category_plugin 文件的源代码可以在<a href="https://gist.github.com/1899497" title="The gist for category plugin" target="_blank" >这里</a>查看到。

这个插件的作用有两点：

* 建立 categories 文件夹, 遍历所有文章的分类，再根据分类建立分类的文件夹。
* 为每个分类建立一个 index.html 文件, 该文件的模板来自 layouts 里面的 category_index.html，因此您需要在 layouts 里面添加符合自己博客主题的文件。

## 四、添加 category_index.html 模板

这个模板是为了将我们的分类主页显示出来，显示的内容是一个分类的所有文章。也就是分
类列表的链接地址。具体使用到的代码如下：
<pre class="html" name="colorcode">
{\% for post in site.categories.[page.category] %\}
    {\{ post.date }\} {\{ post.title }\}
{\% endfor %\}
</pre>

你也可以参考我的分类主页来设计自己的分类主页，具体的效果，我截个图看看。我的分类主页的源代码在<a href="https://gist.github.com/1899544" target="_blank" title="The gist for category index page">这里</a>。

<img src="/resources/category-index.jpg" alt="category index" class="img-center" />

## 五、我们写的代码最终是如何完成工作的？

Ok, 在完成上面的步骤之后，我们需要编译一遍。在终端 cd 到你的博客目录，输入 `jekyll --server`，然后再回头看看我们的博客文件夹。

在 site 文件夹下，你会发现多了一个 categories 文件，里面就有包含的所有分类文件夹。同时，你也会发现在与 categories 同级的文件下也有这些分类文件夹，但他们存放的是我们的所有分类文章。

还有个变化，就是我们的文章链接 URL，添加了分类的文章，在日期前面会多了分类的名称。例如：`justjavac.com/jekyll/2012/02/23/user-category-plugin-for-jekyll-blog.html`

## 六、需要注意的，还有我疑惑的（需要大家帮忙看看的）

因为添加了插件，所以要确保你的 config.yml 文件里面的 safe 属性值为 `false`，因为这
个属性值为 `true` 的时候是使自定义插件失效。

我疑惑的是，我在本地完成上面的步骤之后，分类列表的每个分类链接可以成功到达分类的详细列表页面（即 category_index.html)，然而我上传到 github，没有报错，却无法到达那个页面，显示 404 错误。求大牛帮忙解决。
