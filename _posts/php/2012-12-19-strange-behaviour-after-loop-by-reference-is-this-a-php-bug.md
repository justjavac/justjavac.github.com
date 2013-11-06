---
layout: post
title: PHP 循环中「引用」引发的奇怪问题
description: 在 PHP 循环中，如果使用引用会引发非常奇怪的行为 - 这是一个 PHP 的 bug 吗？。
keywords: php, 循环, 引用, foreach
category : php
tags : [php]
---

本文整理自 stackoverflow 网站上的一篇文章 [Strange behaviour after loop by reference - Is this a PHP bug?](http://stackoverflow.com/q/8220399/343194) ——
在 PHP 循环中，如果使用 **引用** 会引发非常奇怪的行为 - 这是 PHP 的一个 bug 吗？

## 问题

在我写一个简单的 PHP 脚本时，发生了一些非常奇怪的现象。下面是我的代码，为了清楚的表达我的意思，我特意去掉了一些不必要的代码：

    <?php

    $arr = array("foo",
                 "bar",
                 "baz");

    foreach ($arr as &$item) { /* do nothing by reference */ }
    print_r($arr);

    foreach ($arr as $item) { /* do nothing by value */ }
    print_r($arr); // $arr has changed....why?
    
输出如下：

    Array
    (
        [0] => foo
        [1] => bar
        [2] => baz
    )
    Array
    (
        [0] => foo
        [1] => bar
        [2] => bar  // 错误发生？？
    )

这是 PHP 的一个 bug 吗？PHP 中为什么会发生如此古怪的行为呢？

## 解析

在第一个 `foreach` 循环结束后，`$item` 仍然引用（reference）着数组的最后一个元素，也就是 `$arr[2]`。
因此，当开始第二个循环的时候，`$item` 变量每次循环都会被赋一个新值。
在 php 中，如果一个内存空间是被引用的，那么当改变它的时候是直接改变这块内存空间的值。
当改变 `$item` 的时候，其实也改变了 `$arr[2]` 的值。

因此，在第二个循环中：

* 第一次循环，`$item` 和 `$arr[2]` 的值变成 `$arr[0]`，也就是 'foo'。
* 第二次循环，`$item` 和 `$arr[2]` 的值变成 `$arr[1]`，也就是 'bar'。
* 第三次循环，`$item` 和 `$arr[2]` 的值变成 `$arr[2]`，也就是 'bar'（`$arr[2]` 的值不是 'baz'，因为在第二次循环中变成了 'bar'）。

'baz' 的值实际是在第二个循环中丢失了。

**译注**：我不喜欢把 reference 翻译成「引用」，当然了，更不能翻译成「参考」了。每次我像别人解释 reference 时，都会告诉他： **reference 就是 alias**。
比如你叫吴毅昌（呵呵，无异常），二狗子是你的别名。本着好兄弟好基友的情谊：“来，二狗子，这 100 块钱给你吧。”
你——吴毅昌——回家一模口袋，多了 100 块钱。
[@justjavac](http://weibo.com/justjavac)

## 调试输出

我们可以修改代码来调试并跟踪循环的执行细节。
我们可以输出 `$item` 的值，并且递归的输出数组 `$arr`。

当第一个循环运行时，我们可以看到这样的输出：

    foo
    Array ( [0] => foo [1] => bar [2] => baz )

    bar
    Array ( [0] => foo [1] => bar [2] => baz )

    baz
    Array ( [0] => foo [1] => bar [2] => baz )

在循环结束后，`$item` 和 `$arr[2]` 指向同一个内存区域。

当第二个循环运行时，我们看到这样的输出：

    foo
    Array ( [0] => foo [1] => bar [2] => foo )

    bar
    Array ( [0] => foo [1] => bar [2] => bar )

    bar
    Array ( [0] => foo [1] => bar [2] => bar )

在这次循环中，需要注意随着每次 `$item` 被赋予一个新值, `$arr[2]` 也会被赋值为和 `$item` 相同的值，因为它们都仍然指向相同的内存空间（译注：原文写的是 `$arr[3]`，疑为原作者笔误。[@justjavac](http://weibo.com/justjavac)）。
当循环到达数组的第三个值时，它包含的值是 `bar`，因为它的值在前两次循环中，被修改了。

## 还有疑问

也许你觉得，我仅仅是执行了一个空循环 `foreach ($arr as &$item){}`，循环体里面什么都没有做，为什么数组元素却改变了？

可能你觉得这个代码应该等价于

    for ($i = 0; $i < count($arr); $i++) { 
        // do nothing
    }

其实不对，代码应该等价于：

    for ($i = 0; $i < count($arr); $i++) { 
        $item = $arr[$i]; 
    }

也就是说， **在 foreach 循环中，隐含了一个赋值运算**，唯一不同的时，
在赋值过程中，我们使用了引用，所以在第一个循环中，无意中修改了正在循环的数组内部的元素。