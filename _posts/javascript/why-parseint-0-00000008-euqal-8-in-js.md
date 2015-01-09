---
layout: post
title: 为什么 parseInt(0.0000008) === 8？
keywords: javascript, parseInt
category : javascript
tags : [javascript]
---

原文：[Why parseInt(0.0000008) === 8？](http://sdlyu.me/javascript/2015/01/04/why-parseint-0-00000008-euqal-8-in-js/)

作者：[@sdlyu](https://twitter.com/sdlyu)

--------------------

## IEEE 754

JavaScript 的数字系统是采用 <abbr title="IEEE浮点数算术标准（IEEE Standard for Floating-Point Arithmetic）" class="initialism">IEEE 754</abbr>，一开始看到这个问题，以为是 IEEE 754 导致的问题。

常见的问题有浮点数比较：

```javascript
console.log((0.1 + 0.2) == 0.3);  // false
console.log((0.1 + 0.2) === 0.3); // false
console.log(0.1 + 0.2); // 0.30000000000000004
```

后来发现这问题并不会导致 `parseInt(0.0000008)` 变成 `8`，那么问题就可能在 `parseInt` 这个函数上。

## parseInt
> `parseInt(string, radix)`

`parseInt` 接受两个参数，第一个参数是要转换的字符串（忽略空白）；第二个参数是基数。

例如：

```javascript
parseInt('   12', 10);  // 12
parseInt('12**', 10);   // 12
parseInt('12.34', 10);  // 12
parseInt(12.34, 10);    // 12
```

最后一个例子让我们看到 `parseInt` 可以将数字类型转换成整数，但最好别这么做。

再来看下面这个例子：

```javascript
parseInt(1000000000000000000000.5, 10); // 1
```

为什么会这样呢？

`parseInt` 的第一个类型是字符串，所以会将传入的参数转换成字符串，也就是 `String(1000000000000000000000.5)` 的结果为 `'1e+21'`。`parseInt` 并没有将 `'e'` 视为一个数字，所以在转换到 `1` 后就停止了。

这也就可以解释 `parseInt(0.0000008) === 8`：

```javascript
String(0.000008);  // '0.000008'
String(0.0000008); // '8e-7'
```

从上面的程式码可以看出，小于 `0.0000001`（1e-7） 的数字转换成 `String` 时，会变成[科学记号法](http://zh.wikipedia.org/wiki/%E7%A7%91%E5%AD%A6%E8%AE%B0%E6%95%B0%E6%B3%95)，再对这个数进行 `parseInt` 操作就会导致这个问题发生。

## 结论

不要将 `parseInt` 当做转换 `Number` 和 `Integer` 的工具。

再补上一些悲剧：

```javascript
parseInt(1/0, 19);      // 18
parseInt(false, 16);    // 250
parseInt(parseInt, 16); // 15
parseInt("0x10");       // 16
parseInt("10", 2);      // 2
```

## 参考资料

+ [parseInt() doesn’t always correctly convert to integer](http://www.2ality.com/2013/01/parseint.html)
+ [types & grammar": address parseInt() crazy](https://github.com/getify/You-Dont-Know-JS/issues/45)