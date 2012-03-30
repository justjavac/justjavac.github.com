---
layout:         post
title:          mac 本地按安装 jekyll
description:    安装 Jekyll 的方法。
keywords: Jekyll, ruby
category : Jekyll
tags : [iruby, jekyll]
---
本地安装 Jekyll 其实很简单的，继续做笔记。

如果你的本地已经安装了 gem ，那么你可以通过下面的方法来安装 jekyll , 在终端输入
：
<pre class="js" name="colorcode">
gem install jekyll
</pre>
如果你安装遇到问题，可能是本地 ruby 版本的原因，或者是 gem 没有升级。
安装 ruby 有很多方法：
<pre class="js" name="colorcode">
//apt-get
sudo apt-get install ruby1.8-dev
//brew
brew install ruby
//macport
port install ruby
</pre>
升级 gem :
<pre class="js" name="colorcode">
sudo gem update --system
</pre>

Ok, 安装完 jekyll 之后，你还需要安装 RDiscount，为什么需要呢？因为在 RDiscount
里面包含有 markdown 语法的包。
安装如下：
<pre class="js" name="colorcode">
sudo gem install rdiscount
</pre>

-- 完 --
