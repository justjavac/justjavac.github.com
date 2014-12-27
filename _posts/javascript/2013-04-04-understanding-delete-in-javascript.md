---
layout: post
title: javascript 中的 delete
keywords: javascript,delete
category : javascript
tags : [javascript, delete]
---

原文：[Understanding delete](http://perfectionkills.com/understanding-delete/)

译文：[javascript 中的 delete](http://justjavac.com/javascript/2013/04/04/understanding-delete-in-javascript.html)

译者：[justjavac](http://weibo.com/justjavac)

----------------------------------------------------

在这篇文章中作者从《[JavaScript面向对象编程指南](http://www.amazon.cn/gp/product/B00BLZMC4K/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00BLZMC4K&linkCode=as2&tag=jsbook-23)》一书中关于 delete 的错误讲起，详细讲述了关于 delete 操作的实现，
局限以及在不同浏览器和插件（这里指 firebug）中的表现。

下面翻译其中的主要部分。

...书中声称

> “函数就像一个普通的变量那样——可以拷贝到不同变量，甚至被删除”

并附上了下面的代码片段作为说明：

    >>> var sum = function(a, b) {return a+b;};
    >>> var add = sum;
    >>> delete sum;
    true
    >>> typeof sum;
    "undefined"

你能发现片段中的问题吗？
这个问题就是——删除 sum 变量的操作不应该成功；
delete 的声明不应该返回 true 而 typeof sum 也不应该返回为 undefined。
因为，javascript 中**不能够删除变量**，至少不能以这个方式声明删除。

那么这个例子发生了什么？
是打印错误或者玩笑？
应该不是。
这个片段是 firebug 控制台中的一个实际输出，而 Stoyan（上面所说书的作者）应该正是用它做的快速测试。
这仿佛说明了 firebug 有一些不同的删除规则。
正是 firebug 误导了 Stoyan！
那么这里面究竟是怎么回事呢？

为了回答这个问题，我们需要了解 delete 运算符在 Javascript 中是如何工作的：
哪些可以被删除，哪些不能删除以及为什么。
下面我试着解释一下这方面的细节。
我们将通过观察 firebug 的“奇怪”的表现而认识到它实际上完全不“奇怪”；
我们将深入了解那些，当我们声明变量、函数，赋值属性和删除它们时的，隐藏在背后的细节；
我们将看一下浏览器对此的实现和一些有名的 bug；
我们还会讨论到 ECMAScript 版本 5 中的严格模式(strict mode)以及它如何改变 delete 运算符的行为。

> 我在下面交替使用的 Javascript 和 ECMPScript 一般都指 ECMAScript(除非当明确谈到 Mozilla 的 JavaScript™ 实现时)。

意料之中的，网络上目前对于 delete 的解释非常少（笔者按：这篇文章写于 2010 年 1 月）。
MDC([MDN][]]) 的资源大概是这其中最详细的了，但不幸的是它遗漏了一些有趣的细节，这些细节中就包括了上述 firebug 的奇怪表现。
[MSDN 文档][msdn]几乎没什么用处。

[MDN]:https://developer.mozilla.org/en/JavaScript/Reference/Operators/Special_Operators/delete_Operator

[msdn]:http://msdn.microsoft.com/en-us/library/2b2z052x%28VS.85%29.aspx

## 一、理论 | Theory

那么，为什么我们能删除一个对象的属性：

    var x = { a: 1 };
    delete x.a; // true
    x.a; // undefined

但却不能删除一个变量：

    var x = 1;
    delete x; // false;
    x; // 1

也不能删除一个函数：

    function x() {};
    delete x; // false;
    typeof x; // "function"

注意：delete 只有当一个**属性无法被删除**时才返回 false。

为了理解这一点，我们需要首先把握一些概念：
变量实例化（variable instantiation）和属性的内部属性（property attributes）
（译者按：关于 property 和 attributes 的区别见[参考文章](http://www.cnblogs.com/winner/archive/2008/12/11/1353314.html)，根据下面涉及到的内容，拟译成内部属性）
——这些很少在 javascript 书中被提到。
在下面几段中我将试着简短地回顾这些内容，要理解它们并不难。
如果你并不关注它们表现背后的原因，可以跳过这一章。

### 1.1、代码的类型 | Type of code

ECMAScript 中有三类可执行代码：

1. 全局代码 Global code
2. 函数代码 Function code
3. Eval code

这几类的含义大致就像它们命名的那样，但还是快速地回顾一下：

1. 当一个源文件被看做是一个程序，它在全局作用域(scope)内执行，而这就被认为是一段全局代码 Global code。
在浏览器环境下，SCRIPT 元素的内容通常都被解析为一个程序，因而作为全局代码来执行。

2. 当然，任何在一段函数中直接执行的代码就被认为是一段函数代码 Function code，
在浏览器环境下，事件属性的内容（e.g. <a onclick="..."）通常都作为函数代码来解析和执行。

3. 最后，放入内建函数 eval 中的代码就作为 Eval code 来解析。
我们将很快看到为什么这一类型是特殊的。

### 1.2、代码执行的上下文 | Execution Context

当 ECMAScript 代码执行时，它总是发生在一个确定的执行上下文(context)中。
执行作用域是一个抽象实体，它有助于理解作用域和变量实例化的工作原理。
上面三类可执行代码都有各自的执行上下文。
当函数代码执行时，我们说控制端进入了函数代码的执行上下文；
当全局代码执行时，我们说控制端进入了全局代码的执行上下文，以此类推。

正如你所见，执行上下文在逻辑上是一个栈（stack）。
首先可能有一段全局代码，它拥有属于自己的执行上下文；
在这段代码中可能调用一个函数，这个函数同样拥有属于自己的执行上下文；
这个函数可能调用另一个函数，等等。
即使当函数递归调用自己时，在每一步调用中仍然进入了不同的执行上下文。

### 1.3、活化对象和变量对象 | Activation object / Variable object

每一个执行上下文都有一个与之相关联的变量对象（Variable object）。
和它相似的，变量对象也是一个抽象实体，一种用来描述变量实例化的机制。
而有趣的是，在一段源代码中声明的变量和函数事实上**被作为变量对象（Variable object）的属性（properties）而添加到变量对象中**。

当控制进入了全局代码的执行上下文时，一个全局对象被用作变量对象。
这恰恰是为什么全局声明的变量和函数**变成一个全局对象的属性**的原因：

    var GLOBAL_OBJECT = this;
    var foo = 1;
    GLOBAL_OBJECT.foo; // 1
    function bar() {};
    typeof GLOBAL_OBJECT.bar; // "function"
    GLOBAL_OBJECT.bar === bar; // true

Ok, 所以全局变量成了全局函数的属性，那么局部变量——那些在函数代码（Function code）中声明的变量呢？
事实上那很简单：他们也成了变量对象的属性。
唯一的区别是，在函数代码中，变量对象不是一个全局对象，
而是一个我们称之为活化对象（Activation object）。
每次进入函数代码的执行上下文时都会创建一个活化对象。

并非只有在函数代码中声明的变量和函数才成为活化对象的属性：
函数的每一个实参（arguments，以各自相对应的形参的名字为属性名），
以及一个特殊的Arguments对象(以arguments为属性名)同样成为了活化对象的属性。
需要注意的是，活化对象作为一个内部的机制事实上不能被程序代码所访问。

    (function(foo) {
        var bar = 2;
        function baz() {};
        /*
            在抽象的过程中，
            特殊的'arguments'对象变成了所在函数的活化对象的属性：
            ACTIVATION_OBJECT.arguments = arguments;
            ...参数'foo‘也是一样：
            ACTIVATION_OBJECT.foo; // 1
            ...变量'bar'也是一样：
            ACTIVATION_OBJECT.bar; // 2
            ...函数'baz'也是一样：
            typeof ACTIVATION_OBJECT.baz; // "function"
          */
    }) (1);


最后，Eval code 中声明的变量成为了**上下文的变量对象（context's Variable object）的属性**。
Eval code 简单地使用在它调用中的执行上下文的变量对象。

    var GLOBAL_OBJECT = this;
    eval('var foo = 1');
    GLOBAL_OBJECT.foo; // 1;

    (function() {
        eval('var bar = 2');

        /*
            在抽象过程中
            ACTIVATION_OBJECT.bar; // 2
        */
    }) ();


### 1.4、属性的内部属性 | Property attributes

就要接近主题了。
现在我们明确了变量发生了什么（它们成了属性），剩下的需要理解的概念就是属性的内部属性（property attributes）。
每一个属性拥有零至多个如内部属性——*ReadOnly，DontEnum，DontDelete和Internal**。
你可以把它们想象为标签——一个属性可能拥有也可能没有某个特殊的内部属性。
在今天的讨论中，我们所感兴趣的是 DontDelete。

当声明变量和函数时，它们成为了变量对象（Variable object）——要么是活化对象（在函数代码中），
要么是全局对象（在全局代码中）——的属性，这些属性**伴随生成了内部属性 DontDelete**。
然而，任何显式/隐式赋值的属性**不生成 DontDelete**。
而这就是本质上为什么我们能删除一些属性而不能删除其他的原因。

    var GLOBAL_OBJECT = this;

    /* 'foo'是全局对象的一个属性，
        它通过变量声明而生成，因此拥有内部属性DontDelete
        这就是为什么它不能被删除*/
    var foo = 1;
    delete foo; // false
    typeof foo; // "number"

    /* 'bar'是全局对象的一个属性，
        它通过变量声明而生成，因此拥有DontDelete子
        这就是为什么它同样不能被删除*/
    function bar() {};
    delete bar; // false
    typeof bar; // "function"

    /* 'baz'也是全局对象的一个属性，
        然而，它通过属性赋值而生成，因此没有DontDelete
        这就是为什么它可以被删除*/
    GLOBAL_OBJECT.baz = "baz";
    delete GLOBAL_OBJECT.baz; // true
    typeof GLOBAL_OBJECT.baz; // "undefined"

### 1.5、内建和DontDelete | Build-ins and DontDelete

所以这就是所有这一切发生的原因：属性的一个特殊的内部属性控制着该属性是否可以被删除。
注意：内建对象的一些属性拥有内部属性 DontDelete，因此不能被删除；
特殊的 arguments 变量（如我们所知的，活化对象的属性）拥有 DontDelete；
任何函数实例的 length (返回形参长度)属性也拥有 DontDelete：

    (function() {
        //不能删除'arguments'，因为有DontDelete
        delete arguments; // false;
        typeof arguments; // "object"

        //也不能删除函数的length,因为有DontDelete
        function f() {};
        delete f.length; // false;
        typeof f.length; // "number"
    }) ();

与函数 arguments 相关联的属性也拥有 DontDelete，同样不能被删除

    (function(foo,bar) {
        delete foo; // false
        foo; // 1

        delete bar; // false
        bar; // "bah"
    }) (1,"bah");

### 1.6、未声明的变量赋值 | Undeclared assignments

[你可能记得](http://perfectionkills.com/onloadfunction-considered-harmful/#how_does_it_work)，未声明的变量赋值会成为全局对象的属性，除非这一属性在作用域链内的其他地方被找到。
而现在我们了解了属性赋值和变量声明的区别——后者生成 DontDelete 而前者不生成——这也就是为什么未声明的变量赋值可以被删除的原因了。

    var GLOBAL_OBJECT = this;

    /* 通过变量声明生成全局对象的属性，拥有DontDelete */
    var foo = 1;

    /* 通过未声明的变量赋值生成全局对象的属性，没有DontDelete */
    bar = 2;

    delete foo; // false
    delete bar; // true

注意：内部属性是在属性生成时确定的，之后的赋值过程不会改变已有的属性的内部属性。
理解这一区别是重要的。

    /* 'foo'创建的同时生成DontDelete */
    function foo() {};

    /* 之后的赋值过程不改变已有属性的内部属性，DontDelete仍然存在 */
    foo = 1;
    delete foo; // false;
    typeof foo; // "number"

    /* 但赋值一个不存在的属性时，创建了一个没有内部属性的属性，因此没有DontDelete */
    this.bar = 1;
    delete bar; // true;
    typeof bar; // "undefined"

## 二、Firebug 的混乱 | Firebug confusion

那么， firebug 中发生了什么？
为什么在控制台中声明的变量能够被删除，而不是想我们之前讨论的那样？
我之前说过，Eval code 在它处理变量声明时有一个特殊的行为：
在 Eval code 中声明的变量事实上**生成一个没有 DontDelete 的属性**。

    eval('var foo = 1;');
    foo; // 1
    delete foo; // true
    typeof foo; // "undefined"

在函数代码中也是一样：

    (function() {
        eval('var foo = 1;');
        foo; // 1
        delete foo; // true
        typeof foo; // "undefined"
    }) ();

而这就是 Firebug 中异常行为的原因了。
所有在控制台中的调试文本似乎是以 Eval code 来编译和执行的，而不是在全局或函数代码中执行。
显然，其中的变量声明最终都生成了**不带 DontDelete 的属性**，所以可以被删除。
所以要小心普通的全局代码和 Firebug 控制台中代码的区别。

### 2.1、通过eval删除变量 | Delete variables via eval

这个有趣的 eval 行为，结合 ECMAScript 的另一个方面可以在技术上允许我们删除那些原本不能删除的属性。
这个方面是关于函数声明——在相同的执行上下文中它们能覆盖同名的变量：

    function x() { };
    var x;
    typeof x; // “function”

那么为什么函数声明拥有优先权而能覆盖同名变量（或者换句话说，变量对象(Variable object)的相同属性）呢？
这是因为**函数声明的实例化过程在变量声明之后**，因此可以覆盖它们。

（译者按：函数声明只能覆盖声明而未赋值的同名变量，如果在声明时赋值了值（e.g. var x = 1）则赋值值的过程在函数初始化之后，函数声明反而被变量赋值所覆盖，如下：）
 
    var x = 1;
    function x() { };
    typeof x; // "number"

函数声明不止替换了属性的值，同时**也替换了它的内部属性**。
如果我们通过 eval 来声明函数，这一函数也将用它自己的内部属性来替换之前的。
而由于在 eval 中声明的变量生成的属性没有 DontDelete，
实例化这个函数将在“理论上”**移除原属性已有的 DontDelete 内部属性**，
而使得这一属性可以删除（当然，同时也将值指向了新生成的函数）。

    var x = 1;
    /*不能删除，‘x’拥有DontDelete*/
    delete x; // false
    typeof x; // "number"

    eval('function x() { }');
    /* 属性'x'现在指向函数，并且应该没有DontDelete */
    typeof x; // "function"
    delete x; // 应该是‘true’;
    typeof x; // 应该是"undefined"

不幸的是，这种欺骗技术在我尝试的各个浏览器中都没有成功。
这里我可能错过了什么，或者这个行为太隐蔽而以至于各个浏览器没有注意到它。

（译者按：这里的问题可能在于：函数声明和变量声明之间的覆盖只是值指向的改变，
而内部属性 DontDelete 则在最初声明处确定而不再改变，而 eval 中声明的变量和函数，也只是在其外部上下文中未声明过的那部分才能被删除。
关于执行顺序，由于 eval 作为函数，它的调用永远在其外部上下文中其他变量和函数声明之后，
因此相关的内部属性也已确定，覆盖的只是值的指向。如下：）

    /*  第一个 alert 返回 “undefined”，因为赋值过程在声明过程和eval执行过程之后；
        第二个alert返回 “false”, 因为尽管x声明的位置在eval之后，
        但是eval的执行却在变量声明之后，因此已无法删除 */
    eval(' alert( x ); alert(delete x) ');
    var x = 1;

## 三、浏览器的遵守情况 | Browsers compliance

了解事物的工作原理是重要的，但实际的实现情况更重要。
浏览器在创建和删除变量/属性时都遵守这些标准吗？
对于大部分来说，是的。

我写了一个[简单的测试单元](http://kangax.github.com/jstests/delete_compliance_test/)来检查全局代码、函数代码和Eval代码的遵守情况。
测试单元同时检测了 delete 操作的返回值和属性是否像预期那样被删除。
delete 的返回值并不像它的实际结果那样重要，delete 操作返回 true 或 false 并不重要，
重要的是拥有/没有 DontDelete 的属性是否被删除。

现代浏览器总的来说还是遵守删除规则的，以下浏览器全部通过测试：
Opera 7.54+, Firefox 1.0+, Safari 3.1.2+, Chrome 4+。

Safari 2.x 和 3.0.4 在删除函数 arguments 时存在问题，似乎这些属性在创建时不带 DontDelete，因此可以被删除。
Safari 2.x 还有其他问题——删除无引用时（例如delete 1）抛出错误（译者按：IE 同样有）；
函数声明生成了可删除的属性（奇怪的是变量声明则正常）；
eval 中的变量声明变成不可删除（而 eval 中的函数声明则正常）。

与 Safari 类似，Konqueror（3.5，而非4.3）在 delete 无引用和删除 arguments 是也存在同样问题。

### 3.1、Gecko DontDelete bug

Gecko 1.8.x 浏览器—— Firefox 2.x, Camino 1.x, Seamonkey 1.x, etc.
——存在一个有趣的 bug：显式赋值值给一个属性能移除它的 DontDelete，即使该属性通过变量或函数声明而生成。

    function foo() { };
    delete foo; // false;
    typeof foo; // "function"

    this.foo = 1;
    delete foo; // true
    typeof foo; // "undefined"

令人惊讶的是，IE5.5-8 也通过了绝大部分测试，除了删除非引用抛出错误（e.g. delete 1，就像旧的 Safari）。
但是，虽然不能马上发现，事实上 **IE 存在更严重的 bug**，这些 bug 是关于全局对象。

## 四、IE bugs 

在 IE 中（至少在 IE6-8 中），下面的表达式抛出异常（在全局代码中）：

    this.x = 1;
    delete x; // TypeError: Object doesn't support this action

而下面则是另一个：

    var x =1;
    delete this.x; // TypeError: Cannot delete 'this.x'
    // 译者按：在IE8下抛出此异常，在IE6,7下抛出的是和上面一样的异常


这似乎说明，在 IE 中**在全局代码中的变量声明并没有生成全局对象的同名属性**。
通过赋值创建的属性（this.x = 1）然后通过 delete x 删除时抛出异常；
通过变量声明（var x = 1）创建的属性然后通过 delete this.x 删除时抛出另一个（译者按：在 IE6,7 下错误信息与上面的相同）。

但不只是这样，事实上通过显式赋值创建的属性**在删除时总是抛出异常**。
这不只是一个错误，而是创建的属性看上去拥有了 DontDelete 内部属性，而按规则应该是没有的：

    this.x = 1;
    delete this.x; // TypeError: Object doesn't support this action
    delete x; // TypeError: Object doesn't support this action

另一方面，未声明的变量赋值（那些同样生成全局对象的属性）又确实在IE下能够正常删除：

    x = 1;
    delete x; // true

但如果你试图通过 this 关键字来进行删除（delete this.x），那么上面的异常又将抛出：

    x = 1;
    delete this.x; //TypeError: Cannot delete 'this.x'

如果归纳一下，我们将发现在全局代码中‘delete this.x’永远不会成功。
当通过显式赋值来生成属性（this.x = 1）时抛出一个异常；
当通过声明/非声明变量的方式（var x = 1 or x = 1）生成属性时抛出另一个异常。
而另一方面，delete x 只有在显示赋值生成属性(this.x = 1)时才抛出异常。

在 [9 月我讨论了这个问题](https://groups.google.com/group/comp.lang.javascript/browse_thread/thread/22e6b2d147f57ee5/dda4dee3390fa71a)，其中 [Garrett Smith](http://dhtmlkitchen.com/) 认为在 IE 中全局变量对象（Global variable object）实现为一个 JScript 对象，而全局对象则由宿主对象实现。

我们能通过几个测试来在某种程度上确认这一理论。
注意，this 和 window 似乎引用同一个对象（如果 ‘===’运算符可以信任的话），
而变量对象 Variable object (函数声明的基础)则与 this 引用的不同。

    function getBase() { return this; };

    getBase() === this.getBase(); // false
    this.getBase() === this.getBase(); // true
    window.getBase() === this.getBase(); // true
    window.getBase() === getBase(); // false

## 五、误解 | Misconceptions

我们不能低估理解事物工作原理的重要性。
我看过网络上一些关于 delete 操作的误解。
例如，[Stackoverflow 上的一个答案](http://stackoverflow.com/questions/1596782/how-to-unset-a-javascript-variable/1596889#1596889)（而且等级还很高），里面解释说“delete is supposed to be no-op when target isn’t an object property”。
现在我们了解了 delete 操作的核心，也就清楚了这个答案是不正确的。
delete 不区分变量和属性（事实上在 delete 操作中这些都是引用），而只关心 DontDelete（以及属性是否已经存在）。

## 六、'delete'和宿主对象 | ’delete‘ and host object

一个 delete 的算法大致像这样：

    1. 如果运算元(operand)不是引用，返回 true
    2. 如果对象没有同名的**直接属性**，返回 true (如我们所知，对象可以是全局对象也可以是活化对象)
    3. 如果属性已经存在但有 DontDelete，返回 false
    4. 否则，删除移除属性并返回 true

然而，对于宿主对象（host object）的 delete 操作的行为却可能是不可预料的。
而事实上这并没有错：宿主对象（通过一定规则）允许实现任何操作，
例如读（内部[[Get]]方法）、写（内部[[Write]]方法）、删除（内部[[Delete]]方法），等等。
这种允许自定义[[Delete]]行为导致了宿主对象的混乱。

我们已经看到了在IE中的一些问题：当删除某些对象（那些实现为了宿主对象）属性时抛出异常。
一些版本的 firefox 当试图删除 window.location 时抛出异常（译者按：IE 同样抛出）。
同样，在一些宿主对象中你也不能相信 delete 的返回值，
例如下面发生在 firefox 中的(译者按：chrome 中同样结果；IE 中抛出异常；opera 和 safari 允许删除，并且删除后无法调用，姑且算’正常‘，尽管，从下面的讨论来看似乎却是不正常的，它们事实上删除了不能删除的属性，而前面的浏览器没有)：


    /* 'alert'是’window‘的一个直接属性（如果我们能够相信'hasOwnProperty'） */
    window.hasOwnProperty('alert'); // true

    delete window.alert; // true
    typeof window.alert; // "function"

delete window.alert 返回 true，尽管这个属性没有任何条件可能产生这个结果（按照上面的算法）：
它解析为一个引用，因此不能在第一步返回 true；
它是 window 对象的直接属性，因此不能在第二步返回 true；
唯一能返回 true 的是当算法达到最后一步同时确实删除这个属性，而事实上它并没有被删除。
（译者按：不，在 opera 和 safari 中确实被删除了...）。

所以这个故事告诉我们**永远不要相信宿主对象**。

## 七、ES5 严格模式 | ES5 strict mode

那么 ECMAScript 第 5 版中的严格模式将带来什么？
目前介绍了其中的一些限制。
当删除操作指向一个变量/函数参数/函数声明的直接引用时抛出 SyntaxError。
此外，如果属性拥有内部属性[[Configurable]] == false，将抛出 TypeError：

    (function(foo) {
        "use strict"; //在函数中开启严格模式

        var bar;
        function baz;
        delete foo; // SyntaxError，当删除函数参数时
        delete bar; // SyntaxError，当删除变量时
        delete baz; // SyntaxError，当删除由函数声明创建的变量时

        /* function实例的length拥有[[Configurable]] : false */
        delete (function() {}).length; // TypeError
    }) ();

而且，在严格模式下，删除未声明的变量（换句话说，未解析的引用），同样抛出 SyntaxError；
与它类似的，相同模式下未声明的赋值也将抛出异常（ReferenceError）

    "use strict";
    delete i_dont_exist; // SyntaxError

    i_dont_exist_either = 1; // ReferenceError

看了之前给出的变量、函数声明和参数的例子，相信现在你也理解了，所有这些限制都是有其意义的。
严格模式采取了更积极的和描述性的措施，而不只是忽略这些问题。

## 八、总结 | Summary

由于这篇文章已经很长了，因此我就不再讨论另一些内容（e.g.通过 delete 删除数组项及其影响）。
你可以翻阅 [MDC/MDN 上的文章](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Special_Operators/delete_Operator#section_5)或阅读规范然后自己测试。

下面是关于 Javascript 中 delete 如何工作的一个简单的总结：

* 变量和函数声明都是活化(Activation)全局(Global)对象的属性。
* 属性拥有内部属性，其中一个—— DontDelete 负责确定一个属性是否能够被删除。
* 全局代码或函数代码中的变量、函数声明都生成拥有 DontDelete 的属性。
* 函数参数同样是活化对象的属性，也拥有 DontDelete。
* Eval代码中的变量和函数声明都生成没有 DontDelete 的属性。
* 新的未声明的属性在生成时带空的内部属性，因此也没有 DontDelete。
* 宿主对象允许以任何它们期望的方式来响应删除过程。
