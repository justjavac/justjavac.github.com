---
layout: post
title: 为什么说任何基于比较的算法将5个元素排序都需要7次？
description: 为什么说任何基于比较的算法将5个元素排序都需要7次？
keywords: 算法, 排序
category : other
tags : [排序, 算法]
---

排序算法对结果的唯一要求就是操作数满足**全序关系**：

1. 如果 a≤b 并且 b≤c 那么 a≤c（传递性）。
2. 对于 a 或 b，要不 a≤b，要不 b≤a（完全性）。

这个问题可以用[信息论](http://www.amazon.cn/gp/product/B0011C5QLE/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0011C5QLE&linkCode=as2&tag=cfjh-23)来回答。

我从 1 到 5 中挑一个数字出来让你来猜，每回合你都可以问我一个问题，我的回答“是”或“不是”（1 或 0），那么你至少需要几个回合才能保证猜出这个数字？

比较符合这个游戏精神的玩法是从自己的幸运数字（比如我的是7）开始猜起，一个一个地问我“是不是X？”，
可能你的运气足够好，一个回合就能够猜对，但是**在最坏的情况下可能就需要5个回合**，所以你的答案应该是“至少需要5个回合”
（事实上你至少只需要一次就“有可能”猜出来，但为了“保证能”猜出来，你只好委曲求全地说 5），
换句话说这种猜法的最优下界是 5。
（平均性能是 1×1/5+2×1/5+…+5×1/5=（1+…+5）/5 = 3）

但因为你会二分，所以会这样问“是不是比3大？”……而且无论我挑出的数字是几，都只用3个回合。
**二分显然是一种更佳的策略**，那么它好在什么地方呢？
用信息论理解: **最大的熵**。

英文版维基百科词条有个大致的解释：[Comparison_sort](http://en.wikipedia.org/wiki/Comparison_sort)，
最少次数为 log(5!) = 6.91，取整的话，就是 7。

决策树如下：

![比较排序决策树](/assets/images/comparison-sort-decision-tree.jpg "比较排序决策树")

如果我们用归并排序的话，比较次数是O（nlogn），因为归并排序是 **全局最优解**，但是在局部，归并并不都保证是最优的。

附一张快速排序的 gif 图：

![快速排序](http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sorting_quicksort_anim.gif/220px-Sorting_quicksort_anim.gif "快速排序")