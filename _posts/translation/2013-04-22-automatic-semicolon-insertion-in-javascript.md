---
layout: post
title: JavaScript 中的自动分号插入（ASI）
keywords: javascript,ASI
category : javascript
tags : [javascript, ASI]
---

原文：[Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)

译文：[JavaScript 中的自动分号插入（ASI）](http://justjavac.com/javascript/2013/04/19/automatic-semicolon-insertion-in-javascript.html)

译者：[@jackyqi](http://weibo.com/thankwsx)

----------------------------------------------------

在 JavaScript 中，行尾的分号有一种自动插入机制，这样子，可以容忍某些朋友忽略了输入分号。
当然你最好养成输入分号的习惯，同时掌握 JavaScript 是如何处理忽略输入分号的情况的，因为这种知识有助于你理解没有分号的代码。

## 1. 背景：JavaScript 语法

为了方便大家理解，首先介绍下基本的语法概念

## Expression(表达式) vs statement（语句）:

*   Expression: 表达式，执行之后都会有一个值

    例如:

        3 * Math.sqrt(x)
        i++
        obj.prop
        [ "a", "b", "c" ]
        { first: "Jane", last: "Doe" }
        function() {} // 函数表达式


*   Statement: 语句，每一个语句都会做些事情
    一个程序经常是由一系列的语句组成的

    例如:

        for(var i=0; i<3; i++) {
            console.log(i);
        }
        function twice(x) { // 函数声明
            return 2 * x;
        }
        var foo = twice(21); // 赋值

请注意，赋值语句的等号右侧是一个表达式。
**语句应该以分号结尾**:
除了下面这些语句，Javascript 中的每一个语句都应该以分号结尾。

* 循环语句: `for`, `while` (not `do-while`)
* 分支语句: `if`, `switch`, `try`
* 函数声明 (不是函数表达式)

例如: `while` vs `do-while`

    while(a > 0) {
        a--;
    } // 没有分号

    do {
        a--;
    } while(a > 0);

例如: 函数声明 vs 函数表达式

    function foo() {
    } // 没有分号

    var foo = function() {
    };

注意：如果你在上面语句的末尾增加一个分号，不会有任何错误。
因为解释器会将它认为是一个空语句。

**空语句**。 一个分号，只有一个分号的时候，它是一个空语句，并且什么也不干。
空语句可以出现在任何一个语句可以出现的地方。

有些情况当需要一个语句时，空语句是很有用的，但不是必须的。
这种情况下，块代码也是允许的，只是一个空的块比一个分号要长而已。

例如: 下面2个语句是等效的

    while(processNextItem() > 0);
    while(processNextItem() > 0) {}

假定 `processNextItem` 函数返回待处理的成员数目。

下面的程序同样语法上是正确：三个空语句。

    ;;;

**表达式作为语句**。任何表达式可以做为一个语句，只需要加一个分号结尾。

例如:

    "hello world";
    a + b;
    sum(5, 3);
    a++;

上面这些都是表达式语句。
前面的两句没有任何效果。
（译注：前面的两句指的是 `"hello world"` 和 `a + b`，这两个语句只产生临时结果，由于没与哦赋值，所以表达式的值会被丢弃。）

参加我以前的博文： [代码之谜（二）- 语句与表达式](http://justjavac.com/codepuzzle/2012/10/28/codepuzzle-expression-and-statement.html)

## 2. 自动插入分号机制(ASI)

"分号插入"只是一个术语，并不意味着代码在解析时会真正的插入什么分号。
这只是一个当分号是可有可无的时候的比喻或者解释。

**规范**: 语法解析器将换行视为当前语句的一部分，除非有一个显式的分号结束这一行。
下面给出一些示例代码，你以为也许会有一个分号被自动插入，但是，实际上却不是的。
这个例子充分说明了忽略分号的风险。

No ASI:

    a = b + c
    (d + e).print()

这样的代码不会触发“分号插入”, 因为括号可以跟上上一行的 `c`，形成一个函数调用。
上面的代码解释为：

    a = b + c(d + e).print();

No ASI:

    a = b
    /hi/g.exec(c).map(d);

同样没有分号插入, 第二行不会解释为正则表达式字面量，取而代之的是：

    a = b / hi / g.exec(c).map(d);

No ASI:

    var foo = "bar"
    [ "red", "green" ].foreach(function(c) { console.log(c) })

没有分号插入。 
相反，第二行开头被解释为字符串 `"bar"` 的下标索引。
逗号分隔符也是符号语法操作的(执行了逗号的左侧和右侧，并返回逗号的右侧)

No ASI: 在许多浏览器中，下面的代码将给 `func` 赋值为 `0`。因为 `a++` 被解释为上一行中函数表达式的参数了。

    var a = 0;
    var func = function(x) { return x }
    (a++)

**规范的例外**: ASI(分号插入)在下面的情况下是适用的：

*   **新的一行构成了非法的语法**: 如果新起了一行，并且这新的一行不能加到当前语句中时，会自动增加一个分号。

    例如:

        if (a < 0) a = 0
        console.log(a)

    该代码会触发“分号插入”，然后变成

        if (a < 0) a = 0;
        console.log(a);

*   **绝对禁止的行结束符**: 下面的语句结构禁止插入一个行结束符。

    如果在不该换行的地方换行了，就会插入一个分号，触发“分号插入”。
    在 ECMAScript 标准中，语法规则严格按照如下的产生式。

        后缀表达式
            左值表达式 [无行终结符] ++
            左值表达式 [无行终结符] --
        Continue 语句
            continue [无行终结符] 标识符? ;
        Break 语句
            break [无行终结符] 标识符? ;
        Return 语句
            return [无行终结符] 表达式? ;
        Throw 语句
            throw [无行终结符] 表达式? ;

    对于后缀表达式，遵循的原则是避免修改上一行的值。
    对于 `continue`, `break`, `return` 和 `throw`，遵循的原则是：如果他们不带参数，他们不会指向下一行（会被插入一个分号）。

    例如:

        a
        ++
        c

    触发ASI成为

        a;
        ++
        c

    例如:

        return
        a + b

    触发ASI成为

        return;
        a + b;

    Crockford 提供的示例:

        return
        {
          ok: false;
        };

    触发 ASI 并解释为空返回语句, 后面跟着一个块代码(一个 `ok `标签和语句表达式 `false`)，再后面跟着一个空语句（在结束的花括号后面）。
    实际上，如果你想返回对象字面量，应该这样写代码：

        return {
          ok: false;
        };


*   **块代码程序中的最后一条语句**: 在程序结尾，关闭花括号的之前的最后一条语句，遗漏的分号会被自动添加。
    下面的例子语法上是错误的，如果没触发“分号插入”的话。

        function add(a,b) { return a+b }

    “分号插入”会将上面代码变为：

        function add(a,b) { return a+b; }

    **“分号插入”不起作用的一些情况**

*   **for 循环头**: for 循环头内部不会自动插入分号。
    这是显然的，因为循环头内部的分号用来分隔参数，而我们本章讨论的自动插入分号的作用是结束一行。

    译者注：也许很多人不了解，我补充一个示例，一下代码是有语法错误的，别期望 ASI 会自动补充分号：

        for (
            i = 1
            i <= 10
            i ++
        ) {
            console.log(i);
        }
        

*   **导致空语句**: 如果分号会被解释为空语句，则下面的情况不会自动插入分号。

    例如:

        if (a > b)
        else c = d

    一般情况下, “分号插入”会被触发，因为 `else` 不能跟在 `if` 语句头后面。
    但是在 `if` 头后面插入一个分号会导致一个空语句。
    因为上面的代码会导致一个语法错误。如果你手动插入一个分号，结果就是：语法是正确的。

        if (a > b);
        else c = b

    注意，这条规则在下面的情况下是不需要的。
    因为花括号是可以跟在if头后面的，没有“分号插入”的风险。

        if (a > b)
        {
            c = a
        }

## 3. 建议

* 经常增加分号避免“分号插入”的困扰，至少你自己的代码要如此。虽然这样你可能要多打点字，但是在我来看，分号增加了代码可读性，因为我已经习惯他了。

* 不要将 ++ 或 -- 放在独立的一行。

* 如果 `return`, `throw`, `break`, `continue` 这些语句有参数，不要将参数放在独立的行。

* 保持一致（与 `return`）, 如果一个花括号或者方括号是表达式的一部分，不要将他们放在独立的一行。

    var obj = { // 不要将花括号放到新行
        name: "John"
    };
    var arr = [ // 不要将方括号放到新行
        5, 13, 29
    ];

比较:

    return {
        name: "John"
    };

## 4. 相关资料

1. [ECMAScript 语言规范，第5版](http://www.ecma-international.org/publications/standards/Ecma-262.htm)，第7.9节。[本文的一些示例来自这本书。]

2. [JavaScript 的分号插入](http://inimino.org/~inimino/blog/javascript_semicolons) [In-depth coverage, inspiration for the section on empty statements and the ++ example.]
