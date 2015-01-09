---
layout: post
title: 你的编程语言能这样做吗？
description: 你的编程语言能这样做吗？
keywords: javascript, 编程语言
category : javascript
tags : [javascript]
---

一日，你查看你的程序代码，你有两大块代码看起来几乎完全的一样。

事实上它们就是完全一样，除了一个代码里说的是“Spaghetti(意大利面条)”，
另一个代码里说的是“Chocolate Moose(巧克力慕丝)”。

```javascript
// 一个小例子：
alert("I'd like some Spaghetti!");
alert("I'd like some Chocolate Moose!");
```

这个例子恰好是用Javascript写的，但即使是你不懂Javascript，你也应该能看懂我说的。

当然，重复的代码看起来不太好。

所以你决定写一个函数：

```javascript
function SwedishChef( food ) {
	alert("I'd like some " + food + "!");
}

SwedishChef("Spaghetti");
SwedishChef("Chocolate Moose");
```

没错，这个例子很简单，但你可以想出一些更有实际价值的例子。
这样做是更好一些，有很多理由，这些理由估计你都听说过一万遍了。
可维护性，可读性，抽象 = 好！

现在，你又发现两块代码几乎完全一样，除了一块是不停的调用一个叫BoomBoom的函数，
而一块是不停的调用一个叫PutInPot的函数。
除此之外，这两块代码完全一样。
 
```javascript
alert("get the lobster");
PutInPot("lobster");
PutInPot("water");

alert("get the chicken");
BoomBoom("chicken");
BoomBoom("coconut");
```

现在，你需要一个途径，把一个参数传递到一个函数里，而这个参数本身是个函数。
这是一个很重要的功能，它是一个好的方法，能让你发现函数中存在的重复的代码，减少这样的重复。

```javascript
function Cook( i1, i2, f ) {
	alert("get the " + i1);
	f(i1);
	f(i2);
}

Cook( "lobster", "water", PutInPot );
Cook( "chicken", "coconut", BoomBoom );
```

看见了没！
我们把一个函数当做了参数。

你的语言能这样做吗？

且慢… 如果你还没有写出PutInPot 或 BoomBoom 函数呢。
如果你能把他们写成内联函数，而不是要在其它地方先声明，这样是不是更好？

```javascript
Cook( "lobster",
	  "water",
	  function(x) { alert("pot " + x); }  );
Cook( "chicken",
	  "coconut",
	  function(x) { alert("boom " + x); } );
```

老天，这太方便了。
注意到了没有，我即时创建了一个方法，甚至都不用麻烦给它起名，只需掂着它的耳朵把它丢进函数里。

当你开始思考把匿名函数当作参数时，你也许会注意到有一种代码到处都是，就是，遍历数组里的所有元素进行操作。

```javascript
var a = [1,2,3];

for (i=0; i<a.length; i++) {
	a[i] = a[i] * 2;
}

for (i=0; i<a.length; i++) {
	alert(a[i]);
}
```

对数组里的每个元素进行操作是一种很常见的动作，你可以写出一个函数，让它为你做这些：

```javascript
function map(fn, a) {
	for (i = 0; i < a.length; i++) {
		a[i] = fn(a[i]);
	}
}
```

现在，你可以把上面的代码重写成这样：

```javascript
map( function(x){return x*2;}, a );
map( alert, a );
```

另一个常见的跟数组相关的操作是，通过某种方式把数组里的所有值组合到一起。

```javascript
function sum(a) {
	var s = 0;
	for (i = 0; i < a.length; i++) {
		s += a[i];
	}
	return s;
}

function join(a) {
	var s = "";
	for (i = 0; i < a.length; i++) {
		s += a[i];
	}
	return s;
}

alert(sum([1,2,3]));
alert(join(["a","b","c"]));
```

sum 和 join 看起来非常的相似，你也许会想把它们的通用之处提取出来做成一个能把数组里的元素合并成一个值的通用函数：

```javascript
function reduce(fn, a, init) {
	var s = init;
	for (i = 0; i < a.length; i++)
		s = fn( s, a[i] );
	return s;
}

function sum(a) {
	return reduce( function(a, b){ return a + b; },
				   a, 0 );
}

function join(a) {
	return reduce( function(a, b){ return a + b; },
				   a, "" );
}
```

很多老式的语言根本没有方法做出这种事情。
另外一些语言允许你做这些，但不容易(例如，C语言里有函数指针，但你必须进行声明，并要在什么地方定义它)。
面向对象的语言并没有被证实可以允许你对函数做所有的操作。

如果你想在Java里把函数作为一个一等(First Class)对象，你需要建一个只包含一个用来调用功能点的方法的整个对象。
把这种现象跟实际情况联系起来，很多的面向对象语言都会要求你为每个class创建一个完整的文件，非常的没效率。
如果你的编程语言里要求你去这样的调用功能点，那你根本没有享受到现代语言环境给你带来的所有好处。
看看能否退货吧，挽回一点损失。

写这样的小函数，只是做一些遍历数组，处理其中的每个元素的操作，这样做究竟能得到多少好处？

那好，我们来回头看一看map这个函数。
当你需要对数组里的每个元素依次做一些操作时，实际情况是，你并不在乎处理这些元素的顺序。
你可以向前或向后遍历整个数组，得到的结果是一样的，不是吗？ 
事实上，如果你的机器是2cpu的，你可以写出一些程序让每个cpu个处理一半的元素，你的map一下子就变快了2倍。

或者，只是个假设，在你遍布全球的数个数据中心里，你有成千上万的服务器，你有一个非常非常大的数组，
我说过，只是假设，它们装载着整个互联网的内容信息。
那现在，你就可以在你的成千上万的计算机上运行map函数，每个机器都能分摊掉计算中的一小部分任务。

所以，如今，举个例子，要想写出一个十分高效的能搜索整个互联网内容信息的代码，
你只需要简单的用基本搜索字符串当作参数来调用map函数就行了。

这里，我想请你们要真正注意的有趣的事情是，你会发现像map 和 reduce这样的函数每个人都可以使用，
当人们使用它时，你只需要找到一个编程能手写出最困难的调用map 和 reduce 函数的代码，
让它们能够运行在全球大量的并行执行的计算机上，而以前旧的运行的很好的代码只需要调用这个循环操作，
唯一不同的是，它们获得了比以前千万倍快的速度，这意味着你能做瞬间处理完巨大的计算工作。

让我再复述一遍。通过把通用的循环操作提取出来，你可以实现你想要的任何循环操作，
包括实现出一种能随硬件设备的增加而性能升级的效果。

我想现在你就该明白为什么我在前段时间写的一篇文章里[抱怨学校只教授计算机科学专业的学生Java知识而忽略其它](http://www.joelonsoftware.com/articles/ThePerilsofJavaSchools.html)：

> 缺乏对函数式编程的理解，你不可能发明出[MapReduce](http://labs.google.com/papers/mapreduce.html)——这个能够让Google实现大规模按需扩展和升级的算法。
> Map和Reduce这两个词来自于Lisp语言和函数式编程。
> 回首看来，MapReduce对于任何还存有记忆的人来说都意味着一种纯函数式的编程，没有副作用，易于并行计算。
> 事实恰巧是Google发明了MapReduce，而微软没有，这就说明了为什么微软仍然努力做那些基本的搜索功能研究的原因了，
> 而Google已经开始了它的下一个目标：开发它的Skynet^H^H^H^H^H^H——这世界上最大规模的并行超级计算机。
> 我并不觉得微软已经认识到在如今的潮流中它已经落后的多远。

那么，我希望现在你已经能理解了以函数为一等(First class)特征编程语言能使你更容易的对代码进行提炼抽象，
这意味着你的代码更短小，紧凑，可复用性强，更容易扩展升级。
大量的Google应用程序都使用了MapReduce，在他们优化程序或修改Bug时，都能从中得到益处。

现在我要说一点怨言牢骚，最高效的语言开发环境应该是一种能让你在不同层次上进行抽象归纳的语言环境。
笨拙陈旧的FORTRAN语言甚至不允许你写函数。
C语言里有函数指针，但实现的很丑陋，不能匿名，使用之前必须先进行声明实现。
Java允许你使用功能点调用(functor)，但更加丑陋。
就像Steve Yegge指出的，Java就是一个[名词的王国](http://justjavac.com/java/2012/07/23/execution-in-kingdom-of-nouns.html)。

纠正：我最后一次使用FORTRAN大概是27年前，很显然它现在有了函数了。
我还当是GW-BASIC呢。
