---
layout: post
title: 9 行 javascript 代码获取 QQ 群成员
keywords: javascript, qq
category : javascript
tags : [javascript, qq]
---

昨天看到一条微博：「22 行 JavaScript 代码实现 QQ 群成员提取器」。
本着好奇心点击进去，发现没有达到效果，一是 QQ 版本升级了，二是博客里面的代码也有些繁琐。

于是自己试着写了一个，算上空行才 9 行，麻雀虽小，五脏俱全。

<script src="https://gist.github.com/justjavac/6985824.js"></script>

## 使用方式

先进如 QQ 群空间，直接进去可以点此链接：<http://qun.qzone.qq.com>，如果想获取群信息，首先你必须是群成员。

登录进去后，最上面菜单有【我的群】，在次菜单中选择一个群。再点击【群成员】。

按 F12，调出开发者工具，然后选择 【javascript 控制台】。（如果使用 Chrome，可以直接按 `Ctrl + Shift + J`）。

把下面那段代码这贴进去，回车！

	var ids    = document.querySelectorAll(".member_id");
	var names  = document.querySelectorAll(".member_name");
	var output = "", length = ids.length;
	 
	for(var i=0; i<length; i++){
	    output += ids[i].innerHTML.slice(1,-1) + ":" + names[i].innerHTML + "\n";
	}
	
	console.log(output);

如果觉得复制来复制去太麻烦，我做了一个书签。

将下面的链接拖到书签栏：<a href='javascript:void(function(){var ids=document.querySelectorAll(".member_id");var names=document.querySelectorAll(".member_name");var output="";var length=ids.length;for(var i=0;i<length;i++){output+=ids[i].innerHTML.slice(1,-1)+":"+names[i].innerHTML+"\n"}console.log(output);}());' onclick="javascript:alert('请把我拖到你的浏览器书签栏'); return false;">获取QQ群成员</a>

然后你就可以，进入群通讯录 --> `Ctrl + Shift + J` --> 点击标签栏 --> 复制。

**注：本代码只供学习研究使用。**