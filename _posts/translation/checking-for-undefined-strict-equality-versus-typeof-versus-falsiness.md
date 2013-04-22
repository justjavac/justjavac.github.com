---
layout: post
title: Checking for undefined: === versus typeof versus falsiness
keywords: javascript, undefined, typeof
category : javascript
tags : [javascript]
---

原文：[Checking for undefined: === versus typeof versus falsiness](http://www.2ality.com/2013/04/check-undefined.html)

译文：[]()

译者：[未翻译]()

----------------------------------------------------

There are several ways of checking whether a variable has the value `undefined`. This blog post explains the differences.

## 1. Checking via ===

Using [strict equality][1] is the canonical way of checking for `undefined`:

    if (x === undefined) ...

### 1.1 Changing undefined

`undefined` is a [property of the global object](http://ecma-international.org/ecma-262/5.1/#sec-15.1.1.3) (and thus a global variable). 
Under ECMAScript 3, you could change its value. 
Under ECMAScript 5, you can’t do that, any more:

    > undefined = 123
    > undefined
    undefined

You can, however, shadow it in a function, either via a parameter or via a local variable:

    > (function () { var undefined = 123; return undefined; }())
    123

From now on, `undefined` is used to refer to the identifier, while `undefined` is used to refer to the actual value.

Because you could globally change the value of `undefined` under ECMAScript 3, two techniques were often used to ensure that it had the correct value. 
If you are targeting older browsers, these techniques are still relevant.

**Technique 1**: shadow `undefined` yourself.

    (function (undefined) {
        if (x === undefined) ...  // safe now
    }());  // don’t hand in a parameter

Above, `undefined` is a parameter whose value is `undefined`, because it has not been provided by the caller.

**Technique 2**: compare with `void 0`. 
The [void operator][2] evaluates its operand, ignores the result and returns `undefined`. 
That means that `void 0` will always evaluate to `undefined`.

    if (x === void 0)  // always safe

## 2. Checking via typeof

You can also check for `undefined` via the [typeof operator][3]:

    if (typeof x === 'undefined') ...

This is more verbose and can be slower (though many engines optimize). 
It has two advantages: First, it is safe with regard to a changed `undefined` (not that important under ECMAScript 5). 
Second, it also works for unknown variables:

    > typeof iDontKnowThisVariable === 'undefined'
    true
    > iDontKnowThisVariable === undefined
    ReferenceError: iDontKnowThisVariable is not defined

## 3. Checking for falsiness

`undefined` is falsy ([interpreted as false in boolean contexts][4]):

    > Boolean(undefined)
    false

Hence, you can check for `undefined` like this:

    if (!x) ...

The usual caveat applies: The condition of the above if statement will also be true for: `null`, `false`, `-0`, `+0`, `NaN`, `""`.

## 4. Conclusion

Recommendation: check for `undefined` either via `=== undefined` or via falsiness. 
It is normally more important for code to be easy to understand than to be completely safe. 
Therefore, checking via `=== void 0` is rarely a good choice.

## 5. References

1. [Equality in JavaScript: === versus ==][1]

2. [The void operator in JavaScript][2]

3. [Categorizing values in JavaScript][3]

4. [JavaScript quirk 1: implicit conversion of values][4]

[1]: http://www.2ality.com/2011/06/javascript-equality.html "Equality in JavaScript: === versus =="
[2]: http://www.2ality.com/2011/05/void-operator.html "The void operator in JavaScript"
[3]: http://www.2ality.com/2013/01/categorizing-values.html "Categorizing values in JavaScript"
[4]: http://www.2ality.com/2013/04/quirk-implicit-conversion.html "JavaScript quirk 1: implicit conversion of values"