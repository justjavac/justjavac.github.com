---
layout: post
title: JavaScript：继承和原型链（译）
tags: [JavaScript, 翻译]
---

原文：[Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Inheritance_and_the_prototype_chain)

译者：[youngsterxyf](https://github.com/youngsterxyf)

对于具备基于类的编程语言（如Java或C++）经验的程序员来说，JavaScript有点混乱，因为它是一种动态语言，并且不提供`class`的实现（虽然关键字`class`是保留的，不可用作变量名）。

说到继承，JavaScript只有一种结构：对象。每个对象都有一个内部链接指向另一个对象，这个对象称为**原型** (prototype)。那个原型对象也有自己的原型，如此直到某个对象以`null`作为其原型。`null`，根据定义，没有原型，作为这种**原型链**的最后一环而存在。

##以原型链实现继承

###继承属性

JavaScript对象可看作是动态地装载属性（这里指**自有属性**）的"包包"，并且每个对象都有一个链指向一个原型对象。如下即为当尝试访问一个属性时发生的事情：

{% highlight js %}
// 假设有个对象o，其原型链如下所示：
// {a: 1, b: 2} ---> {b: 3, c: 4} ---> null
// 'a'和'b'是o的自有属性。

// 本例中，someObject.[[Prototype]]指定someObject的原型。
// 这完全是一种标记符号（基于ECMAScript标准中所使用的），不可用于脚本中。

console.log(o.a);   // 1
// o有一个自有属性'a'吗？是的，其值为1
 
console.log(o.b);   // 2
// o有自有属性'b'吗？是的，其值为2
// o的原型也有一个属性'b'，但是这里不会被访问。这被称为“属性隐藏”（property shadowing）

console.log(o.c);   // 4
// o有自有属性'c'吗？没有，检查它的原型
// o.[[Prototype]]有自有属性'c'吗？是的，其值为4。

console.log(o.d);   // undefined
// o有自有属性'd'吗？没有，检查其原型
// o.[[Prototype]]有自有属性'd'吗？没有，检查其原型
// o.[[Prototype]].[[Prototype]]为null，停止搜索，没有找到属性，返回undefined。
{% endhighlight  %}

将一个属性分配给一个对象会创建一个自有属性。对于获取和设置属性的行为规则，唯一的例外是当一个继承而来的属性带有一个[属性值获取器或设置器](https://developer.mozilla.org/en/docs/JavaScript/Guide/Working_with_Objects?redirectlocale=en-US&redirectslug=Core_JavaScript_1.5_Guide%2FWorking_with_Objects#Defining_getters_and_setters)。

###继承"方法"

JavaScript没有以基于类的编程语言定义方法的形式出现的"方法"。JavaScript中，任何函数都可以作为一个属性被添加到一个对象。一个继承而来的函数，操作起来与任何其他属性相同，包括如上所示的属性隐藏（在这里，称为*方法覆盖*）。

当执行一个继承而来的函数时，[this](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/this)的值指向继承对象，而不是原型对象，该函数是原型对象的自有属性。

{% highlight js %}
var o = {
    a: 2,
    m: function(b) {
        return this.a + 1;
    }
};
 
console.log(o.m()); // 3
// 这里当调用o.m时，'this'引用o

var p = Object.create(o);
// p是一个继承自o的对象
 
p.a = 12;   // 为p创建一个自有属性'a'
console.log(p.m()); // 13
// 这里调用p.m时，'this'引用p
// 因此，当p继承了o的函数m，'this.a'意味着p.a，p的自有属性'a'
{% endhighlight %}

## 创建对象的不同方式，以及由此产生的原型链

###以语法结构创建对象

{% highlight js %}
var o = {a: 1};

// 新创建的对象o有Object.prototype作为其[[Prototype]]
// o没有名为'hasOwnProperty'的自有属性
// hasOwnProperty是Object.prototype的自有属性。因此o从Object.prototype继承了hasOwnProperty
// Object.prototype以null为其prototype。
// o ---> Object.prototype ---> null
 
var a = ["yo", "whadup", "?"];

// 数组继承自Array.prototype（它具有indexOf, forEach等方法）。
// 该原型链如下所示：
// a ---> Array.prototype ---> Object.prototype ---> null

function f() {
    return 2;
}

// 函数继承自Function.prototype（它具有call，bind等方法）：
// f ---> Function.prototype ---> Object.prototype ---> null
{% endhighlight %}

###使用构造器

JavaScript中，"构造器""就"是一个恰好以[new操作符](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/new)调用的函数。

{% highlight js %}
function Graph() {
    this.vertexes = [];
    this.edges = [];
}

Graph.prototype = {
    addVertex: function(v) {
        this.vertexes.push(v);
    }
};

var g = new Graph();
// g是一个带有自有属性'vertexes'和'edges'的对象。
// 执行new Graph()后，g.[[Prototype]]是Graph.prototype的值。
{% endhighlight %}

###使用Object.create

ECMAScript
5引入了一个新方法：[Object.create](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create)。调用这个方法会创建一个新对象。这个对象的原型是该函数的第一个参数：

{% highlight js %}
var a = {a: 1};
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a);   // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty);  // undefined，因为d并不继承自Object.prototype
{% endhighlight %}
