---
layout: post
title: JavaScript Puzzlers 解密（一）：为什么 ["1", "2", "3"].map(parseInt) 返回 [1, NaN, NaN]？
keywords: javascript, Puzzlers
category : javascript
tags : [javascript, Puzzlers]
---

[JavaScript Puzzlers!](http://javascript-puzzlers.herokuapp.com/) 被称为 javascript 界的专业八级测验，感兴趣的 jser 可以去试试。
我试了一下， 36 道题只做对了 19 道， 算下来正确率为 53%，还没有及格。

第一题为 `["1", "2", "3"].map(parseInt)` 的返回值。

    > ["1", "2", "3"].map(parseInt)
    [1, NaN, NaN]

在 javascript 中 `["1", "2", "3"].map(parseInt)` 为何返回不是 `[1, 2, 3]` 却是 `[1, NaN, NaN]`？

我们首先回顾一下 `parseInt()` 个 `map()` 两个函数的用法：

## parseInt() 函数

### 定义和用法

`parseInt()` 函数可解析一个字符串，并返回一个整数。

## 语法

    parseInt(string, radix)

<table class="table">
<tbody>
<tr>
<th>参数</th>
<th>描述</th>
</tr>
<tr>
<td>string</td>
<td>必需。要被解析的字符串。</td>
</tr>
<tr>
<td>radix</td>
<td>
<p>可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。</p>
<p>如果省略该参数或其值为 `0`，则数字将以 10 为基础来解析。如果它以 `"0x"` 或 `"0X"` 开头，将以 16 为基数。</p>
<p>如果该参数小于 2 或者大于 36，则 `parseInt()` 将返回 `NaN`。</p>
</td>
</tr>
</tbody>
</table>

### 返回值

返回解析后的数字。

### 说明

当参数 `radix` 的值为 `0`，或没有设置该参数时，`parseInt()` 会根据 `string` 来判断数字的基数。

举例：

1. 如果 `string` 以 `"0x"` 开头，`parseInt()` 会把 `string` 的其余部分解析为十六进制的整数。

2. 如果 `string` 以 `0` 开头，那么 ECMAScript v3 允许 `parseInt()` 的一个实现把其后的字符解析为八进制或十六进制的数字。

3. 如果 `string` 以 1 ~ 9 的数字开头，`parseInt()` 将把它解析为十进制的整数。

### 提示和注释

**注释**：只有字符串中的第一个数字会被返回。

**注释**：开头和结尾的空格是允许的。

**提示**：如果字符串的第一个字符不能被转换为数字，那么 `parseInt()` 会返回 `NaN`。

### 实例

在本例中，我们将使用 `parseInt()` 来解析不同的字符串：

    parseInt("10");         // 返回 10 (默认十进制)
    parseInt("19",10);      // 返回 19 (十进制: 10+9)
    parseInt("11",2);       // 返回 3 (二进制: 2+1)
    parseInt("17",8);       // 返回 15 (八进制: 8+7)
    parseInt("1f",16);      // 返回 31 (十六进制: 16+15)
    parseInt("010");        // 未定：返回 10 或 8

------------

## map 方法

对数组的每个元素调用定义的回调函数并返回包含结果的数组。

    array1.map(callbackfn[, thisArg])

<table class="table">
<tbody>
<tr>
<th>参数</th>
<th>定义</th>
</tr>
<tr>
<td>array1</td>
<td>必需。一个数组对象。</td>
</tr>
<tr>
<td>callbackfn</td>
<td>必需。一个接受**最多**三个参数的函数。对于数组中的每个元素，`map` 方法都会调用 `callbackfn` 函数一次。</td>
</tr>
<tr>
<td>thisArg</td>
<td>可选。可在 `callbackfn` 函数中为其引用 `this` 关键字的对象。如果省略 `thisArg`，则 `undefined` 将用作 `this` 值。</td>
</tr>
</tbody>
</table>

### 返回值

其中的每个元素均为关联的原始数组元素的回调函数返回值的新数组。

### 异常

如果 `callbackfn` 参数不是函数对象，则将引发 `TypeError` 异常。

### 备注

对于数组中的每个元素，`map` 方法都会调用 `callbackfn` 函数一次（采用升序索引顺序）。 不为数组中缺少的元素调用该回调函数。

除了数组对象之外，`map` 方法可由具有 `length` 属性且具有已按数字编制索引的属性名的任何对象使用。

### 回调函数语法

回调函数的语法如下所示：

    function callbackfn(value, index, array1)

可使用**最多**三个参数来声明回调函数。

下表列出了回调函数参数。

<table class="table">
<tbody>
<tr>
<th>回调参数</th>
<th>定义</th>
</tr>
<tr>
<td>value</td>
<td>数组元素的值。</td>
</tr>
<tr>
<td>index</td>
<td>数组元素的数字索引。</td>
</tr>
<tr>
<td>array1</td>
<td>包含该元素的数组对象。</td>
</tr>
</tbody>
</table>

### 修改数组对象

数组对象可由回调函数修改。

下表描述了在 `map` 方法启动后修改数组对象所获得的结果。

<table>
<tbody>
<tr>
<th>`map` 方法启动后的条件</th>
<th>元素是否传递给回调函数</th>
</tr>
<tr>
<td>在数组的原始长度之外添加元素。</td>
<td>否。</td>
</tr>
<tr>
<td>添加元素以填充数组中缺少的元素。</td>
<td>是，如果该索引尚未传递给回调函数。</td>
</tr>
<tr>
<td>元素被更改。</td>
<td>是，如果该元素尚未传递给回调函数。</td>
</tr>
<tr>
<td>从数组中删除元素。</td>
<td>否，除非该元素已传递给回调函数。</td>
</tr>
</tbody>
</table>

### 示例

下面的示例阐释了 `map` 方法的用法。

    // 定义回调函数
    // 计算圆的面积
    function AreaOfCircle(radius) { 
        var area = Math.PI * (radius * radius); 
        return area.toFixed(0); 
    } 
     
    // 定义一个数组，保护三个元素
    var radii = [10, 20, 30]; 
     
    // 计算 radii 的面积. 
    var areas = radii.map(AreaOfCircle); 
     
    document.write(areas); 
     
    // 输出: 
    // 314,1257,2827

下面的示例阐释 `thisArg` 参数的用法，该参数指定对其引用 `this` 关键字的对象。

    // 定义一个对象 object，保护 divisor 属性和 remainder 方法
    // remainder 函数求每个传入的值的个位数。（即除以 10 取余数）
    var obj = { 
        divisor: 10, 
        remainder: function (value) { 
            return value % this.divisor; 
        } 
    } 
    
    // 定义一个包含 4 个元素的数组
    var numbers = [6, 12, 25, 30]; 
    
    // 对 numbers 数组的每个元素调用 obj 对象的 remainder 函数。
    // map 函数的第 2 个参数传入 ogj。 
    var result = numbers.map(obj.remainder, obj); 
    document.write(result); 
     
    // 输出: 
    // 6,2,5,0

在下面的示例中，内置 JavaScript 方法用作回调函数。

    // 对数组中的每个元素调用 Math.sqrt(value) （求平方根）
    var numbers = [9, 16]; 
    var result = numbers.map(Math.sqrt); 
    
    document.write(result); 
    // 输出: 3,4

`[9, 16].map(Math.sqrt)` 回调函数，输出的结果是 `[3, 4]`。
但是为什么 `["1", "2", "3"].map(parseInt)` 却返回 `[1,NaN,NaN]`？

网站给出的提示是：

> what you actually get is `[1, NaN, NaN]` because `parseInt` takes two parameters `(val, radix)` and `map` passes 3 `(element, index, array)`

简单翻译一下就是

> `parseInt` 需要 2 个参数 `(val, radix)`， 而 `map` 传递了 3 个参数 `(element, index, array)`」。

**************

通过上面的解释，我们可以看出，如果想让 `parseInt(string, radix)` 返回 NaN，有两种情况：

1. 第一个参数不能转换成数字。

2. 第二个参数不在 2 到 36 之间。

我们传入的参数都能转换成数字，所以只能是第二种可能。

到底是不是呢？我们重新定义 `parseInt(string, radix)` 函数：

    var parseInt = function(string, radix) {
        return string + "-" + radix;
    };

    ["1", "2", "3"].map(parseInt);

输出结果为：

    ["1-0", "2-1", "3-2"]

看见，`map` 函数将数组的值 `value` 传递给了 `parseInt` 的第一个参数，将数组的索引传递给了第二个参数。
第三个参数呢？我们再加一个参数

    var parseInt = function(string, radix, obj) {
        return string + "-" + radix + "-" + obj;
    };

    ["1", "2", "3"].map(parseInt);

输出结果：

    ["1-0-1,2,3", "2-1-1,2,3", "3-2-1,2,3"]

我们再继续增加参数：

    var parseInt = function(string, radix, obj, other) {
        return string + "-" + radix + "-" + obj + "-" + other;
    };

    ["1", "2", "3"].map(parseInt);

输出结果：

    ["1-0-1,2,3-undefined", "2-1-1,2,3-undefined", "3-2-1,2,3-undefined"]

第四个参数为 `undefined`，看见 `map` 确实为 `parseInt` 传递了三个参数。就像作者写道的：

    (element, index, array)

1. 数组的值

2. 数组的索引

3. 数组

（全文完）
