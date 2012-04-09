---
layout: page
title: justjavac的博客
keywords: justjavac
description: justjavac的个人博客， 探讨目前最时髦的web开发技术。
tagline: 专注最时髦的web开发技术
---
{% include JB/setup %}

<script type="text/javascript"><!--
google_ad_client = "ca-pub-5061364613986259";
/* justjavac 页首横幅 */
google_ad_slot = "7571220937";
google_ad_width = 728;
google_ad_height = 90;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>

本网站托管在 [github](http://github.com) 上， 使用 [Jekyll Bootstrap](http://jekyllbootstrap.com)框架建构。

您也可以在 github 上创建自己的网站，[在 github 上建立 pages 的过程](http://justjavac.com/git/2011/09/22/create-github-page)。 

## 配置站点

在 `_config.yml` 文件中修改网站配置信息: 
    
    title : My Blog =)
    
    author :
      name : Name Lastname
      email : blah@email.com
      github : username
      twitter : username

配置完成后，网站就可以使用这些配置信息，并把它们显示在应该出现的地方。
    
## 文档

下面是网站发布的文档：

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

## 其他

    ……