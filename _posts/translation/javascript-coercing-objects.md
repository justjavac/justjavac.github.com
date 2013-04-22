---
layout: post
title: Coercing objects to primitives
keywords: javascript, object, primitive
category : javascript
tags : [javascript]
---

原文：[Coercing objects to primitives](http://www.2ality.com/2012/11/coercing-objects.html)

译文：[]()

译者：[未翻译]()

----------------------------------------------------

This blog post looks at how JavaScript coerces objects to primitives. 
If you don’t know the difference between primitive values and objects, 
I suggest you consult my article “[Categorizing values in JavaScript][]”（感谢紫云飞翻译的中文版[JavaScript:如何判断值的类型](http://www.cnblogs.com/ziyunfei/archive/2012/10/11/2717057.html)） at the Adobe Developer Connection. 
This post was triggered by the [following tweet][] by David Bruant:

[Categorizing values in JavaScript]: http://www.adobe.com/devnet/html5/articles/categorizing-values-in-javascript.html
[following tweet]: https://twitter.com/DavidBruant/status/273451064764805120

	!!(new Boolean(false)) #wtfjs

The result of the above expression is `true`. 
Let us first learn about coercion in JavaScript. 
We can then use that knowledge to understand this result.

## 1. Coercion

Many operators and functions in JavaScript expect their arguments to have certain types. 
If they don’t, they are coerced (converted) to those types. 
Coercing an object to a primitive type is a two-step process: First, the object is converted to a primitive. 
Then, if necessary, the primitive is converted to the correct type. 
Two methods are used to convert an object to a primitive:

1. `valueOf()`
2. `toString()`

There are three conversion algorithms:

1. “Number”: you expect the value to be a number.
2. “String”: you expect the value to be a string.
3. “Default”: you don’t have any expectations for the value.

The number algorithm first calls `valueOf()` and uses the returned value if it is primitive. 
Otherwise, it calls `toString()` and uses its value if it is primitive. 
Otherwise, an exception is thrown. 
The string algorithm calls the methods in reverse order. 
The default algorithm is “number” for non-dates and “string” for dates.

Let’s try out coercion via the following object:

    var obj = {
        valueOf: function () {
            console.log("valueOf");
            return '0';
        },
        toString: function () {
            console.log("toString");
            return 1;
        }
    };

### 1.1 Coercing to number

There are two common ways for coercing to number: the unary plus operator and Number, used as a function (not as a constructor).

    > +obj
    valueOf
    0
    > Number(obj)
    valueOf
    0

In both cases, things work as expected: the number algorithm is used. 
Then the result returned by `valueOf()` is converted to number.

## 1.2 Coercing to string

Two common ways of coercing a value to string are: 
the binary plus operator where one operand is a string and `String`, 
used as a function (not as a constructor).

    > ''+obj
    valueOf
    '0'
    > String(obj)
    toString
    '1'

The binary plus operator uses the default algorithm, because one can add either numbers or strings.

## 1.3 Coercing to boolean

Two ways of coercing to boolean are: 
using the unary negation operator twice (once converts to boolean and negates) or using `Boolean` as a function.

    > !!obj
    true
    > Boolean(obj)
    true

Here we see that objects are never converted to primitive. 
The rule is simply: any object is always `true`. 
For primitives, only the following values are coerced to `false`, all other values are coerced to `true`.

* undefined
* null
* false
* +0, -0, NaN
* ""

## 2. Understanding the initial result

Now it should be obvious why `!!(new Boolean(false))` evaluates to `true`: 
Any instance of `Boolean` is always an object and those are always coerced to `true`.

## Recommendations

Here are a few recommendations for coercion and objects:

*	Stay away from instances of `Boolean`, `Number` and `String`. 
	You don’t normally need or encounter them in JavaScript.

*	However, I do like using `Boolean`, `Number` and `String` as functions, to coerce values. 
	They are nicely descriptive when used in this manner.

*	Obviously, all of the above ways of coercing to primitives work for any value, not just for objects:

	    > Number("123")
	    123
	    > Boolean(0)
	    false
	    > String(true)
	    'true'

*	One does not often coerce objects to primitives. 
	Doing so is, however, good for many [WTFs][1] and [hacks][2].

## 4. Further reading

1. [JavaScript中,{}+{}等于多少?][1] [Describes the binary plus operator and the conversion to number and string in detail]

2. [Fake operator overloading in JavaScript][2] [a fun hack involving objects being coerced to numbers]

3. [JavaScript’s two zeros][3]

[1]: http://justjavac.com/javascript/2012/12/20/object-plus-object.html
[2]: http://www.2ality.com/2011/12/fake-operator-overloading.html
[3]: http://www.2ality.com/2012/03/signedzero.html
