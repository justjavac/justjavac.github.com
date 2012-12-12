---
layout: post
title: 「译」你的 mixin 兼容 ECMAScript 5 吗？
description: 我最近在与客户合作的项目中，可以充分利用的ECMAScript 5，在此我遇到一个非常有趣的问题。该问题源于一个非常常见的模式： mixin，也就是在 JavaScript 中把一个对象的属性（包括方法） mixin 到另一个。
keywords: ECMAScript 5, JavaScript, mixin
category : javascript
tags : [ECMAScript 5, JavaScript, mixin]
---

原文：[Are your mixins ECMAScript 5 compatible?](http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/)

作者：Nicholas C. Zakas

译文：[你的 mixin 兼容 ECMAScript 5 吗？](http://justjavac.com/javascript/2012/12/11/are-your-mixins-ecmascript-5-compatible.html)

译者：[justjavac](http://justjavac.com)

好久没更新博客了，今天在 nczonline 看到了这篇博客，于是第一时间把它翻译了过来。英语水平有限，大家忍者点看，以下是正文：

我最近在与客户合作的项目中，需要充分利用的 ECMAScript 5，在此我遇到一个非常有趣的问题。
该问题源于一个非常常见的模式： **mixin** （译注：很多文章翻译成「混入」，我觉得还是保留原文吧。其流程程度不亚于 Closure，什么！你不知道？拜托，如果你是从火星来的，请自觉 Google 吧。[@justjavac](http://justjavac.com)），
也就是在 JavaScript 中把一个对象的属性或者方法 mixin 到另一个。

大多数 mixin 的功能看起来像这样：

    function mixin(receiver, supplier) {
        for (var property in supplier) {
            if (supplier.hasOwnProperty(property)) {
                receiver[property] = supplier[property];
            }
        }
    }

在此 mixin() 函数中，一个 for 循环遍历 supplier 对象的属性并赋值给 receiver 对象。
几乎所有的 JavaScript 库有某种形式的类似功能，让您可以编写这样的代码：

    mixin(object, {
        name: "Nicholas",

        sayName: function() {
            console.log(this.name);
        }
    });

    object.sayName();       // outputs "Nicholas"

在此示例中，object 对象接收了属性 name 和方法 sayName()。
这在 ECMAScript 3 中运行良好，但在 ECMAScript 5 上却没那么乐观。

这是我遇到的问题：

    (function() {

        // to be filled in later
        var name;

        mixin(object, {
            get name() {
                return name;
            }
        });

        // let's just say this is later
        name = "Nicholas";

    }());

    console.log(object.name);       // undefined
    
这个例子看起来有点做作，但它准确的描述这个问题。
进行 mixin 的属性使用了 ECMAScript 5 的新特性：一个 getter 属性存取器。
getter 引用一个未初始化的局部变量 `name`，因此这个属性未定义 undefined。

后来，name 被分配了一个值，以便使存取器 getter 可以返回一个有效的值。
不幸的是，object.name（被 mixin 的属性）始终返回 undefined。

这是怎么回事呢？

我们仔细分析 mixin() 函数。
事实上，在循环语句中，并没有把属性从一个对象重新赋值给到另一个对象。
它实际上是创建一个同名的属性，并把 supplier 对象的存取器方法 getter 的返回值赋值给了它。
（译注：目标对象得到的不是 getter 这个方法，而是得到了 getter 方法的返回值。[@justjavac](http://justjavac.com)）

在这个例子中，mixin() 的过程其实是这样的：

    receiver.name = supplier.name;

属性 receiver.name 被创建，并且被赋值为 supplier.name 的值。
当然，supplier.name 有一个 getter 方法用来返回本地变量 name 的值。
此时，name 的值为 undefined，所以 receiver.name 存储的是 **值**。
并没有为 receiver.name 创建一个 getter 方法，因此它的值永远不会改变。
（译注：变量和值的区别我会在『[代码之谜](http://justjavac.com/codepuzzle/2012/09/25/codepuzzle-introduction.html)』中讲解。）

要解决这个问题，你需要使用属性描述符(译注：descriptor)将属性从一个对象 mixin 到另一个对象。
一个纯粹的 ECMAScript 5 版本的 mixin() 应该这样写：

    function mixin(receiver, supplier) {

        Object.keys(supplier).forEach(function(value, property) {
            Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
        });
    }

在这个新版本函数中，Object.keys() 用来获取一个数组，包含了 supplier 对象的所有枚举属性。
然后，foreach() 方法用来遍历这些属性。
调用 Object.getOwnPropertyDescriptor() 方法获取 supplier 对象的每个属性描述符（descriptor）。

由于描述符（descriptor）包含了所有的属性信息，包括 getter 和 setter 方法，
该描述符（descriptor）可以直接传递给 Object.defineProperty() ，用来在 receiver 对象上创建相同的属性。
使用这个新版本的 mixin() ，可以解决前面遇到的问题，从而得到你所期望的结果。
getter 方法被正确地从 supplier 传递到了 receiver。

当然，如果你仍然需要支持旧的浏览器，那么你就需要一个函数，回落的 ECMAScript 3：

    function mixin(receiver, supplier) {
        if (Object.keys) {
            Object.keys(supplier).forEach(function(value, property) {
                Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
            });
        } else {
            for (var property in supplier) {
                if (supplier.hasOwnProperty(property)) {
                    receiver[property] = supplier[property];
                }
            }
        }
    }

如果您需要使用一个 mixin() 函数，一定要仔细检查它在 ECMAScript 5 可以正常工作，特别是 getter 和 setter 方法。
否则，你会发现自己陷入像我一样的错误。