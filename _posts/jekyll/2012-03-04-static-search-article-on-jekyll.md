---
layout:        post
title:          为 jekyll 博客添加静态搜索
description:    使用 Javascript 通过关键词来搜索博客中的相关文章，实现在 jekyll 中的静态搜索。
keywords: jekyll, search, Javascript, Jquery, Jquery UI, blog, static search, xml, Ajax
---

今晚吃完饭后，为博客做了简单的搜索功能，因为做的大多是前台方面的工作，所以我个人
将其称之为静态搜索。简单介绍下。

### 一、生成 search.xml

遍历 **jekyll** 博客中的所有文章，获取其标题、日期和文章链接，整合
到一个 **xml** 文件中。这个 **xml** 文件我们可将其命名为 `search.xml`，以便我们后续的工作。

具体的写法如下：

    //jekyll 语法前反斜杆是为了转义输出，请去掉
    &lt;?xml version="1.0" encoding="UTF-8" ?&gt;
    &lt;articles&gt;
    {\% for post in site.posts %\}
    &lt;article&gt;
        &lt;title&gt;{\{ post.title }\}&lt;/title&gt;
        &lt;url&gt;{\{ site.url }\}{\{ post.url }\}&lt;/url&gt;
        &lt;date&gt;{\{ post.date | date_to_utc | date: '%Y-%m-%d'}\}&lt;/date&gt;
    &lt;/article&gt;
    {\% endfor %\}
    &lt;/articles&gt;

### 二、添加 DOM 结构

DOM 结构就是 HTML 代码啦。
你可以添加到你希望的地方，但要注意一点，就是你添加 DOM结构的地方要有相应的 CSS 链接和 JS 链接。
我把这个简单的搜索功能放在 Archive.html 里面，不清楚的同学可以去看源代码哈。

添加 <strong>Jquery UI</strong> 样式和 <strong>JS</strong> 链接。
我在这里采用的是 jquery-ui-1.8.18.custom 版本。
DOM 结构保存在同一个页面。

<pre class="html" name="colorcode">
//样式表
&lt;link rel="stylesheet" href="/css/jquery-ui-1.8.18.custom.css" type="text/css"
/&gt;

//js
&lt;script src="/js/jquery-ui-1.8.18.custom.js"&gt;&lt;/script&gt;

//添加 DOM
&lt;input id="J_search" placeholder="Simple Search"/&gt;
</pre>

### 三、设置全局地址

在 <strong>jekyll</strong> 博客的根目录下的 `config.yml` 添加你的博客的全局基本地址。就一句话就 Ok 哈！

<pre class="html" name="colorcode">
url: http://justjavac.com
</pre>


###四、通过 Javascript 实现搜索功能

简单说明下原理：通过在输入框输入关键词，<strong>Ajax</strong> 匹配 search.xml 中的文章标题里面的词语，
若是，在输入框下方显示出标题。通过选择标题，跳转到搜索到的文章页面。

我的实现方式是这样的，你也可以通过修改 `autocomplete`
的实例来实现不同的展现效果。
<pre class="js" name="colorcode">
$(function() {
		$.ajax({
            url: "search.xml",
            dataType: "xml",
            success: function( xmlResponse ) {
                var data = $( "article", xmlResponse ).map(function() {
                    return {
                        value: $( "title", this ).text() + ", " +
                            ( $.trim( $( "date", this ).text() ) ),
                        desc: $("description", this).text(),
                        url: $("url", this).text()
                    };
                }).get();

                $( "#J_search" ).autocomplete({
                    source: data,
                    minLength: 0,
                    select: function( event, ui ) {
                        window.location.href = ui.item.url;
                    }
                });
            }
        });
    });
</pre>

###五、测试

在输入框中输入你所知道的一些关键词，如果输入框下拉菜单有内容，选中它，成功跳转到对应的文章页面。那么，你成功了。

###六、总结

这是一个很简单的实现方法，因为就今晚几个小时做出来的，所以可能还有很多不适用性。兼容性方面还没做好测试，只兼容 Firefox 和 Chrome ，还没完善的一个方面是出错处理，有空再补上。

遗憾的是暂时只支持英文关键词搜索，后续，恩，中英文。
