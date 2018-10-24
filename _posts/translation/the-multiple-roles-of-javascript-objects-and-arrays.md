---
layout: post  
title: The multiple roles of JavaScript objects and arrays  
keywords: javascript, object, array  
category : javascript  
tags : [javascript]  
---

原文：[The multiple roles of JavaScript objects and arrays](http://www.2ality.com/2012/01/roles-objects-arrays.html)

译文：[The multiple roles of JavaScript objects and arrays](https://justjavac.com/javascript/2013/04/22/the-multiple-roles-of-javascript-objects-and-arrays.html)

译者：[未翻译]()

----------------------------------------------------

Both objects and arrays play multiple roles in JavaScript. This blog post explains what those roles are.

## 1. Objects and arrays are dual data structures

### 1.1 Objects: records versus maps

A JavaScript object is a combination of two data structures: It is sometimes used as a record, sometimes as a dictionary.

* Record:
* Fixed shape (keys known beforehand)
* Every (key, value) entry has a different meaning
* Literal names: Use names literally. Example: `obj.key`
* Map (dictionary), from strings to arbitrary values:
* Flexible shape (keys generally unknown beforehand)
* Every (key, value) entry has a similar meaning
* Computed names: There is usually one level of indirection, you don’t use names directly. Example: `obj[mykey]` (with `mykey` being a variable that holds the actual key)

## 1.2 Arrays: tuples versus lists

In a manner similar to objects, arrays are a combination of two data structures: Sometimes, they are used as tuples, sometimes as lists:

* Tuple:
* Fixed length
* Access elements directly by index
* Example: returning multiple values from a function or method.
* List:
* Dynamic length
* Iterate over all elements

## 1.3. Similarities

Given that an object maps names to values and an array maps natural numbers to values, it is obvious that records and tuples are similar. 
Their structure and range are the same, only their (functional) domain is different. 
The same holds for maps and lists.

## 2. Mixing the domains “program definition” and “application data”

Objects perform duties in two domains: they sometimes define the program, sometimes hold application data.

* 	Program definition domain: The object is a data structure holding program logic. 
	One mostly uses them in their capacity as records in this domain.

* 	Application data domain: The object is a data structure holding application data. 
	Objects are used as both records and maps here. 
	JSON data is part of this domain.

The overlap of the two domains becomes negatively apparent when you are invoking methods on an object-as-map that can have arbitrary keys. 
For example, the following function is how you would naively implement a check for the presence of a key:

```javascript
function hasKey(obj, key) {
    return obj.hasOwnProperty(key);
}
```

Normal usage:

    > hasKey({foo: 123}, "foo")
    true

However, this function ceases to work properly if the key `"hasOwnProperty"` is used in `obj`:

    > hasKey({hasOwnProperty: 123}, "foo")
    TypeError: Property 'hasOwnProperty' of object #<Object> is not a function

The fix is as follows (there are other things to watch out for, to be covered in an upcoming blog post):

    function hasKey(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

That is, you refer to the method directly and don’t use the property search algorithm to find it.

## 2.1. Mixing domains with the [] operator

The `[]` operator has been established in mainstream programming language as an application data construct. 
Only JavaScript mixes domains: It is used for application data in arrays and in objects-as-maps. 
But it is also used in a meta-programming capacity, to access a property via a computed name. 
The former use case is so frequent that it makes sense to let user-implemented collection types override the `[]` operator. 
To avoid clashing with the latter use case (which does not occur often), methods need to be introduced that perform that task. 
For example, `Object.getProperty(name)` and `Object.setProperty(name, value)`. 
The ECMAScript.next proposal “[Object Model Reformation: Decoupling [ ] and Property Access](http://wiki.ecmascript.org/doku.php?id=strawman:object_model_reformation)” shows how to do this cleanly.

## 3. Related reading

The following emails on the es-discuss mailing list inspired this post:

1. “[decoupling [ ] and property access for collections][1]” (by Allen Wirfs-Brock) points out the two domains program definition and application data.
2. “[An array destructing specification choice][2]” (by David Herman) mentions record versus map and tuple versus list.

[1]: https://mail.mozilla.org/pipermail/es-discuss/2011-October/017468.html
[2]: https://mail.mozilla.org/pipermail/es-discuss/2011-November/018290.html
