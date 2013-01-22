---
layout: post
title: github 不能访问了，无法连接到服务器
description: github 不能访问了，无法连接到服务器，修改 hosts 文件。
keywords: git, github, GFW
category : git
tags : [git, github, GFW]
---

好久没有更新博客了，今天突然在QQ群上听说 github 无法访问了，因为我的博客一直托管在 github 上，所以第一时间查看了一下，暂时没有问题，依然可以访问。

记得前不久，由于 12306 的抢票插件引用了 github 上的 js 文件，导致了 github 被拖垮，现在竟然不能访问了。
我的第一反应就是，IP 被封，但是由于我的博客（托管在了 github 上）却可以正常访问，因此排除了这种可能。
因此应该是 DNS 的问题。DNS 污染或者拦截，导致请求不能到达 github。（具体在哪儿拦截的，大家都懂滴）

让人百思不得其解的就是，github 作为一个技术网站，没有被屏蔽的理由啊，虽然也有少许社交的因素在里面。
但是回想以前的那些技术站点，也有很多遭此厄运的。

既然是 DNS 的问题，那就换个 DNS 解析，可是我本地 DNS 一直是 8.8.8.8 啊，依然不能访问，看来还得再加点儿猛料，修改 hosts 文件。

	207.97.227.239 github.com   
	65.74.177.129 www.github.com   
	207.97.227.252 nodeload.github.com   
	207.97.227.243 raw.github.com  
	204.232.175.78 documentcloud.github.com  
	204.232.175.78 pages.github.com

修改完成后，果然又可以访问了。
