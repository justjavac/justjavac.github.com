---
layout: post
title: JavaScript：将所有值都转换成对象
description: 这是一篇关于原始值（primitive values）和包装对象（wrapper objects）之间的转换的文章。除非我们需要为原始值添加一些属性，但是原始值是不可改变的，因此需要把它转换为一个包装对象。
keywords: javascript,对象
category : javascript
tags : [javascript, 对象]
---

原文：[JavaScript: converting any value to an object](http://www.2ality.com/2011/04/javascript-converting-any-value-to.html)

译文：[JavaScript：将所有值都转换成对象](https://justjavac.com/javascript/2012/12/21/converting-any-value-to-an-object.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

这是一篇关于 **原始值（primitive values）和包装对象（wrapper objects）之间的转换** 的文章。
值得庆幸的是，在 JavaScript 中，我们一般不需要这么做。
除非我们需要为原始值添加一些属性，但是原始值是不可改变的，因此需要把它转换为一个 **包装对象**。

让我们从一个小测验开始： 

```javascript
({}).valueOf.call(myvar)
```

这段代码的作用是什么？

简单的回答：它把值类型转换成对象类型（对象保持不变，原始值转换为一个包装类型的实例）。

详细的解释需要翻阅 [ECMAScript 5 规范](http://www.ecma-international.org/publications/standards/Ecma-262.htm)（ECMA-262，第5版）。

> `({}).valueOf` 使用 `Object` 的一个实例来访问 `Object.prototype.valueOf`。

（译注：`{}` 字面量是 `Object` 的一个实例，如果直接写 '{}.valueOf' 则会出现解析错误，因为 javascript 引擎将 `{}` 解析成一个代码块。[@justjavac](http://weibo.com/justjavac)）

`call()` 方法将 `this` 设置为 `myvar`，然后调用 `Object.prototype.valueOf`，此方法没有传递任何参数。

`Object.prototype.valueOf`（ECMA-262，15.2.4.4）调用内部的抽象操作 `ToObject`（ECMA-262，9.9）。此操作将原始值转换为等值的包装对象。因此，给定一个值（value），你将得到一个对象（object）。

这有点不合逻辑，因为在 `Object` 的所有子类型中，`valueOf()` 方法是将包装对象转换为原始值（正好和上述描述相反）。

    > String.prototype.valueOf.call(new String("abc"))
    'abc'
    > String.prototype.valueOf.call("abc")
    'abc'
    > "abc".valueOf()
    'abc' // via String.prototype.valueOf()

    > Object.prototype.valueOf.call("abc")
    { '0': 'a'
    , '1': 'b'
    , '2': 'c'
    }
    > Object.prototype.valueOf.call(new String("abc"))
    { '0': 'a'
    , '1': 'b'
    , '2': 'c'
    }

然而，`Object.prototype.valueOf.call()` 虽然可以把一个值转换成对象，但是这个方法名太长了（译注：在提倡低碳生活的今天，我们可能要极力反对这么长的方法名 [@justjavac](http://weibo.com/justjavac)）。
另一种方法是使用 `Object()` 函数。

当 `Object` 被作为一个普通函数（而非构造函数）调用时，它的作用是类型转换[转换成对象]。[ECMA-262，15.2.1]

例子：

    > Object("abc") instanceof String
    true
    > Object(new String("abc")) instanceof String
    true
    > Object(null)
    {}

使用 `Object` 作为构造函数（使用关键词 `new`）基本上具有相同的效果，但作为一个函数，它更好地描述了哦一个事实：并不是每次都需要创建新的对象。 

## 参考

1. [JavaScript 并非所有的东西都是对象](https://justjavac.com/javascript/2012/12/22/javascript-values-not-everything-is-an-object.html)
    


