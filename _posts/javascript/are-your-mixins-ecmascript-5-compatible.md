---
layout: post
title: 「译」你的 mixin 兼容 ECMAScript 5 吗？（双语）
description: 我最近在与客户合作的项目中，可以充分利用的ECMAScript 5，在此我遇到一个非常有趣的问题。该问题源于一个非常常见的模式： mixin，也就是在 JavaScript 中把一个对象的属性（包括方法） mixin 到另一个。
keywords: ECMAScript 5, JavaScript, mixin
category : javascript
tags : [ECMAScript 5, JavaScript, mixin]
---

原文：[Are your mixins ECMAScript 5 compatible?](http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/)

作者：Nicholas C. Zakas

译者：[justjavac](http://justjavac.com)

I was working with a client recently on a project that could make full use of ECMAScript 5 
when I came across an interesting problem. 
The issue stemmed from the use of mixins, a very common pattern in JavaScript 
where one object is assigned properties (including methods) from another. 
Most mixin functions look something like this:

我最近在与客户合作的项目中，可以充分利用的ECMAScript 5，在此我遇到一个非常有趣的问题。
该问题源于一个非常常见的模式： **mixin** （译注：很多文章翻译成「混入」，我觉得还是保留原文吧。其流程程度不亚于 Closure，什么！你不知道？拜托，如果你是从火星来的，请自觉Google吧。[@justjavac](http://justjavac.com)），
也就是在 JavaScript 中把一个对象的属性（包括方法） mixin 到另一个。

大多数 mixin 的功能看起来像这样：

    function mixin(receiver, supplier) {
        for (var property in supplier) {
            if (supplier.hasOwnProperty(property)) {
                receiver[property] = supplier[property];
            }
        }
    }

Inside of the mixin() function, a for loop iterates over all own properties of 
the supplier and assigns the value to the property of the same name on the receiver. 
Almost every JavaScript library has some form of this function, 
allowing you to write code like this:

在此 mixin() 函数中，一个 for 循环遍历 supplier 对象的属性并赋值给 receiver 对象。
几乎所有的 JavaScript 库有某种形式的类似功能，让您可以编写这样的代码：

    mixin(object, {

        name: "Nicholas",

        sayName: function() {
            console.log(this.name);
        }

    });

    object.sayName();       // outputs "Nicholas"

In this example, object receives both the property name and the method sayName(). 
This was fine in ECMAScript 3 but doesn’t cover all the bases in ECMAScript 5.
The problem I ran into was with this pattern:

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
    
This example looks a little bit contrived, but is an accurate depiction of the problem. 
The properties to be mixed in include an ECMAScript 5 accessor property with only a getter. 
That getter references a local variable called name that isn’t initialized to 
a variable and so receives the value of undefined. 

这个例子看起来有点做作，但它准确的描述这个问题。
进行 mixin 的属性使用了 ECMAScript 5 的新特性：一个 getter 属性存取器。
getter 引用一个未初始化的局部变量 `name`，因此这个属性未定义 undefined。

Later on, name is assigned a value so that the accessor can return a valid value. 
Unfortunately, object.name (the mixed-in property) always returns undefined. 
What’s going on here?

后来，name 被分配了一个值，以便使存取器 getter 可以返回一个有效的值。
不幸的是，object.name（被 mixin 的属性）始终返回 undefined。

这是怎么回事呢？

Look closer at the mixin() function. 
The loop is not, in fact, reassign properties from one object to another. 
It’s actually creating a data property with a given name and assigning 
it the returned by accessing that property on the supplier. 
For this example, mixin() effectively does this:

我们仔细分析 mixin() 函数。
事实上，在循环语句中，并没有把属性从一个对象重新赋值给到另一个对象。
它实际上是创建一个同名的属性，并把 supplier 对象的存取器方法 getter 的返回值赋值给了它。
（译注：目标对象得到的不是 getter 这个方法，而是得到了 getter 方法的返回值。[@justjavac](http://justjavac.com)）

在这个例子中，mixin() 的过程其实是这样的：

    receiver.name = supplier.name;

The data property receiver.name is created and assigned the value of supplier.name. Of course, supplier.name has a getter that returns the value of the local name variable. At that point in time, name has a value of undefined, so that is the value stored in receiver.name. No getter is every created for receiver.name so the value never changes.

属性 receiver.name 被创建，并且被赋值为 supplier.name 的值。
当然，supplier.name 有一个 getter 方法用来返回本地变量 name 的值。
此时，name 的值为 undefined，所以 receiver.name 存储的是 **值**。
并没有为 receiver.name 创建一个 getter 方法，因此它的值永远不会改变。
（译注：变量和值的区别我会在『[代码之谜]（http://justjavac.com/codepuzzle/2012/09/25/codepuzzle-introduction.html）』中讲解。）

To fix this problem, you need to use property descriptors to properly mix properties from one object onto another. A pure ECMAScript 5 version of mixin() would be:

要解决这个问题，你需要使用属性描述符(译注：descriptor)将属性从一个对象 mixin 到另一个对象。
一个纯粹的 ECMAScript 5 版本的 mixin() 应该这样写：

    function mixin(receiver, supplier) {

        Object.keys(supplier).forEach(function(value, property) {
            Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
        });
    }

In this new version of the function, Object.keys() is used to retrieve an array of all enumerable properties on supplier. 
Then, the forEach() method is used to iterate over those properties. 
The call to Object.getOwnPropertyDescriptor() retrieves the descriptor for each property of supplier. 
Since the descriptor contains all of the relevant information about the property, including getters and setters, that descriptor can be passed directly into Object.defineProperty() to create the same property on receiver. 
Using this new version of mixin(), the problematic pattern from earlier in this post works as you would expect. 
The getter is correctly being transferred to receiver from supplier.

在这个新版本函数中，Object.keys() 用来获取一个数组，包含了 supplier 对象的所有枚举属性。
然后，foreach() 方法用来遍历这些属性。
调用 Object.getOwnPropertyDescriptor() 方法获取 supplier 对象的每个属性描述符（descriptor）。

由于描述符（descriptor）包含了所有的属性信息，包括 getter 和 setter 方法，
该描述符（descriptor）可以直接传递给 Object.defineProperty() ，用来在 receiver 对象上创建相同的属性。
使用这个新版本的 mixin() ，可以解决前面遇到的问题，从而得到你所期望的结果。
getter 方法被正确地从 supplier 传递到了 receiver。

Of course, if you still need to support older browsers then you’ll need a function that falls back to the ECMAScript 3 way:

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

If you’re using a mixin() function, be sure to double check that it works with ECMAScript 5, and specifically with getters and setters. Otherwise, you could find yourself running into errors like I did.

如果您需要使用一个 mixin() 函数，一定要仔细检查它在 ECMAScript 5 可以正常工作，特别是 getter 和 setter 方法。
否则，你会发现自己陷入像我一样的错误。