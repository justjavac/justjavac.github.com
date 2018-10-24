---
layout: post
title: javascript 一怪——arguments 对象
keywords: javascript,arguments
category : javascript
tags : [javascript, arguments]
---

原文：[arguments: A JavaScript Oddity](http://www.sitepoint.com/arguments-a-javascript-oddity/)

译文：[javascript 一怪：arguments 对象](https://justjavac.com/javascript/2008/11/11/arguments-a-javascript-oddity.html)

----------------------------------------------------

`arguments` 是一种本地、类数组的对象的名称，它存在于每个函数中。
因为生僻，经常被人们忽略，但却是许多魔术般的程序之源。
所有主流 js 库都汲取了 `arguments` 对象的力量。
它是每一个 javascript 程序员都应当熟知的东西。

在任何函数的内部，你都可以通过变量 "arguments" 访问到它，它是一个包含了该函数被调用时提供的所有实参的“数组”。
但事实上，它并不是一个真正的数组—— `typeof arguments` 时会返回“object”。
你可以通过数字索引(index)的方式来访问 `arguments` 中的各个值，它也有和数组一样的 `length` 属性，
但没有如 `push` 和 `pop` 之类的数组的方法。

## 1、创建灵活的函数

尽管有它的局限性，但 `arguments` 仍不失为一个非常有用的对象。
例如，你可以创建参数个数不定的函数，如大牛 Dean Edwards 写的 base2 这个库中的 `format` 方法，秀一下其灵活性：

```javascript
function format(string) {
	var args = arguments;
	var pattern = new RegExp("%([1-" + arguments.length + "])", "g");
	return String(string).replace(pattern, function(match, index) {
		return args[index];
	});
};
```

你提供一个模板字符串，用 %1 到 %9 作为占位符加入其中，然后提供最多 9 个其他的参数用以插入，如：

```javascript
format("And the %1 want to know whose %2 you %3", "papers", "shirt", "wear");
```

上面这个句代码会返回字符串“And the papers want to know whose shirt you wear”

你可能已经注意到，在 `format` 函数定义时我们只指定了 `string` 这一个参数。
javascript 允许我们给一个函数传递任意多个参数，而不管函数定义时形参是多少个，
而且，`arguments` 对象可以访问到所有的实参。

## 2、转化为真正的数组

尽管 `arguments` 不是一个真正的数组，但使用标准的数组方法 `slice`，我们可以很容易的将它转化一个真正的数组，像这样：

```javascript
var args = Array.prototype.slice.call(arguments);
```

`args` 变量现在是一个包含了 `arguments` 对象所有值的数组了。

## 3、创建预置参数的函数

用 `arguments` 对象，我们可以让玩转各种 javascript trick。
见如下 `makeFunc` 函数的定义。
这个函数允许你代入一个函数引用和任意数量的参数给它，它会返回一个调用你指定的函数的匿名函数，
并在函数被调用时，一并代入预置参数和其它新参数。

```javascript
function makeFunc() {
	var args = Array.prototype.slice.call(arguments);
	var func = args.shift();
	return function() {
		return func.apply(null, args.concat(Array.prototype.slice.call(arguments)));
	};
}
```

代入 `makeFunc` 函数的第一个参数是你想调用的函数的引用(是的，在这个简单的例子中未做错误验证。)
并且它已从 `arguments` 数组中移除。
而后，`makeFunc` 返回一个使用 `Function` 对象的 `apply` 方法的匿名函数，用以调用你指定的那个函数。

`apply` 的第一个参数指向这个函数被调用时的作用域——基本上就是关键字 `this` 所指向的被调用的那个函数内部。
就现在而言，这个有点高级了，我们就先设为 `null` 好了。
第二个参数是一组将从该函数(匿名函数)的 `arguments` 对象转化而来的值的数组。
`makeFunc` 把原始的值的数组和匿名函数代入的 `arguments` 数组连结，并将它作为参数代入被调用的函数。

假如说，你想输出一条总是一个样的“模板信息”。
为了让你每次调用 `format` 函数时，不用不厌其烦的引用该模板文字，
你可以使用 `makeFunc` 这个实用的函数来返回一个会为你自动调用 `format` 函数并填充模板参数的函数：

```javascript
var majorTom = makeFunc(format, "This is Major Tom to ground control. I'm %1.");
```

你可以像这样重复调用 `majorTom` 函数：

```javascript
majorTom("stepping through the door");
majorTom("floating in a most peculiar way");
```

每次调用 `majorTom` 函数时，它会调用 `format` 函数并代入第一个参数和既定的模板文字。
上面的函数将返回：

```javascript
"This is Major Tom to ground control. I'm stepping through the door."
"This is Major Tom to ground control. I'm floating in a most peculiar way."
```

## 4、创建自引用的函数

你可能认为这些够酷了——等一下，`arguments` 还有一个惊喜给你。
它还有另一个有用的属性—— `callee`。
`arguments.callee` 包含一个创建 `arguments` 对象本身的函数的引用。
那么我们如何利用它呢？
`arguments.callee` 是一种匿名调用自身的便捷方式。

`repeat` 函数有三个参数——一个函数引用和两个数字。
第一个数字指定这个函数被调用多少次，而第二个代表两次调用间的延迟时间(以毫秒计)。

下面是 `repeat` 函数的定义：

```javascript
function repeat(fn, times, delay) {
	return function() {
		if(times-- > 0) {
			fn.apply(null, arguments);
			var args = Array.prototype.slice.call(arguments);
			var self = arguments.callee;
			setTimeout(function(){self.apply(null,args)}, delay);
		}
	};
}
```

`repeat` 函数通过 `arguments.callee` 获得其函数内部的匿名函数的引用，定义为变量 `self`。
这样，通过使用 `setTimeout` 方法，该匿名函数可在一段延时后再次调用自身。

这里有一个简单得不能再简单的函数，它代入一个字符串并弹出一个包含该字符串的警告框：

```javascript
function comms(s) {
	alert(s);
}
```

我想创建上面这个函数的特别版本，它重复 3 次，每次间隔 2 秒。使用 `repeat` 函数，我可以这么做：

```javascript
var somethingWrong = repeat(comms, 3, 2000);
somethingWrong("Can you hear me, major tom?");
```

`somethingWrong` 函数的运行结果是：每隔 2 秒弹出警告窗 3 次。

`arguments` 虽不常用、有点偏门，但充满惊喜，值得去了解！
