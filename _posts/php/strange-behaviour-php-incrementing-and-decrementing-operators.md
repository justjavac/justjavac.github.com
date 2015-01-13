---
layout: post
title: PHP 中「自增、自减」运算引发的奇怪问题
description: PHP 中「自增、自减」运算引发的奇怪问题。
keywords: php, 自增, 自减
category : php
tags : [php]
---

在 PHP 的官方手册中写道：

> PHP 支持 C 风格的前／后递增与递减运算符。

第一个注意事：**递增／递减运算符不影响布尔值。递减 `NULL` 值也没有效果，但是递增 `NULL` 的结果是 `1`**。

换句话说：递增／递减运算中，不会把操作数转换成整数后再运算。如果运算数是布尔值，则直接返回结果。

递增／递减布尔值：

```php
$a = TRUE;
var_dump(++$a); // bool(true)

$a = TRUE;
var_dump(--$a); // bool(true)

$b = FALSE;
var_dump(++$b); // bool(false)

$b = FALSE;
var_dump(--$b); // bool(false)
```

递增／递减 `NULL`：

```php
$a = NULL;
var_dump(++$a); // int(1) 
$a = NULL;
var_dump(--$a); // NULL
```

在处理字符变量的算数运算时，**PHP 沿袭了 Perl 的习惯，而非 C 的**。

例如，在 Perl 中 
```perl
$a = 'Z';
$a++;
```

将把 `$a` 变成 `'AA'`，而在 C 中，

```c
a = 'Z';
a++;
```

将把 `a` 变成 `'['`（`'Z'` 的 ASCII 值是 `90`，`'['` 的 ASCII 值是 `91`）。

注意字符变量**只能递增，不能递减，并且只支持纯字母（a-z 和 A-Z）**。

例如：

```php
$a="9D9"; 
var_dump(++$a);  // string(3) "9E0"
```

但是，这里又有一个陷阱了：

```php
$a="9E0"; 
echo ++$a;  // 10
```
安装上面的规则，应该输出 `9E1`，但是这里却输出了 `10`。WTF？

如果我们这么写，大部人就知道是为什么了。

```php
$a = "9E0"; 
var_dump(++$a);  // float(10)
```

`$a` 的类型是浮点型，也就是说，`9E0` 是浮点数的科学记数法，即 `9 * 10^0 = 9`，对 `9` 自增，结果当然是 `10` 了。

- 参考：[字符串转换为数值](http://php.net/manual/zh/language.types.string.php#language.types.string.conversion)

现在问题又来了： 

```php
$l = "Z99";
$l++; 
```

这个结果是多少呢？结果按照 perl 语言的规则，是 `"AA00"`。

还有一个注意事项：

**递增／递减其他字符变量则无效，原字符串没有变化**。

这个就不解释了。

最后一个注意事项：

```php
$a = '012';
$a++;
var_dump($a);
```

这个结果是 `'013'`？`13`？`11`？

这段的结果是 `int(13)`，字符串 `'012'` 并没有被当作八进制。

```php
$a = 012;   // 八进制，十进制为 10
$b = "012"; // 转换为整数为十进制 12
```

如果是 `0x` 开头的呢？

```php
$a = '0x1A';
$a++;
var_dump($a);   // int(27)
```

WTF！居然不按套路出牌。`0` 开头的不被认为是八进制，但是 `0x` 开头的却被认为是十六进制。

在 PHP 官方文档中[Integer 整型](http://php.net/manual/zh/language.types.integer.php)还有另一个八进制陷阱：

```php
var_dump(01090); // 八进制 010 = 十进制 8
```

手册中对此的解释为：

> Warning
如果向八进制数传递了一个非法数字（即 8 或 9），则后面其余数字会被忽略。

综上，PHP 不愧是世界上「最好」的语言。

没有之一。