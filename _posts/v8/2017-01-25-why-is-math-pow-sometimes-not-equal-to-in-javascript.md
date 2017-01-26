---
layout: post
title: V8 使用“常量折叠”优化技巧，导致幂（**）运算有时候不等于 Math.pow()
description: V8 使用“常量折叠”优化技巧，导致幂（**）运算有时候不等于 Math.pow()
keywords: javascript, v8
category: v8
tags: [javascript, v8]
---

在如今的主流 Web 编程语言中，如 PHP 或 Python 等，都包含幂运算符（一般来说符号是 `^` 或者 `**`）。
而最新的 ES7 中也增加了对幂运算的支持，使用符号 `**`，最新的 Chrome 已经提供了对幂运算的支持。

但是在 javascript 中，`**` 运算**有时候**并不等于 `Math.pow(a,b)`，在最新的 Chrome 55 中：

`Math.pow(99,99)` 的结果是 `3.697296376497263e+197`，

但是 `99**99` 的结果是 `3.697296376497268e+197`。

两者并不相等

3.69729637649726**3**e+197  
3.69729637649726**8**e+197

而且 `Math.pow(99,99) - 99**99` 的结果也不是 `0` 而是 `-5.311379928167671e+182`。

因此我们猜测，`**` 操作符只是幂运算的另一个实现。但是当我们写一个函数时，幂运算又表现出诡异的特性：

```javascript
function diff(x) {
  return Math.pow(x,x) - x**x;
}
```

调用 `diff(99)` 返回 `0`。WTF？两者又相等了！

猜猜下面代码输出什么？

```javascript
var x = 99;
x**x - 99**99;
```

这段代码的运行结果是 `-5.311379928167671e+182`。

------------------------

这简直是**薛定谔的幂**。

究其原因，V8 引擎使用了常量折叠（const folding）。常量折叠是一种编译器的编译优化技术。

考虑如下代码：

```javascript
for (let i = 0; i < 100*100*100; i++){
  // 循环体
}
```

该循环的条件 `i<100*100*100` 是一个表达式（expression），如果放到判断时再求值那么 `100*100*100` 的计算将会进行 1000000 次。
如果编译器在语法分析阶段进行常量合并，该循环将会变为这样：

```javascript
for (let i = 0; i < 1000000; i++){
  // 循环体
}
```

而上文中提到的 `99 ** 99` 的计算也使用到了常量折叠。也就是说 `99 ** 99` 是在编译时进行计算（常量折叠），而 `Math.pow` 总是在运行时进行计算。
当我们使用变量进行幂运算时（例 `a ** b`）此时不存在常量折叠，因此 `a ** b` 的值在运行时进行计算，`**` 会被编译成 `Math.pow` 调用。

在源码 src/parsing/parser.cc 文件中，编译时计算代码：

```c
case Token::EXP: {
double value = Pow(x_val, y_val);
int int_value = static_cast<int>(value);
*x = factory()->NewNumberLiteral(
    int_value == value && value != -0.0 ? int_value : value, pos,
    has_dot);
return true;
```

可以看到使用了 `Pow` 函数计算了幂运算的求值结果。`Pow` 是一个 inline 的函数，内部做了一些常规优化，对不能优化的情况则使用了 `std::pow(x, y)` 来计算最终结果。

而 `Math.pow` 的算法为：

```c
// ES6 section 20.2.2.26 Math.pow ( x, y )
TF_BUILTIN(MathPow, CodeStubAssembler) {
  Node* x = Parameter(1);
  Node* y = Parameter(2);
  Node* context = Parameter(5);
  Node* x_value = TruncateTaggedToFloat64(context, x);
  Node* y_value = TruncateTaggedToFloat64(context, y);
  Node* value = Float64Pow(x_value, y_value);
  Node* result = ChangeFloat64ToTagged(value);
  Return(result);
}
```

可见两者使用了不同的算法。但是当不做常量折叠的时候，`**` 则转换成了 `Math.pow` 函数调用：

```c
Expression* Parser::RewriteExponentiation(
    Expression* left, 
    Expression* right,
    int pos) {
  ZoneList<Expression*>* args = new (zone()) ZoneList<Expression*>(2, zone());
  args->Add(left, zone());
  args->Add(right, zone());
  return factory()->NewCallRuntime(Context::MATH_POW_INDEX, args, pos);
}
```

于是就造成了 `**` 有时不等于 `Math.pow` 的怪异问题。再看看如下代码：

```javascript
console.log(99**99);
a = 99, b = 99;
console.log(a**b);
console.log(Math.pow(99, 99));
```

分别输出：

3.69729637649726**8**e+197  
3.69729637649726**3**e+197  
3.69729637649726**3**e+197

其实

99<sup>99</sup>=369729637649726772657187905628805440595668764281741102430259972423552570455277523421410650010128232727940978889548326540119429996769494359451621570193644014418071060667659301384999779999159200499899

因此第一个结果更接近准确的值。

上周（2017年1月16日）这个怪异的行为已经作为一个 bug 提交给了 V8 项目，bug 编号 #5848。
