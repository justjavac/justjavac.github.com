---
layout: post
title: 如何百倍加速 Lo-Dash？引入惰性计算
description: 如何百倍加速 Lo-Dash？引入惰性计算
keywords: javascript, Lo-Dash
category : javascript
tags : [javascript, Lo-Dash]
---

原文：[How to Speed Up Lo-Dash ×100? Introducing Lazy Evaluation.](http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/)  
作者: [Filip Zawada](http://twitter.com/filip_zawada)

译文：[如何百倍加速 Lo-Dash？引入惰性计算](http://justjavac.com/javascript/2015/12/15/introducing-lazy-evaluation.html)  
译者：[justjavac](http://justjavac.com)

--------------------

我一直以为像 Lo-Dash 这样的库已经不能再快了，毕竟它们已经足够快了。
Lo-Dash 几乎完全混合了各种 [JavaScript 奇技淫巧](https://www.youtube.com/watch?v=NthmeLEhDDM)（YouTube）来压榨出最好的性能。

## 惰性计算

但似乎我错了 - 其实 Lo-Dash 可以运行的更快。
你需要做的是，停止思考那些细微的优化，并开始找出更加适用的算法。
例如，在一个典型的循环中，我们往往倾向于去优化单次迭代的时间：

```javascript
var len = getLength();
for(var i = 0; i < len; i++) {
    operation(); // <- 10毫秒 - 如何优化到9毫秒?!
}
```

代码说明：取得数组的长度，然后重复执行 N 遍 `operation()` 函数。译注 by @justjavac

但是，这（优化 `operation()` 执行时间）往往很难，而且对性能提升也非常有限。
相反，在某些情况下，我们可以优化 `getLength()` 函数。
它返回的数字越小，则每个 10 毫秒循环的执行次数就越少。

这就是 Lo-Dash 使用惰性计算的思想。
这是减少周期数，而不是减少每个周期的执行时间。
让我们看看下面的例子：

```javascript
function priceLt(x) {
   return function(item) { return item.price < x; };
}
var gems = [
   { name: 'Sunstone', price: 4  },
   { name: 'Amethyst', price: 15 },
   { name: 'Prehnite', price: 20 },
   { name: 'Sugilite', price: 7  },
   { name: 'Diopside', price: 3  }, 
   { name: 'Feldspar', price: 13 },
   { name: 'Dioptase', price: 2  }, 
   { name: 'Sapphire', price: 20 }
];

var chosen = _(gems).filter(priceLt(10)).take(3).value();
```

代码说明：`gems` 保存了 8 个对象，名字和价格。`priceLt(x)` 函数返回价格低于 `x` 的所有元素。译注 by @justjavac

我们把价格低于 10 美元的前 3 个 `gems` 找出来。
常规 Lo-Dash 方法（严格计算）是过滤所有 8 个 `gems`，然后返回过滤结果的前 3 个。

![Lodash naïve approach](/assets/images/lodash-naive.gif)

不难看出来，这种算法是不明智的。
它处理了所有的 8 个元素，而实际上我们只需要读取其中的 5 个元素就能得到我们想要的结果。
与此相反，使用惰性计算算法，只需要处理能得到结果的最少数量就可以了。
如图所示：

![Lo-Dash regular approach](/assets/images/grafika.gif)

我们轻而易举就获得了 37.5％ 的性能提升。
但是这还不是全部，其实很容易找到能获得 1000 倍以上性能提升的例子。
让我们一起来看看：

```javascript
// 99,999 张照片
var phoneNumbers = [5554445555, 1424445656, 5554443333, … ×99,999];

// 返回包含 "55" 的照片
function contains55(str) {
    return str.contains("55"); 
};

// 取 100 张包含 "55" 的照片
var r = _(phoneNumbers).map(String).filter(contains55).take(100);
```

在这个例子中，`map` 和 `filter` 用来处理 `99,999` 个元素。
不过我们只需要它的一个子集就可以得到想要的结果了，例如 `10,000` 个，
性能提升也是非常大的（[基准测试](http://jsperf.com/lazy-demo)）：

![benchmark](/assets/images/benchmark.jpg)

## Pipelining

惰性计算带来了另一个好处，我称之为 "Pipelining"。
它可以避免链式方法执行期间创建中间数组。
取而代之，我们在单个元素上执行所有操作。
所以，下面的代码：

```javascript
var result = _(source).map(func1).map(func2).map(func3).value();
```

将大致翻译为如下的常规 Lo-Dash（严格计算）

```javascript
var result = [], temp1 = [], temp2 = [], temp3 = [];

for(var i = 0; i < source.length; i++) {
   temp1[i] = func1(source[i]);
}

for(i = 0; i < source.length; i++) {
   temp2[i] = func2(temp1[i]);
}

for(i = 0; i < source.length; i++) {
   temp3[i] = func3(temp2[i]);
}
result = temp3;
```

如果我们使用惰性计算，它会像下面这样执行：

```javascript
var result = [];
for(var i = 0; i < source.length; i++) {
   result[i] = func3(func2(func1(source[i])));
}
```

不使用临时数组可以给我们带来非常显著的性能提升，特别是当源数组非常大时，内存访问是昂贵的资源。

## 延迟执行

和惰性计算一起使用的是延迟执行。
当你创建一个链，我们并不立即计算它的值，直到 `.value()` 被显式或者隐式地调用。
这种方法有助于先准备一个查询，随后我们使用最新的数据来执行它。

```javascript
var wallet = _(assets).filter(ownedBy('me'))
                      .pluck('value')
                      .reduce(sum);

$json.get("/new/assets").success(function(data) {
    assets.push.apply(assets, data); // 更新我的资金
    wallet.value(); // 返回我钱包的最新的总额
});
```

在某些情况下，这样做也可以加速执行时间。我们可以在前期创建复杂的查询，然后当时机成熟时再执行它。

## Wrap up

懒惰计算并不是行业里的新理念。它已经包含在了许多库里面，例如 [LINQ](http://en.wikipedia.org/wiki/Language_Integrated_Query)、[Lazy.js](http://danieltao.com/lazy.js/) 等等。我相信 Lo-Dash 和这些库最主要的区别是，你可以在一个更新的、更强大的引擎里面使用原有的 Underscore API。不需要学习新的库，不需要修改代码，只是简单升级。

但是，即使你不打算使用 Lo-Dash，我希望这篇文章启发了你。
现在，当你发现你的应用程序存在性能瓶颈，不要仅仅是去 jsperf.com 以 try/fail 风格优化它。
而是去喝杯咖啡，并开始考虑算法。
最重要的是创意，但良好的数学背景会让你如鱼得水（[book](http://mitpress.mit.edu/books/introduction-algorithms)）。祝你好运！
