---
layout: post
title: Fake operator overloading in JavaScript
keywords: javascript, overloading
category : javascript
tags : [javascript]
---

原文：[Fake operator overloading in JavaScript](http://www.2ality.com/2011/12/fake-operator-overloading.html)

译文：[Fake operator overloading in JavaScript](http://justjavac.com/javascript/2013/04/22/fake-operator-overloading-in-javascripts.html)

译者：[未翻译]()

----------------------------------------------------

This post describes how to do a limited version of operator overloading in JavaScript. 
With the technique described here, you’ll be able to implement a type `StringBuilder` that can be used as follows:

    var sb = new StringBuilder();
    sb << add("abc") << add("def");

And a type Point that can be used as follows:

    var p = new Point();
    p._ = new Point(1, 2) + new Point(3, 4) + new Point(5, 6);
    p._ = new Point(1, 2) * new Point(3, 4) * new Point(5, 6);

## Letting operators call methods

One version of real operator overloading works like this: Given the expression

    obj1 + obj2

The plus operator is applied to two objects. This triggers the method call

    obj1.operator+(obj2)

The closest thing you can achieve in JavaScript is fake operator overloading – triggering two method calls:

    obj1.valueOf()
    obj2.valueOf()

Those are made because `+` only works with primitive values and thus needs to convert `obj1` and `obj2` to primitives. 
It does so by invoking their `valueOf()` method. 
Fake operator overloading is much less useful than real operator overloading: 
You don’t get access to both operands at the same time and you can’t influence the value returned by `+`. 
We’ll later look at tricks that work around these limitations.

**What operators can be used for fake operator overloading? **
All operators that coerce (convert) their operands to primitives. 
The following two objects allow you to test which ones do:

    var obj1 = {
        valueOf: function () {
            console.log("valueOf1");
            return 1;
        }
    };
    var obj2 = {
        valueOf: function () {
            console.log("valueOf2");
            return 2;
        }
    };

For example:

    > obj1 + obj2
    valueOf1
    valueOf2
    3

The following binary operators coerce:

    + - * / % 
    & | ^ << >> >>>
    < <= > >=

Equality operators, inequality operators, and boolean operators can work with objects and thus don't coerce. 
For example:

    > obj1 === obj2
    false
    > obj1 && obj2
    { valueOf: [Function] }

**Triggering calls. **
If its operands are produced by function calls, then a binary operator triggers a total of four function (or method) calls: 
First, it evaluates the two operand expressions to values (in this case, objects). 
Then, it converts two objects to primitives. 
The following function allows us to examine what happens and in which order:

    function func(x) {
        console.log("func_"+x);
        return {
            valueOf: function() { console.log("valueOf_"+x) }
        };
    }

Let’s use it to examine the `<<` operator:

    > func("LEFT") << func("RIGHT")
    func_LEFT
    func_RIGHT
    valueOf_LEFT
    valueOf_RIGHT

Hence: First, the left operand is evaluated, then the right operand. 
Next, the left value is converted to a primitive, then the right value. 
It is slightly perplexing to see that `valueOf_LEFT` does not happen directly after `func_LEFT`, 
but it makes sense if you think of function calls, 
where one also first evaluates the parameters before executing the function body. 
Some operators even convert their right operands first:

    > func("LEFT") > func("RIGHT")
    func_LEFT
    func_RIGHT
    valueOf_RIGHT
    valueOf_LEFT

## Implementing StringBuilder

Recap: We want `StringBuilder` to behave as follows:

    var sb = new StringBuilder();
    sb << add("abc") << add("def");
    console.log(sb.toString()); // abcdef

Fake operator overloading allows us to do this:

    function StringBuilder() {
        this.data = "";
    }
    
    // Called by <<
    StringBuilder.prototype.valueOf = function () {
        StringBuilder.current = this;
    };
    
    // Used to access the aggregated string
    StringBuilder.prototype.toString = function () {
        return this.data;
    };

    function add(value) {
        return {
            valueOf: function () {
                StringBuilder.current.data += value;
            }
        }
    }

Explanation: The `<<` operator calls `StringBuilder.prototype.valueOf` which marks the current instance as 
the “receiver” of subsequent “messages” (by storing it in `StringBuilder.current`). 
The messages are sent via `add()`, which wraps its argument value in an object. 
When that object is contacted by the operator, it adds value to the current receiver.

## def.js – fake operator overloading used for an inheritance API

Tobias Schneider’s [def.js][defjs] is where I first saw the idea of fake operator overloading. 
def.js uses it to implement a small domain-specific language, giving you a rubyesque syntax for inheritance in JavaScript. 
Example:

[defjs]: https://github.com/justjavac/def.js "一个简单的 Ruby 风格的 JavaScript 继承"

    def ("Person") ({
        init: function(name){
            this.name = name;
        },

        speak: function(text){
            alert(text || "Hi, my name is " + this.name);
        }
    });

    def ("Ninja") << Person ({
        init: function(name){
            this._super();
        },

        kick: function(){
            this.speak("I kick u!");
        }
    });

    var ninjy = new Ninja("JDD");

    ninjy.speak();
    ninjy.kick();

There are two ways to use the API:

     (I) def ("Person") ({...})
    (II) def ("Ninja") << Person ({...})

Therefore, whatever is returned by `def()` must be both callable (i.e., a function) and a potential fake operand. 
Furthermore, there are two ways of invoking Person (which has been created by def.js):

* As a constructor: Then it simply produces a new instance.

* As a function: Then it must return an object that works as a fake operand.

Expression (II) is evaluated in three steps (simplified for the purpose of this explanation):

1. 	Perform the function call `def("Ninja")` which creates a new constructor `Ninja` and returns a function `D`. 
	`D` could be called, like in (I). 
	In which case it would add properties to `Ninja.prototype`. 
	But here it is used as a fake operand – `def()` has added the method `D.valueOf()` which will be invoked in step 3. 
	`D` is also stored in a global variable (hidden inside a closure).

2. 	`Person ({...})` is invoked as a function and stores two values inside `D`:

	* `D.props` holds `Person`’s argument
 	* `D.super` refers to `Person`

3. 	The operator calls `D.valueOf()` which first lets `Ninja` (which is still accessible via `D`’s closure) inherit from `D.super` and then calls `D` to add the properties stored in `D.props`.

## Triggering even more calls

`func()` above allowed us to get four function (and method) calls out of the following expression:

    func("LEFT") << func("RIGHT")

Can we rewrite `func()` to get even more calls? Yes, we can:

    function func(x) {
        console.log("func_" + x);
        return {
            valueOf: function () {
                console.log("valueOf_"+x);
                return {}; // not a primitive
            },
            toString: function () {
                console.log("toString_"+x);
                return 0; // a primitive
            },
        }
    }

The above implementation of `func()` gives us six calls:

    > func("LEFT") << func("RIGHT")
    func_LEFT
    func_RIGHT
    valueOf_LEFT
    toString_LEFT
    valueOf_RIGHT
    toString_RIGHT

The trick here is that `<<` internally performs a `ToNumber()` [1][] conversion. 
`ToNumber()` first tries `valueOf()`. 
If that method does not return a primitive value, it continues with `toString()`. 
If `toString()` does not return a primitive, either, then a `TypeError` is thrown. 
Note that `ToNumber()` only expects the result of either `valueOf()` or `toString()` to be a primitive which it then converts to a number. 
Hence, `toString()` returning a string is only enforced by convention in JavaScript.

## Detecting the operator

If you combine fake operator overloading with a setter, 
you can detect which operator is used [credit: inspired by an idea of Tobias Schneider’s]:

    var p = new Point();

    p._ = new Point(1, 2) + new Point(3, 4) + new Point(5, 6);
    console.log(p.toString()); // Point(9, 12)

    p._ = new Point(1, 2) * new Point(3, 4) * new Point(5, 6);
    console.log(p.toString()); // Point(15, 48)

This works as follows. 
Each of the operands of the plus operator is converted via `valueOf()`:

    Point.prototype.valueOf = function () {
        Point.operands.push(this);
        return 3;
    }

This method stores the operand we actually want to use away in a global variable. 
It then returns 3 (a value that the plus operator can work with). 
That number is the lowest natural number `x` for which all of the following expressions produce different results:

    x + x
    x - x
    x * x
    x / x

`p._` has a setter that receives the result of 3 being added, multiplied etc., 
figures out which operator was used and processes `Point.operands` accordingly.

    Object.defineProperty(Point.prototype, "_", {
        set: function (value) {
            var ops = Point.operands;
            var operator;
            if (ops.length === 2 && value === 0) { // 3 - 3
                operator = this.setSubtract;
            } else if (ops.length === 2 && value === 1) { // 3 / 3
                operator = this.setDivide;
            } else if (ops.length >= 2 && (value === 3 * ops.length)) {
                // 3 + 3 + 3 + ...
                operator = this.setAdd;
            } else if (ops.length >= 2 && (value === Math.pow(3, ops.length))) {
                // 3 * 3 * 3 * ...
                operator = this.setMultiply;
            } else {
                throw new Error("Unsupported operation (code "+value+")");
            }
            Point.operands = []; // reset
            return operator.apply(this, ops);
        }
    });

For addition and multiplication, the number `ops.length` of operands can be greater than 2. 
We therefore test the result value of the operator application as follows:

* Addition: `value === 3 * ops.length`

* Multiplication: `value === 3ops.length`

The full [source code](https://github.com/rauschma/op_overload) of Point is available on GitHub.

## How useful is fake operator overloading?

While fake operator overloading is a fun hack, you probably shouldn’t use it in production code: 
you cannot freely use the result computed by an operator and need side effects 
(such as storing values in global variables) to access all operands at the same time. 
Furthermore, many operands need to be wrapped in an object with a `valueOf()` method in order for this scheme to work. 
For example, we couldn’t use strings directly with StringBuilder, we had to convert them via `add()`. 
But at the very least, fake operator overloading allows you to impress your friends by unusual-looking code.

## Related reading

1. [ECMAScript 5.1 language specification][1], Sect. 9.3, “ToNumber”.
2. [JavaScript 并非所有的东西都是对象][2]

[1]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
[2]: http://justjavac.com/javascript/2012/12/22/javascript-values-not-everything-is-an-object.html