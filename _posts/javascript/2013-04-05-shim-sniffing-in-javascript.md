---
layout: post
title: 「译」JavaScript 当中的代码嗅探
keywords: javascript
category : javascript
tags : [javascript]
---

原文：[Shim sniffing](http://www.jspatterns.com/shim-sniffing/)

译文：[JavaScript 当中的代码嗅探](http://justjavac.com/javascript/2013/04/05/shim-sniffing-in-javascript.html)

译者：[yuezk](http://www.cnblogs.com/yuezk/)

----------------------------------------------------

除非有特殊需要，否则不要试图扩展原生对象和原型（prototype）：

    // 不要这样做
    Array.prototype.map = function() {
        // 一些代码
    };

除非这样做是值得的。例如，向一些旧的浏览器中添加一些 ECMAScript5 中的方法。

在这种情况下，我们一般这样做：

    if (!Array.prototype.map) {
        Array.prototype.map = function() {
            // 一些代码
        };
    }

如果我们比较偏执，为了防止别人将 map 定义为其它意想不到的值——比如 `true` 或其他，我们可以将检测代码改为下面这样：

    if (typeof Array.prototype.map !== "function") {
        Array.prototype.map = function() {
            // 一些代码
        };
    }

显然，这样做将破坏其它开发者的 map 定义，并影响他们功能的实现。
但是，在一个充满敌意和残酷竞争的环境下（换句话说，但你提供或者使用一个 js 库时），你不应该相信任何人。

如果其他人的 js 代码先于你的 js 代码加载，并且以某种方式定义了一个不完全兼容 ES5 的 `map()` 方法，导致你的代码不能正常运行，该怎么办呢？

不过，你可以相信浏览器，如果 Webkit 内核实现了 `map()` 方法，你可以放心，这个方法肯定会正常运行。
否则的话，你就要用你的代码进行检测了。

幸运的是，这在 JavaScript 当中很容易实现，当你调用原生函数的 toString 方法的时候，
会返回一个函数的字符串，该函数的函数体是 `[native code]`。

例如在 Chrome 的控制台下：

    > Array.prototype.map.toString();
    "function map() { [native code] }"

编写一个适当的代码检查向来就是一件令人不快的事，因为不同浏览器对空格和换行处理的太过轻率。
测试如下：

    Array.prototype.map.toString().replace(/\s/g, '*');
    // "*function*map()*{*****[native*code]*}*"  // IE
    // "function*map()*{*****[native*code]*}" // FF
    // "function*map()*{*[native*code]*}" // Chrome

只简单的去掉 `\s` 会得到更实用的字符串：

    Array.prototype.map.toString().replace(/\s/g, '');
    // "functionmap(){[nativecode]}"

你可以将它封装成一个可以重用的 `shim()` 函数，这样以来你就没有必要去重复所有的类似 `!Array.prototype...` 这样的操作了。
这个函数会接受一个对象作为参数（例如，`Array.prototype`），一个将要添加的属性（例如 'map'）和一个要添加的函数。

    function shim(o, prop, fn) {
        var nbody = "function" + prop + "(){[nativecode]}";
        if (o.hasOwnProperty(prop) && 
                o[prop].toString().replace(/\s/g, '') === nbody) {
            // 表名是原生的！ 
            return true;
        }
        // 新添加的 
        o[prop] = fn;
    }

测试：

    // 这是原生的方法
    shim(
        Array.prototype, 'map',
        function(){/*...*/}
    ); // true

    // 这是新添加的方法
    shim(
        Array.prototype, 'mapzer',
        function(){alert(this)}
    );

    [1,2,3].mapzer(); // alerts 1,2,3

（完）