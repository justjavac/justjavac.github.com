---
layout: post
title: Javascript 的 10 个设计缺陷
description: Javascript 的 10 个设计缺陷
keywords: javascript
category : javascript
tags : [javascript]
---

## 一、为什么 Javascript 有设计缺陷？

这里有三个客观原因，导致 Javascript 的设计不够完善。

### 1. 设计阶段过于仓促

Javascript 的设计，其实只用了十天。
而且，设计师是为了向公司交差，本人并不愿意这样设计（参见《Javascript 诞生记》）。

另一方面，这种语言的设计初衷，是为了解决一些简单的网页互动（比如，检查"用户名"是否填写），
并没有考虑复杂应用的需要。
设计者做梦也想不到，Javascript 将来可以写出像 Gmail 这种极其庞大复杂的网页。

### 2. 没有先例

Javascript 同时结合了函数式编程和面向对象编程的特点，这很可能是历史上的第一例。
而且直到今天为止，Javascript 仍然是世界上唯一使用 Prototype 继承模型的主要语言。
这使得它没有设计先例可以参考。

### 3. 过早的标准化

Javascript 的发展非常快，根本没有时间调整设计。

1995年5月，设计方案定稿；
10 月，解释器开发成功；
12 月，向市场推出，立刻被广泛接受，全世界的用户大量使用。
Javascript 缺乏一个从小到大、慢慢积累用户的过程，而是连续的爆炸式扩散增长。
大量的既成网页和业余网页设计者的参与，使得调整语言规格困难重重。

更糟的是，Javascript 的规格还没来及调整，就固化了。

1996 年 8 月，微软公司强势介入，宣布推出自己的脚本语言 Jscript；
11 月，为了压制微软，网景公司决定申请 Javascript 的国际标准；
1997 年 6 月，第一个国际标准 ECMA-262 正式颁布。

也就是说，Javascript 推出一年半之后，国际标准就问世了。
设计缺陷还没有充分暴露就成了标准。
相比之下，C 语言问世将近 20 年之后，国际标准才颁布。

## 二、Javascript 的 10 个设计缺陷

### 1. 不适合开发大型程序

Javascript 没有名称空间（namespace），很难模块化；
没有如何将代码分布在多个文件的规范；
允许同名函数的重复定义，后面的定义可以覆盖前面的定义，很不利于模块化加载。

### 2. 非常小的标准库

Javascript 提供的标准函数库非常小，只能完成一些基本操作，很多功能都不具备。

### 3. null 和 undefined

`null` 属于对象（`object`）的一种，意思是该对象为空；
`undefined` 则是一种数据类型，表示未定义。

```javascript
typeof null; // object
typeof undefined; // undefined
```

两者非常容易混淆，但是含义完全不同。

```javascript
var foo;
alert(foo == null); // true
alert(foo == undefined); // true
alert(foo === null); // false
alert(foo === undefined); // true
```

在编程实践中，`null` 几乎没用，根本不应该设计它。

### 4. 全局变量难以控制

Javascript 的全局变量，在所有模块中都是可见的；
任何一个函数内部都可以生成全局变量，这大大加剧了程序的复杂性。

```javascript
a = 1;

(function(){
	b=2;
	alert(a);
})(); // 1

alert(b); //2
```

### 5. 自动插入行尾分号

Javascript 的所有语句，都必须以分号结尾。
但是，如果你忘记加分号，解释器并不报错，而是为你自动加上分号。
有时候，这会导致一些难以发现的错误。

比如，下面这个函数根本无法达到预期的结果，返回值不是一个对象，而是 `undefined`。

```javascript
function(){
	return
		{
			i=1
		};
}
```

原因是解释器自动在 `return` 语句后面加上了分号。

```javascript
function(){
	return;
		{
			i=1
		};
}
```

### 6. 加号运算符

`+` 号作为运算符，有两个含义，可以表示数字与数字的和，也可以表示字符与字符的连接。

```javascript
alert(1+10); // 11
alert("1"+"10"); // 110
```

如果一个操作项是字符，另一个操作项是数字，则数字自动转化为字符。

```javascript
alert(1+"10"); // 110
alert("10"+1); // 101
```

这样的设计，不必要地加剧了运算的复杂性，完全可以另行设置一个字符连接的运算符。

### 7. NaN

`NaN` 是一种数字，表示超出了解释器的极限。
它有一些很奇怪的特性：

```javascript
NaN === NaN; //false
NaN !== NaN; //true
alert( 1 + NaN ); // NaN
```

与其设计 `NaN`，不如解释器直接报错，反而有利于简化程序。

### 8. 数组和对象的区分

由于 Javascript 的数组也属于对象（`object`），所以要区分一个对象到底是不是数组，
相当麻烦。Douglas Crockford 的代码是这样的：

```javascript
if ( arr && 
	typeof arr === 'object' &&
		typeof arr.length === 'number' &&
		!arr.propertyIsEnumerable('length')){
			alert("arr is an array");
}
```

### 9. == 和 ===

`==` 用来判断两个值是否相等。
当两个值类型不同时，会发生自动转换，得到的结果非常不符合直觉。

```javascript
"" == "0" // false
0 == "" // true
0 == "0" // true
false == "false" // false
false == "0" // true
false == undefined // false
false == null // false
null == undefined // true
" \t\r\n" == 0 // true
```

因此，推荐任何时候都使用 `===`（精确判断）比较符。

### 10. 基本类型的包装对象

Javascript 有三种基本数据类型：字符串、数字和布尔值。
它们都有相应的建构函数，可以生成字符串对象、数字对象和布尔值对象。

```javascript
new Boolean(false);
new Number(1234);
new String("Hello World");
```

与基本数据类型对应的对象类型，作用很小，造成的混淆却很大。

```javascript
alert( typeof 1234); // number
alert( typeof new Number(1234)); // object
```

关于 Javascript 的更多怪异行为，请参见[Javascript Garden](http://bonsaiden.github.com/JavaScript-Garden/zh/)和 <http://wtfjs.com/>。

## 三、如何看待 Javascript 的设计缺陷？

既然 Javascript 有缺陷，数量还不少，那么它是不是一种很糟糕的语言？有没有前途？

回答是 Javascript 并不算糟糕，相反它的编程能力很强大，前途很光明。

首先，如果遵守良好的编程规范，加上第三方函数库的帮助，Javascript 的这些缺陷大部分可以回避。

其次，Javascript 目前是网页编程的唯一语言，只要互联网继续发展，它就必然一起发展。
目前，许多新项目大大扩展了它的用途，
[node.js](http://nodejs.org/) 使得 Javascript 可以用于后端的服务器编程，
[coffeeScript](http://jashkenas.github.com/coffee-script/) 使你可以用 python 和 ruby 的语法，撰写 Javascript。

最后，只要发布新版本的语言标准（比如 [ECMAscript 5](http://www.ecma-international.org/publications/standards/Ecma-262.htm)），就可以弥补这些设计缺陷。
当然，标准的发布和标准的实现是两回事，上述的很多缺陷也许会一直伴随到 Javascript 存在的最后一天。
