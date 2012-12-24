---
layout: post
title: 细数 javascript 容易被忽略的语法陷阱
description: 细数javascript容易被忽略的语法陷阱
keywords: javascript
category : javascript
tags : [javascript, 语法, 语法陷阱]
---

JavaScript 可算是世界上最流行的编程语言，它曾被 Web 开发设计师贴上噩梦的标签，
虽然真正的噩梦其实是 DOM API，这个被大量的开发与设计师随手拈来增强他们的 Web 前端的脚本语言，
如今越来越被重视，虽则如此，JavaScript 仍然拥有很多让人费解的东西。

 ## 1. 它以 Java 命名，但并不是 Java
 
 它最初叫 Mocha， 接着改名为 LiveScript，最后才确定命名为 JavaScript，
 根据历史记录，Java 的命名与 Netscape 和 Sun 之间的合作有关，
 作为交换条件，Netscape 在他们备受欢迎的浏览器中创建了 Java 运行时。
 
 值得一提的是，这个名字的出台几近一个玩笑，
 要知道，LiveScript 和 Java 在客户端脚本方面存在敌对关系。
 
不管怎么说，人们后来不得不一再澄清的一件事就是，JavaScript 和 Java 毫无关系。

> PS：我最喜欢的回答是：java和javascript就是“雷锋和雷锋塔的关系”。

## 2. Null 是个对象？

看看这段代码，它返回的是 object。

    console.log(typeof null); // object    
  
这实在令人费解，假如 null 表示空值，它怎么可以是对象？
简单说，它是 JavaScript 最初版本的错误，这个错误甚至被微软的 JScript 直接借用。

## 3. NaN !== NaN

NaN，表示一个非数字的值，然而问题是，NaN不等于任何东西，甚至不等于它自己。

    console.log(NaN === NaN); // false    
  
这显然不对，事实上，如果要判断一个值确实是 NaN，你需要用 `isNaN()` 函数。

## 4. 全局变量

对全局变量的依赖一直被视为 JavaScript 最坏的部分（ECMA 的 JavaScript 5 已经去掉了全局变量，
请参阅 ECMA 推出 JavaScript 5 - 译者注）。

对简单的页面，这无所谓，但复杂的页面，如果包含大量 JavaScript 脚本，
你很难知道某个全局变量是在哪里声明的，如果几个全局变量不小心重名，就会引发错误。

## 5. 那些统统被探测为 Mozilla User-Agent 的浏览器

必须承认，事实上，这不是 JavaScript  的错，是各个浏览器有意为之。

比如，以下是用 JavaScript 探测 Safari 时得到的结果：

    console.log(navigator.userAgent);     
    // Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10    

是否注意到其中的第一个单词 Mozilla/5.0，为什么 Safari 会被探测为 Mozilla，
尽管 Safari 后来已经纠正这一问题，但仍然不能解释为什么它们要这样误导开发者。

事实上，你会发现，绝大多数浏览器把他们的 User Agent 设置为 Mozilla，
答案要回到10年前，这更多是一种策略。
 
User Agent 是一段用来标识当前浏览器身份的字符串，世界上第一个浏览器 Mosaic， 曾这样标志自己：

    Mosaic/0.9     // browser name / version number   
  
这很合理，因此当 Netscape 出来的时候，它保留了 Mosaic 这个传统，
还在后面添加了一个加密方式部分。
 
    Mozilla/2.02 [en] (Win95; I)     // browser name / version / encryption   
 
到目前为止，一切安好，直到 IE3 发布，当 IE3 发布的时候，Netscape 正如日中天，
那时，很多服务器和程序已经部署了客户端探测机制，以便认出 Netscape，
虽然现在看来，这很值得争议，但当时并没什么。

当 IE 初次推出它们的 User Agent 标志的时候，是这个样子：

    MSIE/3.0 (Win95; U)    
 
这让 IE 很被动，因为 Netscape 已经能被很多服务器识别，
因此，开发者们干脆希望 IE 被误认为 Mozilla，
然后，再单独加一个 IE 的标签。

    Mozilla/2.0 (compatible; MSIE 3.0; Windows 95)    
  
如今，几乎所有浏览器都步 IE 后尘，将自己标识为 Mozilla，这大概是一种连锁反应。

## 6. 不一致的函数范围

参看以下代码： 
 
    function that will call a function with the name equal to parameter fn.     
    function foo(fn) {     
        if (typeof fn === "function") {     
            fn();     
        }     
    }     
       
    // Create an object with a property and a method.     
    var bar = {     
         barbar : "Hello, World!",     
         method  : function() {     
             alert(this.barbar);     
         }     
     };     
         
     bar.method(); // Alerts Hello, World!     
     foo(bar.method); // If we call the foo function add pass the "bar.method" method, it somehow alerts "undefined."     
     foo(function() { bar.method(); }); // alerts Hello, World, after    

 
foo(bar.method) 返回结果不同原因是，method 函数是被当作 windows 对象，
而不是 bar 下的对象调用的。

要解决这个问题，我们必须从传递的匿名函数中调用 bar.method() 。

## 7. 位操作符

JavaScript 和 Java 有不少共同之处，如位操作。

* & - and
* | - or
* ^ - xor
* ~ - not
* &gt;&gt; - signed right shift
* &gt;&gt;&gt; - unsigned right shift
* &lt;&lt; - left shift

看看第一个 & 操作符，使用 && 应该更有效，因为 JavaScript 和 Java 不一样，
JavaScript 没有整数，需要来回转换，因此，转换操作花的时间更长。

## 8. 太多的空值类型

诸如 null, false, undefined 一类的值几乎表示同样的意思，它们之间的不同又让人很迷惑。

## 9. 算术问题

虽然 JavaScript 包含很多算术操作，但你不妨运行一下下面的算式，
".2+.4" 应该等于 ".6" 是不是，然而返回的确是 "0.6000000000000001"。

JavaScript 在小数计算访问存在一些小问题。

    console.log(.2 + .4); // 0.6000000000000001    
 
为什么会这样？

简单说，因为 JavaScript 使用 IEEE 标准进行二进制浮点运算，
不过，对整数计算是没问题的。

10. 莫名其妙的代码错误

看看以下两段代码：

    // braces on the right     
    return {     
     foo : bar     
    };     
        
    // braces on their own line     
    return    
    {     
      foo : bar     
     };    
  
它们应该是一样的，只是 { 位置不同而已，是吧。

然而我们再看下面的代码：

    var foo = function() {     
          return {     
            a : 'b'    
        };     
        
    }();     
        
    alert(foo.a); // b     
 
如果我们把其中的
 
    return  {     
        a : 'b'    
    };    
   
换成
 
    return    
    {     
        a : 'b'    
    };     
 
就会引发错误，这是因为 JavaScript 有一个功能，
会纠正它认为错误的代码书写，它会自作聪明地在 return 这个词后面插入一个 ";" ，
错误因此而生。
 
    return; // JS incorrectly adds this semicolon.     
    {     
        a : 'b'; // It'll add a semicolon here as well, because it doesn't realize that this is an object.     
    };    

## 附：
1. 

        parseInt('06') -> 6   
        parseInt('07') -> 7   
        parseInt('08') -> 0   
        parseInt('09') -> 0   
        parseInt('10') -> 10  

这是很多语言都会有的问题，就是0开始的数字都是八进制。

2. 

        ''        ==   '0'           //false   
        0         ==   ''            //true   
        0         ==   '0'           //true   
        false     ==   'false'       //false   
        false     ==   '0'           //true   
        false     ==   undefined     //false   
        false     ==   null          //false   
        null      ==   undefined     //true   
        " \t\r\n" ==   0             //true  

3. 
        2 == [2]   
          
        // Even stranger   
        2 == [[[2]]]   
          
        // And down-right nutty   
        var a = { "abc" : 1 };   
        a[[[["abc"]]]] === a["abc"]; // this is also true  

 归根结底，原因还是一样——javascript是若类型语言。
 
4. 

    var a = {};   
    a.b === undefined; // true because property b is not set   
    undefined = 42;   
    a.b === undefined; // false  

    var a = {};   
    typeof a.b == "undefined"; // always true  

在javascript中，你可以改变undefined的值。

5. 最不可思议，但又合乎道理的。

        alert(111111111111111111111)     // 输出111111111111111110000  

其实这不能怪javascript，只能怪IEEE。

既然提到了IEEE，那再来一个。
 
很奇怪的是，这个本该输出1或1.0的式子，输出的居然是0.9999999999999999
 
6. 

        typeof null // object   
        null === Object // false  
        
        1. 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1  

