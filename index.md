---
layout: page
title: justjavac
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

本网站托管在 [github][http://github.com] 上， 使用 [Jekyll Bootstrap](http://jekyllbootstrap.com)框架建构。

您也可以在 github 上创建自己的网站，[在 github 上建立 pages 的过程][http://justjavac.com/git/2011/09/22/create-github-page]。 

## Update Author Attributes

In `_config.yml` remember to specify your own data:
    
    title : My Blog =)
    
    author :
      name : Name Lastname
      email : blah@email.test
      github : username
      twitter : username

The theme should reference these variables whenever needed.
    
## Sample Posts

This blog contains sample posts which help stage pages and blog data.
When you don't need the samples anymore just delete the `_posts/core-samples` folder.

    $ rm -rf _posts/core-samples

Here's a sample "posts list".

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

