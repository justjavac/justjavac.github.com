---
layout: post
title: 写了 10 年 Javascript 未必全了解的连续赋值运算
description: 写了10年Javascript未必全了解的连续赋值运算
keywords: javascript
category : javascript
tags : [javascript, 赋值]
---

## 一、引子

```javascript
var a = {n:1};  
a.x = a = {n:2};  
alert(a.x); // --> undefined  
```

看 jQuery 源码 时发现的这种写法。
以上第二句 `a.x = a = {n:2}` 是一个连续赋值表达式。
这个连续赋值表达式在引擎内部究竟发生了什么？是如何解释的？
 
## 二、猜想

**猜想1**：从左到右赋值，`a.x` 先赋值为 `{n:2}`，但随后 a 赋值为 `{n:2}`，
即 a 被重写了，值为 `{n:2}`，新的 a 没有 x 属性，因此为 `undefined`。

步骤如下
 
```javascript
a.x = {n:2};
a = {n:2};
```

这种解释得出的结果与实际运行结果一致，貌似是对的。

> 注意「猜想1」中 a.x 被赋值过。
 
**猜想2**：从右到左赋值，a 先赋值为 `{n:2}`，`a.x` 发现 a 被重写后(之前 a 是 `{a:1}`)，
`a.x = {n:2}` 引擎限制 `a.x` 赋值，忽略了。

步骤如下：
 
```javascript
a = {n:2};
a.x 未被赋值{n:2}
```

等价于 `a.x = (a = {n:2})`，即执行了第一步，这样也能解释 `a.x` 为 `undefined` 了。

> 注意「猜想2」中 a.x 压根没被赋值过。
 
## 三、证明

上面两种猜想相信多数人都有，群里讨论呆呆认为是「猜想1」， 我认为是「猜想2」。其实都错了。
我忽略了引用的关系。

如下，加一个变量 b，指向 a。

```javascript
var a = {n:1};  
var b = a; // 持有a，以回查  
a.x = a = {n:2};  
alert(a.x);// --> undefined  
alert(b.x);// --> [object Object]  
```

发现 `a.x` 仍然是 `undefined`，神奇的是 `b.x` 并未被赋值过(比如：`b.x={n:2})`，却变成了 `[object Object]`。
b 是指向 `a({n:1})` 的，只有 `a.x = {n:2}` 执行了才说明b是有x属性的。
实际执行过程：从右到左，a 先被赋值为 `{n:2}`，随后 `a.x` 被赋值 `{n:2}`。
 
```javascript
a = {n:2};
a.x = {n:2};
```

等价于

```javascript
a.x = (a = {n:2});
```

与猜想2的区别在于 `a.x` 被赋值了，猜想2中并未赋值。
最重要的区别，第一步 `a = {n:2}` 的 a 指向的是新的对象 `{n:2}`， 第二步 `a.x = {n:2}` 中的 a 是 `{a:1}`。

即在这个连等语句

```javascript
a.x = a = {n:2};  
```

a.x 中的a指向的是 `{n:1}`，a 指向的是 `{n:2}`。

                  a.x  =  a  = {n:2}
                  │      │
          {n:1}<──┘      └─>{n:2}


## 四：解惑

这篇写完，或许部分人看完还是晕晕的。
因为里面的文字描述实在是绕口。

最初我在理解这个连等赋值语句时

```javascript
var a = {n:1};  
a.x = a = {n:2};  
```

认为引擎会限制 `a.x` 的重写（a 被重写后），实际却不是这样的。
指向的对象已经不同了。引擎也没有限制 `a.x={n:2}` 的重写。

## 五：结束

呵，以另一个连续赋值题结束。
fun 执行后，这里的 变量 b 溢出到 fun 外成为了全局变量。

想到了吗？

```javascript
function fun(){  
	var a = b = 5;  
}  
fun();  
alert(typeof a); // --> undefined  
alert(typeof b); // --> number  
```
