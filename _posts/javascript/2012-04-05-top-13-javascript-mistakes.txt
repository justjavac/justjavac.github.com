---
layout: post
title: 开发者最容易犯的13个JavaScript错误
description: 开发者最容易犯的13个JavaScript错误
keywords: javascript
category : javascript
tags : [javascript]
---

# 开发者最容易犯的13个JavaScript错误

开发者最容易犯的JavaScript错误，总结出13个。
这些当中可能少不了你犯的错误。
我们描述了这些陋习，并列出来解决办法，希望对开发者有帮助。

## 1.for…数组迭代的用法 Usage of for..in to iterate Arrays

举例：

    var myArray = [ “a”, “b”, “c” ];
    var totalElements = myArray.length;
    for (var i = 0; i < totalElements; i++) {
        console.log(myArray[i]);
    }

这里主要的问题是语句中的“for…”不能保证顺序，这意味着你将获得不同的执行结果。
此外，如果有人增加一些其他自定义功能的函数Array.prototype，你的循环将重复遍历这些函数，就像原数组项。

解决办法：一直使用规则的for循环来遍历数组。

    var myArray = [ “a”, “b”, “c” ];
    for (var i=0; i<myArray.length; i++) {
        console.log(myArray[i]);
    }

## 2.数组维度Array dimensions

举例

    var myArray = new Array(10);

第二个问题是开发者使用数组构成器来创建数组，技术上是正确的，
然而会比文字符号（literal notation）慢解决办法：使用文字符号来初始化数组，
不要预定义数组长度。

    var myArray = [];

## 3.未定义属性 Undefined properties

举例：

    var myObject = {
        someProperty: “value”,
        someOtherProperty: undefined
    }

未定义属性，将在对象中创建元素（键‘someOtherProperty’和值‘undefined’.）。
如果你遍历数组，检测已存在的元素，那么下面的语句将都返回“未定义/undefined”

    typeof myObject['someOtherProperty'] // undefined
    typeof myObject['unknownProperty'] // undefined

解决办法：如果你想明确声明对象中的未初始化的属性，标记它们为Null（空）。

    var myObject = {
        someProperty: “value”,
        someOtherProperty: null
    }

## 4.闭包的滥用Misuse of Closures

举例：

    function(a, b, c) {
    var d = 10;
    var element = document.getElementById(‘myID’);
    element.onclick = (function(a, b, c, d) {
            return function() {
                alert (a + b + c + d);
            }
        })(a, b, c, d);
    }

这里开发者使用两个函数来传递参数a、b、c到onclick handler。
双函数根本不需要，徒增代码的复杂性。

变量abc已经在局部函数中被定义，因为他们已经在主函数中作为参数被声明。
局部函数中的任何函数都可创建主函数中定义的所有变量的闭包。
因此不需要再次传递它们。

看看这里JavaScript Closures FAQ了解更多。

解决办法：使用闭环来简化你的代码。

    function (a, b, c) {
    var d = 10;
    var element = document.getElementById(‘myID’);
    element.onclick = function() {
            //a, b, and c come from the outer function arguments.
            //d come from the outer function variable declarations.
            //and all of them are in my closure
            alert (a + b + c + d);
        };
    }

## 5.循环中的闭包Closures in loops

举例：

    var elements = document.getElementByTagName(‘div’);
    for (var i = 0; i<elements.length; i++) {
        elements[i].onclick = function() {
            alert(“Div number “ + i);
        }
    }

在这里例子里面，当用户点击不同的divs时，我们想触发一个动作(显示“Div number 1”, “Div number 2”… 等) 。
然而，如果你在页面有10个divs，他们全部都会显示“Div number 10”。

问题是当我们使用局部函数创建一个闭包时，函数中的代码可以访问变量i。
关键是函数内部i和函数外部i涉及同样的变量。
当我们的循环结束，i指向了值10，所以局部函数中的i的值将是10。

解决办法：使用第二函数来传递正确的值。

    var elements = document.getElementsByTagName(‘div’);
    for (var i = 0; i<elements.length; i++) {
        elements[i].onclick = (function(idx) { //Outer function
            return function() { //Inner function
                alert(“Div number “ + idx);
            }
        })(i);
    }

## 6.DOM对象的内测泄漏Memory leaks with DOM objects

举例：

    function attachEvents() {
        var element = document.getElementById(‘myID’);
        element.onclick = function() {
            alert(“Element clicked”);
        }
    };
    attachEvents();

该代码创建了一个引用循环。
变量元素包含函数的引用（归于onclick属性）。
同时，函数保持一个DOM元素的引用（提示函数内部可以访问元素， 因为闭包。）。

所以JavaScript垃圾收集器不能清除元素或是函数，因为他们被相互引用。
大部分的JavaScript引擎对于清除循环应用都不够 聪明。

解决办法：避免那些闭包，或者不去做函数内的循环引用。

    function attachEvents() {
        var element = document.getElementById(‘myID’);
        element.onclick = function() {
            //Remove element, so function can be collected by GC
            delete element;
            alert(“Element clicked”);
        }
    };
    attachEvents();

## 7.区别整数数字和浮点数字Differentiate float numbers from integer numbers

举例：

    var myNumber = 3.5;
    var myResult = 3.5 + 1.0; //We use .0 to keep the result as float

在JavaScript中，浮点与整数间没有区别。
事实上，JavaScript中的每个数字都表示使用双精度64位格式IEEE 754。
简单理解，所有数字都是浮点。

解决办法：不要使用小数（decimals），转换数字（numbers）到浮点（floats）。

    var myNumber = 3.5;
    var myResult = 3.5 + 1; //Result is 4.5, as expected

## 8.with()作为快捷方式的用法Usage of with() as a shortcut

举例：

    team.attackers.myWarrior = { attack: 1, speed: 3, magic: 5};
    with (team.attackers.myWarrior){
        console.log ( “Your warrior power is ” + (attack * speed));
    }

讨论`with()` 之前，要明白JavaScript contexts如何工作的。
每个函数都有一个执行context（语句），简单来说，包括函数可以访问的所有的变量。
因此context包含arguments和定义变量。

`with()` 真正是做什么？是插入对象到context链，它在当前context和父级context间植入。
就像你看到的 `with()` 的快捷方式会非常慢。

解决办法：不要使用with() for shortcuts，仅for context injection，如果你确实需要时。

    team.attackers.myWarrior = { attack: 1, speed: 3, magic: 5};
    var sc = team.attackers.myWarrior;
    console.log(“Your warrior power is ” + (sc.attack * sc.speed));

## 9.setTimeout/setInterval 字符串的用法 Usage of strings with setTimeout/setInterval

举例：

    function log1() { console.log(document.location); }
    function log2(arg) { console.log(arg); }
    var myValue = “test”;
    setTimeout(“log1()”, 100);
    setTimeout(“log2(” + myValue + “)”, 200);

`setTimeout()` 和 `setInterval()` 可被或一个函数或一个字符串作为首个参数。
如果你传递一个字符串，引擎将创建一个新函数（使用函数构造器），这在一些浏览器中会非常慢。

相反，传递函数本身作为首个参数，更快、更强大、更干净。

解决办法：一定不要使用strings for setTimeout()或setInterval()。

    function log1() { console.log(document.location); }
    function log2(arg) { console.log(arg); }
    var myValue = “test”;
    setTimeout(log1, 100); //Reference to a function
    setTimeout(function(){ //Get arg value using closures
            log2(arg);
        }, 200);

## 10.setInterval()的用法Usage of setInterval() for heavy functions

举例：

    function domOperations() {
        //Heavy DOM operations, takes about 300ms
    }
    setInterval(domOperations, 200);

`setInterval()` 将一函数列入计划被执行，仅是在没有另外一个执行在主执行队列中等待。
JavaScript引擎只增加下一个执行到队列如果没有另外一个执行已在队列。
这可能导致跳过执行或者运行2个不同的执行，没有在它们之间等待200ms的情况下。

一定要搞清，`setInterval()` 没有考虑进多长时间 `domOperations()` 来完成任务。

解决办法：避免 `setInterval()`，使用 `setTimeout()`

    function domOperations() {
        //Heavy DOM operations, takes about 300ms
        //After all the job is done, set another timeout for 200 ms
        setTimeout(domOperations, 200);
    }
    setTimeout(domOperations, 200);

## 11.“this”的滥用Misuse of ‘this’

这个常用错误，没有例子，因为非常难创建来演示。
this的值在JavaScript中与其他语言有很大的不同。
函数中的this值被定义是在当函数被调用时，而非声明的时间，这一点非常重要。

下面的案例中，函数内this有不同的含义。

* Regular function: myFunction(‘arg1’);

this points to the global object, wich is window for all browers.

* Method: someObject.myFunction(‘arg1’);

this points to object before the dot, someObject in this case.

* Constructor: var something = new myFunction(‘arg1’);

this points to an empty Object.

* Using call()/apply(): myFunction.call(someObject, ‘arg1’);

this points to the object passed as first argument.

## 12.eval()访问动态属性的用法Usage of eval() to access dynamic properties

举例：

    var myObject = { p1: 1, p2: 2, p3: 3};
    var i = 2;
    var myResult = eval(‘myObject.p’+i);

主要问题在于使用 `eval()` 开始一个新的执行语句，会非常的慢。

解决办法：使用方括号表示法（square bracket notation）代替 `eval()`。

    var myObject = { p1: 1, p2: 2, p3: 3};
    var i = 2;
    var myResult = myObject[“p”+i];

## 13.未定义(undefined)作为变量的用法Usage of undefined as a variable

举例：

    if ( myVar === undefined ) {
        //Do something
    }

在上面的例子中，未定义实际上是一变量。
所有的JavaScript引擎会创建初始化的变量window.undefined给未定义作为值。
然而 注意的是变量不仅是可读，任何其他的代码可以刚改它的值。
很奇怪能找到window.undefined有来自未定义的不同的值的场景，但是为什么冒险呢？

解决办法：检查未定义时，使用typeof。

    if ( typeof myVar === “undefined” ) {
        //Do something
    }
