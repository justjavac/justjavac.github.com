---
layout: post
title: Python 编码时应该注意的几件事情
description: 在编程过程中，多了解语言周边的一些知识，以及一些技巧，可以让你加速成为一个优秀的程序员。对于Python程序员，你需要注意一下本文所提到的这些事情。
keywords: python, 编码, code
category : python
tags : [python, code]
---

在编程过程中，多了解语言周边的一些知识，以及一些技巧，可以让你加速成为一个优秀的程序员。 

对于Python程序员，你需要注意一下本文所提到的这些事情。
你也可以看看[Zen of Python](http://artifex.org/~hblanks/talks/2011/pep20_by_example.html)（Python之禅），这里面提到了一些注意事项，并配以示例，可以帮助你快速提高。 

## 1. 漂亮胜于丑陋 

实现一个功能：读取一列数据，只返回偶数并除以2。下面的代码，哪个更好一些呢？ 

    halve_evens_only = lambda nums: map(lambda i: i/2, filter(lambda i: not i%2, nums))

VS

    def halve_evens_only(nums):
        return [i/2 for i in nums if not i % 2]

## 2. 记住Python中非常简单的事情 

    # 交换两个变量
    a, b = b, a

    # 切片（slice）操作符中的step参数。（切片操作符在python中的原型是[start:stop:step]，即：[开始索引:结束索引:步长值]）
    a = [1,2,3,4,5]
    >>> a[::2]  # 遍历列表中增量为2的数据
    [1,3,5]

    # 特殊情况下，`x[::-1]`是实现x逆序的实用的方式
    >>> a[::-1]
    [5,4,3,2,1]

    # 逆序并切片
    >>> x[::-1]
    [5, 4, 3, 2, 1]

    >>> x[::-2]
    [5, 3, 1]

## 3. 不要使用可变对象作为默认值 

    def function(x, l=[]):          #不要这样

    def function(x, l=None):        # 好的方式
      if l is None:
    l = []

这是因为当def声明被执行时，默认参数总是被评估。 

## 4. 使用iteritems而不是items 

iteritems 使用generators ，因此当通过非常大的列表进行迭代时，iteritems 更好一些。 

    d = {1: "1", 2: "2", 3: "3"}

    for key, val in d.items()       # 当调用时构建完整的列表

    for key, val in d.iteritems()   # 当请求时只调用值

## 5. 使用isinstance ，而不是type 

    # 不要这样做

    if type(s) == type(""): ...
    if type(seq) == list or \
    type(seq) == tuple: ...

    # 应该这样

    if isinstance(s, basestring): ...
    if isinstance(seq, (list, tuple)): ...

原因可参阅：[stackoverflow](http://stackoverflow.com/a/1549854/504262) 

注意我使用的是basestring 而不是str，因为如果一个unicode对象是字符串的话，可能会试图进行检查。例如： 

    >>> a=u'aaaa'
    >>> print isinstance(a, basestring)
    True
    >>> print isinstance(a, str)
    False

这是因为在Python 3.0以下版本中，有两个字符串类型str 和unicode。 

## 6. 了解各种容器 

Python有各种容器数据类型，在特定的情况下，相比内置容器（如list 和dict ），这是更好的选择。 

我敢肯定，大部分人不使用它。我身边一些粗心大意的人，一些可能会用下面的方式来写代码。 

    freqs = {}
    for c in "abracadabra":
        try:
            freqs[c] += 1
        except:
            freqs[c] = 1

也有人会说下面是一个更好的解决方案： 

    freqs = {}
    for c in "abracadabra":
        freqs[c] = freqs.get(c, 0) + 1

更确切来说，应该使用collection 类型defaultdict。 

    from collections import defaultdict
    freqs = defaultdict(int)
    for c in "abracadabra":
        freqs[c] += 1

其他容器： 

    namedtuple()	# 工厂函数，用于创建带命名字段的元组子类
    deque	        # 类似列表的容器，允许任意端快速附加和取出
    Counter	  # dict子类，用于哈希对象计数
    OrderedDict	  # dict子类，用于存储添加的命令记录
    defaultdict	  # dict子类，用于调用工厂函数，以补充缺失的值

## 7. Python中创建类的魔术方法（magic methods） 

    __eq__(self, other)      # 定义 == 运算符的行为
    __ne__(self, other)      # 定义 != 运算符的行为
    __lt__(self, other)      # 定义 < 运算符的行为
    __gt__(self, other)      # 定义 > 运算符的行为
    __le__(self, other)      # 定义 <= 运算符的行为
    __ge__(self, other)      # 定义 >= 运算符的行为

## 8. 必要时使用Ellipsis（省略号“...”） 

Ellipsis 是用来对高维数据结构进行切片的。作为切片（:）插入，来扩展多维切片到所有的维度。例如： 

    >>> from numpy import arange
    >>> a = arange(16).reshape(2,2,2,2)

    # 现在，有了一个4维矩阵2x2x2x2，如果选择4维矩阵中所有的首元素，你可以使用ellipsis符号。

    >>> a[..., 0].flatten()
    array([ 0,  2,  4,  6,  8, 10, 12, 14])

    # 这相当于

    >>> a[:,:,:,0].flatten()
    array([ 0,  2,  4,  6,  8, 10, 12, 14])

原文：[a few things to remember while coding in python](http://satyajit.ranjeev.in/2012/05/17/python-a-few-things-to-remember.html) 

