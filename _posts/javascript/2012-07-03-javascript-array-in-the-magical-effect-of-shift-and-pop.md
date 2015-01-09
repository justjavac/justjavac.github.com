---
layout: post
title: javascript Array 中 shift 和 pop 的妙用
keywords: javascript, Array, shift, pop
category : javascript
tags : [javascript, Array]
---

原文地址：<http://sofish.de/2062>

原文作者：[幸福收藏夹](http://sofish.de)

----------------------------------------------------

在 javascript Array 中支持两个方法，`shift()` 和 `pop()`，分别是指从一个数据中的最前面和最后面删除一个值，并返删除值。

看一个示例就明白了：

```javascript
var arr = ['s','o','f','i','s','h'];

arr.shift(); // 返回 's'
arr;         // 目前是 ['o','f','i','s','h']
arr.pop()    // 返回 'h'
arr          // 目前是 ['o','f','i','s']
```

在很多 javascript 框架中可以很常见的是，一个方法提供你传几个参数，而这些参数中，部分是可以忽略的，这些可以忽略的点可能是第一个，也可能是最后一个。
传统的写法是判断参数有没有存在，或者参数的个数来决定最终取值。

这里，我们可以利用函数的 `arguments` 对象，以及 `Array` 中的 `shift` 和 `pop` 来实现灵活的应用。

## 一、使用 shift

如何实现一个 `.bind()` 方法，让 fn api 如下：

```javascript
// fn 的作用域限定于 object 下
// 除 object 外，所有 bind 方法的参数都将传给 fn
fn.bind(object, param1, param2, [, paramN]);
```

看一个实例先。
当然，这例子可能更为重要的是 `call` 和 `apply` 的应用。
不过，我们想要说的是 `shift` 的应用：

```javascript
// 来自 Prototype.js 的 [`.bind`](http://www.prototypejs.org/api/function/bind) 方法
Function.prototype.bind = function(){ 
  var fn = this,
	  args = Array.prototype.slice.call(arguments),
	  object = args.shift(); 
  return function(){ 
	  return fn.apply(object, 
		  args.concat(Array.prototype.slice.call(arguments))); 
	  }; 
};
```

我们可以利用对 `arguments` 对象(array-like object，需要转换成真正的 `array`)进行 `shift` 来取出，像这个方法，主要利用它们来分出作为作用域的 `object`，然后巧妙地把余下的参数数组传给 `fn`，即调用我们想限定到 `object` 作用域内的函数。

## 二、使用 pop

最近在试用 seajs，我们就拿它的一个 api 来说吧：

```javascript
define(id, dependencies, callback)
```

这个定义一个模块的 api，`id` 和 `dependencies` 都是可以省略的。
这里，如何实现这个支持呢？
如果使用 `if` 来判断，真就得 `if (arguments === 1) {...} elseif` ... 一大堆了。
当然，这样有时候也有好处的（?，想想）。
这里，我们可能用来 `pop` 来方便实现这样的支持：

```javascript
var define = function(){
	// 取出这个 callback
	var args = [].slice.call(arguments)
		fn = args.pop();
	// 做点其他神马事
		fn.apply(null, args)
	// ...
	},
	callback = function(){
		var args = arguments, i = 0, len = args.length;
		if(len === 0) console.log('只有一个 callback');
		for(;i<len;i++) {
			console.log(args[i]);
		}
	}

// 看看他们三个的执行结果
define(callback);
define('有两个参数', callback);
define('有三个参数', 'hello world', callback);
```

前两天和同事除到一些 javascript 中的技巧时引用的一个东西。
虽然总叫自己不要太沉浸于代码中，但代码，不仅仅是 javascript，总是给我们太多乐趣。
如何不喜欢。哈哈。

