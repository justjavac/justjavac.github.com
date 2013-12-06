---
layout: post
title: 高效 jquery 的奥秘
keywords: javascript, jQuery
category : javascript
tags : [javascript, jQuery]
---

原文：[Writing Better jQuery Code](http://flippinawesome.org/2013/11/25/writing-better-jquery-code/)

作者：[@MathewDurden](https://twitter.com/MathewDurden)

译文：[高效 jquery 的奥秘](http://yanhaijing.com/jquery/2013/12/05/%E9%AB%98%E6%95%88jQuery%E7%9A%84%E5%A5%A5%E7%A7%98/)

译者：[@颜海镜](http://weibo.com/yanhaijing1234)

----------------------------------------------------

讨论 jQuery 和 javascript 性能的文章并不罕见。
然而，本文我计划总结一些速度方面的技巧和我本人的一些建议，来提升你的 jQuery 和 javascript 代码。
好的代码会带来速度的提升。
快速渲染和响应意味着更好的用户体验。

首先，在脑子里牢牢记住 jQuery 就是 javascript。
这意味着我们应该采取相同的编码惯例，风格指南和最佳实践。

首先，如果你是一个 javascript 新手，我建议您阅读 《[24 JavaScript Best Practices for Beginners](http://net.tutsplus.com/tutorials/JavaScript-ajax/24-JavaScript-best-practices-for-beginners/)》， 这是一篇高质量的 javascript 教程，接触 jQuery 之前最好先阅读。

当你准备使用 jQuery，我强烈建议你遵循下面这些指南:

## 1. 缓存变量 ##

DOM 遍历是昂贵的，所以尽量将会重用的元素缓存。

	// 糟糕	
	h = $('#element').height();
	$('#element').css('height', h-20);
	
	// 建议	
	$element = $('#element');
	h = $element.height();
	$element.css('height', h-20);

## 2. 避免全局变量  ##

jQuery 与 javascript 一样，一般来说，最好确保你的变量在函数作用域内。

	// 糟糕	
	$element = $('#element');
	h = $element.height();
	$element.css('height', h-20);
	
	// 建议	
	var $element = $('#element');
	var h = $element.height();
	$element.css('height', h-20);

## 3. 使用匈牙利命名法 ##

在变量前加 `$` 前缀，便于识别出 jQuery 对象。

	// 糟糕	
	var first = $('#first');
	var second = $('#second');
	var value = $first.val();
	
	// 建议 - 在 jQuery 对象前加 $ 前缀	
	var $first = $('#first');
	var $second = $('#second'),
	var value = $first.val();

## 4. 使用 var 链（单 var 模式） ##

将多条 `var` 语句合并为一条语句，我建议将未赋值的变量放到后面。

	var 
	  $first = $('#first'),
	  $second = $('#second'),
	  value = $first.val(),
	  k = 3,
	  cookiestring = 'SOMECOOKIESPLEASE',
	  i,
	  j,
	  myArray = {};

## 5. 请使用 'on' ##

在新版 jQuery 中，更短的 `on("click")` 用来取代类似 `click()` 这样的函数。
在之前的版本中 `on()` 就是 `bind()`。
自从 jQuery 1.7 版本后，`on()` 附加事件处理程序的首选方法。
然而，出于一致性考虑，你可以简单的全部使用 `on()` 方法。

	// 糟糕	
	$first.click(function(){
	    $first.css('border','1px solid red');
	    $first.css('color','blue');
	});
	
	$first.hover(function(){
	    $first.css('border','1px solid red');
	})

	// 建议
	$first.on('click',function(){
	    $first.css('border','1px solid red');
	    $first.css('color','blue');
	})
	
	$first.on('hover',function(){
	    $first.css('border','1px solid red');
	})

## 6. 精简 javascript ##

一般来说，最好尽可能合并函数。

	// 糟糕	
	$first.click(function(){
	    $first.css('border','1px solid red');
	    $first.css('color','blue');
	});
	
	// 建议	
	$first.on('click',function(){
	    $first.css({
	        'border':'1px solid red',
	        'color':'blue'
	    });
	});

## 7. 链式操作 ##

jQuery 实现方法的链式操作是非常容易的。
下面利用这一点。

	// 糟糕	
	$second.html(value);
	$second.on('click', function(){
	    alert('hello everybody');
	});
	$second.fadeIn('slow');
	$second.animate({height:'120px'}, 500);
	
	// 建议	
	$second.html(value);
	$second.on('click', function(){
	    alert('hello everybody');
	}).fadeIn('slow').animate({height:'120px'}, 500);

## 8. 维持代码的可读性 ##

伴随着精简代码和使用链式的同时，可能带来代码的难以阅读。
添加缩紧和换行能起到很好的效果。

	// 糟糕	
	$second.html(value);
	$second.on('click',function(){
	    alert('hello everybody');
	}).fadeIn('slow').animate({height:'120px'},500);
	
	// 建议	
	$second.html(value);
	$second
	    .on('click',function(){ alert('hello everybody');})
	    .fadeIn('slow')
	    .animate({height:'120px'},500);

## 9. 选择短路求值 ##

短路求值是一个从左到右求值的表达式，用 `&&`（逻辑与）或 `||`（逻辑或）操作符。

	// 糟糕	
	function initVar($myVar) {
	    if(!$myVar) {
	        $myVar = $('#selector');
	    }
	}
	
	// 建议	
	function initVar($myVar) {
	    $myVar = $myVar || $('#selector');
	}

## 10. 选择捷径 ##

精简代码的其中一种方式是利用编码捷径。

	// 糟糕	
	if(collection.length > 0){..}
	
	// 建议	
	if(collection.length){..}

## 11. 繁重的操作中分离元素 ##

如果你打算对 DOM 元素做大量操作（连续设置多个属性或 css 样式），建议首先分离元素然后在添加。

	// 糟糕	
	var 
	    $container = $("#container"),
	    $containerLi = $("#container li"),
	    $element = null;
	
	$element = $containerLi.first(); 
	//... 许多复杂的操作
	
	// 建议	
	var 
	    $container = $("#container"),
	    $containerLi = $container.find("li"),
	    $element = null;
	
	$element = $containerLi.first().detach(); 
	//... 许多复杂的操作
	
	$container.append($element);

## 12. 熟记技巧 ##

你可能对使用 jQuery 中的方法缺少经验，一定要查看的文档，可能会有一个更好或更快的方法来使用它。

	// 糟糕	
	$('#id').data(key,value);
	
	// 建议 (高效)	
	$.data('#id',key,value);

## 13. 使用子查询缓存的父元素 ##

正如前面所提到的，DOM 遍历是一项昂贵的操作。
典型做法是缓存父元素并在选择子元素时重用这些缓存元素。

	// 糟糕	
	var 
	    $container = $('#container'),
	    $containerLi = $('#container li'),
	    $containerLiSpan = $('#container li span');
	
	// 建议 (高效)	
	var 
	    $container = $('#container '),
	    $containerLi = $container.find('li'),
	    $containerLiSpan= $containerLi.find('span');

## 14. 避免通用选择符 ##

将通用选择符放到后代选择符中，性能非常糟糕。

	// 糟糕	
	$('.container > *'); 
	
	// 建议	
	$('.container').children();

## 15. 避免隐式通用选择符 ##

通用选择符有时是隐式的，不容易发现。

	// 糟糕	
	$('.someclass :radio'); 
	
	// 建议	
	$('.someclass input:radio');

## 16. 优化选择符 ##

例如，`id` 选择符应该是唯一的，所以没有必要添加额外的选择符。

	// 糟糕	
	$('div#myid'); 
	$('div#footer a.myLink');
	
	// 建议
	$('#myid');
	$('#footer .myLink');

## 17. 避免多个 ID 选择符 ##

在此强调，ID 选择符应该是唯一的，不需要添加额外的选择符，更不需要多个后代 ID 选择符。

	// 糟糕	
	$('#outer #inner'); 
	
	// 建议	
	$('#inner');

## 18. 坚持最新版本 ##

新版本通常更好：更轻量级，更高效。
显然，你需要考虑你要支持的代码的兼容性。
例如，2.0 版本不支持 ie 6/7/8。

## 19. 摒弃弃用方法 ##

关注每个新版本的废弃方法是非常重要的并尽量避免使用这些方法。

	// 糟糕 - live 已经废弃	
	$('#stuff').live('click', function() {
	  console.log('hooray');
	});
	
	// 建议
	$('#stuff').on('click', function() {
	  console.log('hooray');
	});
	// 注：此处可能不当，应为live能实现实时绑定，delegate或许更合适

## 20. 利用 CDN ##

谷歌的 CND 能保证选择离用户最近的缓存并迅速响应。
（使用谷歌CND请自行搜索地址，此处地址以不能使用，推荐 jquery 官网提供的 [CDN](http://code.jquery.com/jquery-1.10.2.min.js)）。

（国内用户可以试试百度的 CDN：<http://developer.baidu.com/wiki/index.php?title=docs/cplat/libs#jQuery>）

## 21. 必要时组合 jQuery 和 javascript 原生代码 ##

如上所述，jQuery 就是 javascript，这意味着用 jQuery 能做的事情，同样可以用原生代码来做。
原生代码（或 [vanilla](http://vanilla-js.com/)）的可读性和可维护性可能不如 jQuery，而且代码更长。
但也意味着更高效（通常更接近底层代码可读性越差，性能越高，例如：汇编，当然需要更强大的人才可以）。
牢记没有任何框架能比原生代码更小，更轻，更高效（注：测试链接已失效，可上网搜索测试代码）。

鉴于 vanilla 和 jQuery 之间的性能差异，我强烈建议吸收两人的精华，使用（可能的话）和 [jQuery 等价的原生代码](http://www.leebrimelow.com/native-methods-jQuery/)。

## 22. 最后忠告 ##

最后，我记录这篇文章的目的是提高 jQuery 的性能和其他一些好的建议。
如果你想深入的研究对这个话题你会发现很多乐趣。
记住，jQuery 并非不可或缺，仅是一种选择。
思考为什么要使用它。
DOM 操作？ajax？模版？css 动画？还是选择符引擎？或许 javascript 微型框架或 jQuery 的定制版是更好的选择。
