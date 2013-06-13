---
layout: post
title: 谈 javascript 变量声明
keywords: javascript
category : javascript
tags : [javascript]
---

原文：[谈 javascript 变量声明](http://qingbob.com/blog/%E8%B0%88javascript%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E)

这篇文章还是对基础的复习，对面试经历的一个总结。

之前的面试中遇到过一道面试题

    var a = 10;
    (function () {
        console.log(a); 
        var a = 20;
    })()

* 短短 5 行代码 `console.log(a)` 的结果是什么？
* 如果把 `var a = 20;` 和 `console.log(a)` 语句顺序对调呢？

这道题目的答案是 `undefined`。不是 10。

关键在于 javascript 的变量声明有一个 hoisting 机制，变量声明永远都会被提升至作用域的最顶端（注意测试还只是声明，还没有赋值）。
其实上面的语句相当于：

    var a = 10;
    (function () {
        var a; // 在这里对变量hoisting，先声明
        console.log(a); 
        a = 20; // 再赋值
    })()

再精简一点:

    bla = 2
    var bla;
     
    // 这是分割线，上下代码的效果其实是一样的
     
    var bla;
    bla = 2;

也就是先使用，再声明（注意是声明，还没有赋值），这样一来，声明和赋值就被分开来了。
所以最佳实践都推荐最好在函数的顶端把需要使用的变量首先声明一遍。

同理，我们可以理解下面的代码也是会报错的

    f() // 明显这里有错，因为 f 还没有被赋一个函数
    var f = function () {
        console.log("Hello");
    }

但有一个问题，如果将上例 f 的函数声明修改一下，还会报错吗

    f() // 可以运行吗？
    function f() {
        console.log("Hello");
    }

这里我其实想强调的是两种函数声明的 `var f = function () {}` 和 `function f() {}` 差别。

事实上，javascript 中所有的**函数声明(function declarations)**和**变量声明(variable declarations)**都会被提升(hoisted)至它们所在作用域的最顶端。
需要注意的是函数声明只有一种，也就是 `function f() {}` 的形式。
而 `var f = function () {}` 是什么？
你可以理解为它是将一个匿名函数(当然也可以取函数名，下面会解释)赋值给了一个变量。

就哪上面两个例子来说，同样是想实现先使用再定义的效果。
只有第二种有用，虽然函数f在使用之后才定义，但是在 javascript 解释器中，它仍然是先于执行语句被定义的。

而第一个例子，执行的效果是这样的

    var f;
    f() // 没有定义任何函数，当然无法执行
    f = function () {
        console.log("Hello");
    }

这么看来，虽然 javascript 是允许先执行再声明，但**切勿这么做，请遵循先声明再使用的好习惯**。

再看看另一种情况，如果我把之前的函数定义

    var f = function () {};

1. 给右侧的匿名函数增加函数名
2. 以右侧函数名来执行函数
3. 能成功吗？

        var f = function ab() {};
        ab();

答案是否定的，因为上面的代码对f函数的定义是以**命名函数表达式(Named Function Expressions)**，而并非真正的函数声明，注意**该函数名只在该函数的作用域内有用**。
下面这段代码充分说明了它的意义：

    var f = function foo(){
        return typeof foo;
    };
    typeof foo; // "undefined"
    f(); // "function"

那么如此声明还有什么意义呢？好吧，就我目前找到的资料而言，这样做的好处就是便于调试。

接下来考虑一些意想不到的边缘，虽然我觉得一个程序员写出下面的代码有点自找苦吃，而且应该是在实战中避免的，但作为考试的题目来说是值得一说的。
比如对比下面两段代码:

    function value(){
        return 1;
    }
    var value;
    alert(typeof value);    //"function"


    function value(){
        return 1;
    }
    var value = 1;
    alert(typeof value);    //"number"

第一段代码想说明的是**函数声明会覆盖变量声明**，注意是声明，还没有赋值。
如代码中，虽然同名变量在函数后再次声明，但是 `typeof` 的结果仍然是 `function`

第二段代码想说明的是**函数声明不会覆盖变量赋值或者说初始化**，如代码所示

**Name Resolution Order**

为什么会有上面的结果，为什么函数的声明会覆盖变量的声明。
就是因为 name resolution order。
我不知道怎么翻译这个名词，暂且就翻译为**名称解析顺序**吧。

在 javascript 中，一个变量名(name)有四种方式进入作用域(scope)中

* **语言内置**，所有的作用域中都有 `this` 和 `arguments` 关键字
* **形式参数**，函数的参数在整个作用域中都是有效的
* **函数声明**
* **变量声明**

上面列出的四种顺序也正是由高到底的优先级的顺序（**关于这点我有所保留，我测试的结果是参数和函数的优先级都会比语言内置的优先级高，你可以把形式参数取名为 `arguments`，或者定义一个函数名为 `arguments`，结果内置的 `argument` 说被覆盖了**），一旦一个变量名已经声明了，那么它就不可能被其他更低优先级的变量声明形式所覆盖。

## 参考文章:

1. [命名函数表达式探秘][1]
2. [function-declarations-vs-function-expressions][2] （墙）
3. [Javascript 作用域和变量提升][3]
4. [Zakas 解答 Baranovskiy 的 JavaScript 小测试][4]

[1]: http://justjavac.com/named-function-expressions-demystified.html
[2]: http://javascriptweblog.wordpress.com/2010/07/06/function-declarations-vs-function-expressions/
[3]: http://justjavac.iteye.com/blog/1886140
[4]: http://hikejun.com/blog/2010/01/27/zakas%E8%A7%A3%E7%AD%94baranovskiy%E7%9A%84javascript%E5%B0%8F%E6%B5%8B%E8%AF%95/