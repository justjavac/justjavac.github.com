---
layout:     post
title: Python 的神奇方法指南
keywords: python, Magic Methods, Guide
category: python
tags: [python]
---

原文：[A Guide to Python's Magic Methods](http://www.rafekettler.com/magicmethods.html)

作者：Rafe Kettler

译文：[Python 的神奇方法指南](http://article.yeeyan.org/view/311527/287706)

-----------------------------------------

## 简介

有关 Python 内编写类的各种技巧和方法(构建和初始化、重载操作符、类描述、属性访问控制、自定义序列、反射机制、可调用对象、上下文管理、构建描述符对象、Pickling)。
你可以把它当作一个教程，进阶，或者使用参考；我希望它能够成为一份针对 Python 方法的用户友好指南。

本文源码托管在 [github](https://github.com/justjavac/magicmethods-zh_CN) 上。

## 内容目录

1. [介绍](#intro)
2. [构建和初始化](#construction)
3. [使操作符在自定义类内工作](#operators)
    * [神奇方法——比较](#comparisons)
    * [神奇方法——数字](#numeric)
4. [描述你的类](#representations)
5. [属性访问控制](#access)
6. [制作自定义序列](#sequence)
7. [反射](#reflection)
8. [可调用对象](#callable)
9. [上下文管理](#context)
10. [构建描述符对象](#descriptor)
11. [Pickling 你的对象](#pickling)
12. [总结](#conclusion)
13. [附录：如何调用神奇方法](#appendix1)

<a id="intro"></a>
## 1.介绍

这份指南是几个月内最有价值的 Blog 投稿精华。它的主题是向大家讲述 Python 中的神奇方法。

何为神奇方法呢？它们是面向 Python 中的一切，是一些特殊的方法允许在自己的定义类中定义增加“神奇”的功能。它们总是使用双下划线（比如 `__init__` 或 `__lt__`），但它们的文档没有很好地把它们表现出来。所有这些神奇方法都出现在Python的官方文档中，但内容相对分散，组织结构也显得松散。还有你会难以发现一个实例（虽然他们被设计很棒，在语言参考中被详细描述，可之后就会伴随着枯燥的语法描述等）。

所以，为了解决我认为在 Python 文档中的一大败笔，我打算用更多纯英语，实例驱动的文档来说明 Python 的神奇方法。然后我就开始花了几周的时间来写 blog，而现在我已经完成了它们，并将它们合订成一份指南。

我希望你喜欢它。把它当作一个教程，进阶，或者使用参考；我希望它能够成为一份针对 Python 方法的用户友好指南。

<a id="construction"></a>
## 2.构建和初始化

相信大家都熟悉这个最基础的神奇方法 `__init__`。它令你能自定义一个对象的初始化行为。而当我调用 `x=SomeClass()` 时，`__init__` 并不是最先被调用的。实际上有一个叫做 `__new__` 的方法，事实上是它创建了实例，它传递任何参数给初始化程序来达到创建的目的。在对象生命周期结束时，调用 `__del__`。让我们更近地观察下这 3 个神奇方法吧：

    __new__(cls,[...)

一个对象的实例化时 `__new__` 是第一个被调用的方法。在类中传递其他任何参数到 `__init__`。`__new__`很少被使用，这样做确实有其目的，特别是当一个子类继承一个不可改变的类型(一个元组或一个字符串)时。我不打算再继续深入追求 `__new__` 的细节了，因为这不会产生多大用处，因为在 Python Docs 内已经涵盖了一份巨详细的说明了。

    __init__(self,[...)

类的初始化。它会获得初始构建调用传过来的任何东西（举例来说就是，当我们调用`x=SomeClass(10,'foo')`,`__init__` 就会把传过来的 10 和 'foo' 作为参数。`__init__`在 Python 的类定义中几乎普遍被使用）

    __del__(self)

如果 `__new__`和 `__init__` 是对象的构造器，那么 `__del__` 就是析构器。它不实现声明为`del x`(这样的代码不会解释成 `x.__del__()`)的行为。相反，它定义为当一个对象被垃圾回收时的行为。这可能对可能需要额外清理的对象相当有用，比如 sockets 或文件对象。但要小心，如果对象仍处于存活状态而当被解释退出时，`__del__` 没有保证就会被执行，因此这样的`__del__` 不能作为良好的编码规范的替代。（就像当你完成操作总是要关闭一次连接。但事实上，`__del__` 几乎永远不会执行，就因为它处于不安全情况被调用了。使用时保持警惕！）

把上述这些内容合在一起，就成了一份 `__init__` 和 `__del__` 的实际使用用例：

    from os.path import join
    class FileObject:
        '''对文件对象的包装，确保文件在关闭时得到删除'''
                                                         
        def __init__(self, filepath='~', filename='sample.txt'):
            # 按filepath，读写模式打开名为filename的文件
            self.file=open(join(filepath,filename), 'r+')
                                                             
        def __del__(self):
            self.file.close()
            del self.file

<a id="operators"></a>
## 3.使操作符在自定义类内工作

使用 Python 神奇方法的优势之一就是它提供了一种简单的方式能让对象的行为像内建类型。这意味着你可以避免用丑陋，反直觉和非标准方法执行基本运算。在某些语言中，通常会这样做：

    if instance.equals(other_instance):
        # do something
 
你也应该在 Python 确实会这样做，但同时它会增加用户的疑惑以及不必要的冗长。不同的库可能会对相同的运算采用不同的命名，这使得用户比平常干了更多的事。依靠神奇方法的力量，你可以定义一个方法(比如 `__eq__`),然后带代替我们真实的意图：

    if instance == other_instance:
        # do something

现在你看到的是神奇方法力量的一部分。绝大多数都允许我们定义为运算符本身的意义，当用在我们自己定义的类上就像它们是内建类型。

<a id="comparisons"></a>
### 3.1 神奇方法——比较

Python 有一整套神奇方法被设计用来通过操作符实现对象间直观的比较，而非别扭的方法调用。它们同样提供了一套覆盖 Python 对象比较的默认行为(通过引用)。以下是这些方法的列表以及做法：

    __cmp__(self, other)

`__cmp__`是神奇方法中最基础的一个。实际上它实现所有比较操作符行为(`<`,`==`,`!=`,等)，但它有可能不按你想要的方法工作(例如，一个实例是否等于另一个这取决于比较的准则，以及一个实例是否大于其他的这也取决于其他的准则)。如果 `self < other`，那 `__cmp__` 应当返回一个负整数；如果 `self == other`，则返回 0；如果 `self > other`，则返回正整数。它通常是最好的定义，而不需要你一次就全定义好它们，但当你需要用类似的准则进行所有的比较时，`__cmp__` 会是一个很好的方式，帮你节省重复性和提高明确度。

    __eq__(self, other)
定义了相等操作符，`==`的行为。

    __ne__(self, other)
定义了不相等操作符，`!=` 的行为。

    __lt__(self, other)
定义了小于操作符，`<` 的行为。

    __gt__(self, other)
定义了大于操作符，`>` 的行为。

    __le__(self, other)
定义了小于等于操作符，`<=`的行为。

    __ge__(self, other)
定义了大于等于操作符，`>=` 的行为。

举一个例子，设想对单词进行类定义。我们可能希望能够按内部对 string 的默认比较行为，即字典序(通过字母)来比较单词，也希望能够基于某些其他的准则，像是长度或音节数。在本例中，我们通过单词长度排序，以下给出实现：

    class Word(str):
        '''单词类，比较定义是基于单词长度的'''
                                                
        def __new__(cls, word):
            # 注意，我们使用了__new__,这是因为str是一个不可变类型，
            # 所以我们必须更早地初始化它（在创建时）
            if ' ' in word:
                print "单词内含有空格，截断到第一部分"
                word = word[:word.index(' ')] # 在出现第一个空格之前全是字符了现在
            return str.__new__(cls, word)
                                                    
        def __gt__(self, other):
            return len(self) > len(other)
        def __lt__(self, other):
            return len(self) < len(other)
        def __ge__(self, other):
            return len(self) >= len(other)
        def __le__(self, other):
            return len(self) <= len(other)

现在，我们可以创建 2 个单词（通过 `Word('foo')` 和 `Word('bar')`)并基于它们的长度进行比较了。注意，我们没有定义 `__eq__` 和 `__ne__`。这是因为这可能导致某些怪异的行为（特别是当比较 `Word('foo') == Word('bar')` 将会得到 `True` 的结果）。基于单词长度的相等比较会令人摸不清头脑，因此我们就沿用了str 本身的相等比较的实现。

现在可能是一个好时机来提醒你一下，你不必重载每一个比较相关的神奇方法来获得各种比较。标准库已经友好地为我们在模板 `functools` 中提供了一个装饰(`decorator`)类，定义了所有比较方法。你可以只重载 `__eq__` 和一个其他的方法（比如 `__gt__`,`__lt__`，等）。这个特性只在 Python2.7(后?)适用，但当你有机会的话应该尝试一下，它会为你省下大量的时间和麻烦。你可以通过在你自己的重载方法在加上 `@total_ordering` 来使用。

<a id="numeric"></a>
### 3.2 神奇方法——数字

就像你可以通过重载比较操作符的途径来创建你自己的类实例，你同样可以重载数字操作符。系好你们的安全带，朋友们，还有很多呢。处于本文组织的需要，我会把数字的神奇方法分割成5块：一元操作符，常规算术操作符，反射算术操作符，增量赋值，类型转换。

#### 一元操作符

一元运算和函数仅有一个操作数，比如负数，绝对值等

    __pos__(self)
实现一元正数的行为(如：`+some_object`)

    __neg__(self)
实现负数的行为(如: `-some_object`)

    __abs__(self)
实现内建 `abs()` 函数的行为

    __invert__(self)
实现用~操作符进行的取反行为。你可以参考 Wiki:bitwise operations 来解释这个运算符究竟会干什么

#### 常规算术操作符

现在我们涵盖了基本的二元运算符:`+`，`-`，`*` 等等。其中大部分都是不言自明的。

    __add__(self, other)
实现加法

    __sub__(self, other)
实现减法

    __mul__(self, other)
实现乘法

    __floordiv__(self, other)
实现地板除法，使用 `//` 操作符

    __div__(self, other)
实现传统除法，使用 `/` 操作符

    __truediv__(self, other)
实现真正除法。注意，只有当你 `from __future__ import division` 时才会有效

    __mod__(self, other)
实现求模，使用 `%` 操作符

    __divmod__(self, other)
实现内建函数 `divmod()` 的行为

    __pow__(self, other)
实现乘方，使用 `**` 操作符

    __lshift__(self, other)
实现左按位位移，使用 `<<` 操作符

    __rshift__(self, other)
实现右按位位移，使用 `>>` 操作符

    __and__(self, other)
实现按位与，使用 `&` 操作符

    __or__(self, other)
实现按位或，使用 `|` 操作符

    __xor__(self, other)
实现按位异或，使用 `^` 操作符

#### 反射算术操作符

你知道我会如何解释反射算术操作符？你们中的有些人或许会觉得它很大，很可怕，是国外的概念。但它实际上很简单，下面给一个例子：

    some_object + other

这是“常规的”加法。而反射其实相当于一回事，除了操作数改变了改变下位置：

    other + some_object

因此，所有这些神奇的方法会做同样的事等价于常规算术操作符，除了改变操作数的位置关系，比如第一个操作数和自身作为第二个。此外没有其他的操作方式。在大多数情况下，反射算术操作的结果等价于常规算术操作，所以你尽可以在刚重载完 `__radd__`就调用 `__add__`。干脆痛快：

    __radd__(self, other)
实现反射加法

    __rsub__(self, other)
实现反射减法

    __rmul__(self, other)
实现反射乘法

    __rfloordiv__(self, other)
实现反射地板除，用 `//` 操作符

    __rdiv__(self, other)
实现传统除法，用 `/` 操作符

    __rturediv__(self, other)
实现真实除法，注意，只有当你 `from __future__ import division` 时才会有效

    __rmod__(self, other)
实现反射求模，用 `%` 操作符

    __rdivmod__(self, other)
实现内置函数 `divmod()` 的长除行为，当调用 `divmod(other,self)` 时被调用

    __rpow__(self, other)
实现反射乘方，用 `**` 操作符

    __rlshift__(self, other)
实现反射的左按位位移，使用 `<<` 操作符

    __rrshift__(self, other)
实现反射的右按位位移，使用 `>>` 操作符

    __rand__(self, other)
实现反射的按位与，使用 `&` 操作符

    __ror__(self, other)
实现反射的按位或，使用 `|` 操作符

    __rxor__(self, other)
实现反射的按位异或，使用 `^` 操作符

#### 增量赋值

Python 也有各种各样的神奇方法允许用户自定义增量赋值行为。你可能已经熟悉增量赋值，它结合了“常规的”操作符和赋值。如果你仍不明白我在说什么，下面有一个例子：

    x = 5
    x += 1 # 等价 x = x + 1

这些方法都不会有返回值，因为赋值在 Python 中不会有任何返回值。反而它们只是改变类的状态。列表如下：

    __iadd__(self, other)
实现加法和赋值

    __isub__(self, other)
实现减法和赋值

    __imul__(self, other)
实现乘法和赋值

    __ifloordiv__(self, other)
实现地板除和赋值，用 `//=` 操作符

    __idiv__(self, other)
实现传统除法和赋值，用 `/=` 操作符

    __iturediv__(self, other)
实现真实除法和赋值，注意，只有当你 `from __future__ import division` 时才会有效

    __imod__(self, other)
实现求模和赋值，用 `%=` 操作符

    __ipow__(self, other)
实现乘方和赋值，用 `**=` 操作符

    __ilshift__(self, other)
实现左按位位移和赋值，使用 `<<=` 操作符

    __irshift__(self, other)
实现右按位位移和赋值，使用 `>>=` 操作符

    __iand__(self, other)
实现按位与和赋值，使用 `&=` 操作符

    __ior__(self, other)
实现按位或和赋值，使用 `|=` 操作符

    __ixor__(self, other)
实现按位异或和赋值，使用 `^=` 操作符

#### 类型转换的神奇方法

Python 也有一组神奇方法被设计用来实现内置类型转换函数的行为，如 `float()`

    __int__(self)
实现到 `int` 的类型转换

    __long__(self)
实现到 `long` 的类型转换

    __float__(self)
实现到 `float` 的类型转换

    __complex__(self)
实现到复数的类型转换

    __oct__(self)
实现到 8 进制的类型转换

    __hex__(self)
实现到 16 进制的类型转换

    __index__(self)
实现一个当对象被切片到 `int` 的类型转换。如果你自定义了一个数值类型，考虑到它可能被切片，所以你应该重载 `__index__`

    __trunc__(self)
当 `math.trunc(self)` 被调用时调用。`__trunc__` 应当返回一个整型的截断，(通常是 `long`)

    __coerce__(self, other)
该方法用来实现混合模式的算术。如果类型转换不可能那 `__coerce__` 应当返回 `None`。
否则，它应当返回一对包含 `self` 和 `other`（2 元组），且调整到具有相同的类型

<a id="representations"></a>
## 4.描述你的类

用一个字符串来说明一个类这通常是有用的。
在 Python 中提供了一些方法让你可以在你自己的类中自定义内建函数返回你的类行为的描述。

    __str__(self)
当你定义的类中一个实例调用了 `str()`，用于给它定义行为

    __repr__(self)
当你定义的类中一个实例调用了 `repr()`，用于给它定义行为。
`str()` 和 `repr()` 主要的区别在于它的阅读对象。
`repr()` 产生的输出主要为计算机可读(在很多情况下，这甚至可能是一些有效的 Python 代码)，而 `str()` 则是为了让人类可读。

    __unicode__(self)
当你定义的类中一个实例调用了 `unicode()`，用于给它定义行为。
`unicode()` 像是 `str()`,只不过它返回一个 unicode 字符串。
警惕！如果用户用你的类中的一个实例调用了 `str()`,而你仅定义了 `__unicode__()`,那它是不会工作的。
以防万一，你应当总是定义好 `__str__()`，哪怕用户不会使用 unicode

    __hash__(self)
当你定义的类中一个实例调用了 `hash()`，用于给它定义行为。
它必须返回一个整型，而且它的结果是用于来在字典中作为快速键比对。

    __nonzero__(self)
当你定义的类中一个实例调用了 `bool()`，用于给它定义行为。
返回 `True` 或 `False`，取决于你是否考虑一个实例是 `True` 或 `False` 的。

我们已经相当漂亮地干完了神奇方法无聊的部分(无示例)，至此我们已经讨论了一些基础的神奇方法，是时候让我们向高级话题移动了。

<a id="access"></a>
## 5.属性访问控制

有许多从其他语言阵营转到 Python 来的人抱怨 Python 对类缺乏真正的封装（比如，没有办法自定义 `private` 属性，已经给出 `public` 的 `getter` 和 `setter`）。
这可不是真相哟：Python 通过神奇的方法实现了大量的封装，而不是通过明确的方法或字段修饰符。

请看：

    __getattr__(self, name)

你可以为用户在试图访问不存在（不论是存在或尚未建立）的类属性时定义其行为。
这对捕捉和重定向常见的拼写错误，给出使用属性警告是有用的（只要你愿意，你仍旧可选计算，返回那个属性）或抛出一个 `AttributeError` 异常。
这个方法只适用于访问一个不存在的属性，所以，这不算一个真正封装的解决之道。

    __setattr__(self, name, value)

不像 `__getattr__`，`__setattr__` 是一个封装的解决方案。
它允许你为一个属性赋值时候的行为，不论这个属性是否存在。
这意味着你可以给属性值的任意变化自定义规则。
然而，你需要在意的是你要小心使用 `__setattr__`,在稍后的列表中会作为例子给出。

    __delattr__

这等价于 `__setattr__`, 但是作为删除类属性而不是 `set` 它们。
它需要相同的预防措施，就像 `__setattr__`，防止无限递归（当在 `__delattr__` 中调用 `del self.name` 会引起无限递归）。

    __getattribute__(self, name)

`__getattribute__` 良好地适合它的同伴们 `__setattr__` 和 `__delattr__`。
可我却不建议你使用它。
`__getattribute__` 只能在新式类中使用（在 Python 的最新版本中，所有的类都是新式类，在稍旧的版本中你可以通过继承 `object` 类来创建一个新式类。
它允许你定规则，在任何时候不管一个类属性的值那时候是否可访问的。）
它会因为他的同伴中的出错连坐受到某些无限递归问题的困扰（这时你可以通过调用基类的 `__getattribute__` 方法来防止发生）。
当 `__getattribute__` 被实现而又只调用了该方法如果 `__getattribute__` 被显式调用或抛出一个 `AttributeError` 异常，同时也主要避免了对 `__getattr__` 的依赖。
这个方法可以使用（毕竟，这是你自己的选择），不过我不推荐它是因为它有一个小小的用例(虽说比较少见，但我们需要特殊行为以获取一个值而不是赋值)以及它真的很难做到实现 0bug。

你可以很容易地在你自定义任何类属性访问方法时引发一个问题。参考这个例子：

    def __setattr__(self, name, value):
        self.name = value
        # 当每次给一个类属性赋值时，会调用__setattr__(),这就形成了递归
        # 因为它真正的含义是 self.__setattr__('name', value)
        # 所以这方法不停地调用它自己，变成了一个无法退出的递归最终引发crash
                                         
    def __setattr__(self, name, value):
        self.__dict__[name] = value # 给字典中的name赋值
        # 在此自定义行为

再一次，Python 的神奇方法向我们展示了其难以置信的能力，同时巨大的力量也伴随着重大的责任。
重要的是让你明白正确使用神奇方法，这样你就不会破坏其他代码。

那么，我们在关于定制类属性访问中学习了什么？
不要轻易地使用，事实上它过于强大以及反直觉。
这也是它为何存在的理由：Python 寻求干坏事的可能性，但会把它们弄得很难。
自由是至高无上的，所以你可以做任何你想做的事情。
以下是一个关于特殊属性访问方法的实际例子（注意，我们使用 `super` 因为并非所有类都有 `__dict__` 类属性）：

    class AccessCounter:
        '''一个类包含一个值和实现了一个访问计数器。
        当值每次发生变化时，计数器+1'''
                                    
        def __init__(self, val):
            super(AccessCounter, self).__setattr__('counter',0)
            super(AccessCounter, self).__setattr__('value', val)
                                        
        def __setattr__(self, name, value):
            if name == 'value':
                super(AccessCounter, self).__setattr__('counter', self.counter + 1)
            # Make this unconditional.
            # 如果你想阻止其他属性被创建，抛出AttributeError(name)异常
            super(AccessCounter, self).__setattr__(name, value)
                                    
        def __delattr__(self, name)
            if name == 'value':
                super(AccessCounter, self).__setattr__('counter', self.counter + 1)
            super(AccessCounter, self).__delattr__(name)

<a id="sequence"></a>
## 6.制作自定义序列

很有多种方式可以让你的类表现得像内建序列(字典，元组，列表，字符串等)。
这些是我迄今为止最喜欢的神奇方法了，因为不合理的控制它们赋予了你一种魔术般地让你的类实例整个全局函数数组漂亮工作的方式。
在我们开始讲解这个内容之前，让我们先快速理清需求。

#### 需求

现在我们正在谈论如何创建你自己的序列。
也是什么谈一谈 protocol 了。
protocol 在某些地方跟接口很相似。
接口在其他语言中，是一组给定的方法，而你必须定义它们。
然而，在 Python 中 protocol 是完全非正式的，而且不要求显式声明去实现。
更进一步说，它们更像是准则。

为何我们现在要谈论 protocol？
因为在 Python 中要实现自定义容器类型会涉及使用到这其中某些 protocol。

首先，有一个 protocol 是为定义不可变容器的：为了制作一个不可变容器，你只需要定义 `__len__` 和 `__getitem__`（稍后详述）。
可变容器 protocol 要求所有不可变容器增加 `__setitem__` 和 `__delitem__`。
然后，如果你希望你的对象是可迭代的，那你还得定义一个会返回迭代器 `iterator` 的 `__iter__` 方法。
并且这个迭代器必须遵守一个迭代 `protocol`，也就是要求迭代器有回调方法 `__iter__` （返回自身）和 `next`。

#### 隐藏在容器背后的魔法

已经迫不及待了？以下便是容器使用的神奇魔法：

    __len__(self)

返回容器的长度。部分 protocol 同时支持可变和不可变容器

    __getitem__(self, key)

定义当某一个 item 被访问时的行为，使用 `self[key]` 表示法。
这个同样也是部分可变和不可变容器 protocol。
这也可抛出适当的异常: `TypeError` 当 `key` 的类型错误，或没有值对应 Key 时。

    __setitem__(self, key, value)

定义当某一个 item 被赋值时候的行为，使用 `self[key]=value` 表示法。
这也是部分可变和不可变容器 protocol。
再一次重申，你应当在适当之处抛出 `KeyError` 和 `TypeError` 异常。

    __delitem__(self, key)

定义当某一个 item 被删除（例如 `del self[key]`）时的行为。
这仅是部分可变容器的 protocol。在一个无效 `key` 被使用后，你必须抛出一个合适的异常。

    __iter__(self)

应该给容器返回一个迭代器。
迭代器会返回若干内容,大多使用内建函数 `iter()` 表示。
当一个容器使用形如 `for x in container:` 的循环。
迭代器本身就是其对象，同时也要定义好一个 `__iter__` 方法来返回自身。

    __reversed__(self)

当定义调用内建函数 `reversed()` 时的行为。应该返回一个反向版本的列表。

    __contains__(self, item)

`__contains__` 为成员关系，用 `in` 和 `not in` 测试时定义行为。
那你会问这个为何不是一个序列的 protocol 的一部分？
这是因为当 `__contains__` 未定义，Python 就会遍历序列，如果遇到正在寻找的 item 就会返回 `True`。

    __concat__(self, other)

最后，你可通过 `__concat__` 定义你的序列和另外一个序列的连接。
应该从 `self` 和 `other` 返回一个新构建的序列。
当调用 2 个序列时 `__concat__` 涉及操作符 `+`

#### 一个例子

在我们的例子中，让我们看一下一个 list 实现的某些基础功能性的构建。
可能会让你想起你使用的其他语言（比如 Haskell）。

    class FunctionalList:
        '''类覆盖了一个list的某些额外的功能性魔法，像head，
        tail，init，last，drop，and take'''
        def __init__(self, values=None):
            if values is None:
                self.values = []
            else:
                self.values = values
                                     
        def __len__(self):
            return len(self.values)
                                 
        def __getitem__(self, key):
            # 如果key是非法的类型和值，那么list valuse会抛出异常
            return self.values[key]
                                     
        def __setitem__(self, key, value):
            self.values[key] = value
                                     
        def __delitem__(self, key):
            del self.values[key]
                                 
        def __iter__(self):
            return iter(self.values)
                                     
        def __reversed__(self):
            return reversed(self.values)
                                 
        def append(self, value):
            self.values.append(value)
        def head(self):
            # 获得第一个元素
            return self.values[0]
        def tail(self):
            # 获得在第一个元素后的其他所有元素
            return self.values[1:]
        def init(self):
            # 获得除最后一个元素的序列
            return self.values[:-1]
        def last(last):
            # 获得最后一个元素
            return self.values[-1]
        def drop(self, n):
            # 获得除前n个元素的序列
            return self.values[n:]
        def take(self, n):
            # 获得前n个元素
            return self.values[:n]

通过这个(轻量的)有用的例子你知道了如何实现你自己的序列。
当然，还有很多更有用的应用，但是它们其中的很多已经被标准库实现了，像 Counter, OrderedDict, NamedTuple

<a id="reflection"></a>
## 7.反射

你也可以通过定义神奇方法来控制如何反射使用内建函数 `isinstance()` 和 `issubclass()` 的行为。
这些神奇方法是：

    __instancecheck__(self, instance)

检查一个实例是否是你定义类中的一个实例(比如，`isinstance(instance, class)`)

    __subclasscheck__(self, subclass)

检查一个类是否是你定义类的子类（比如，`issubclass(subclass, class)`）

这对于神奇方法的用例情况来说可能较小，可它的确是真的。
我并不想花费太多的时间在反射方法上面，因为他们不是那么地重要。
不过它们反映了在 Python 中关于面对对象编程一些重要的东西，而且在 Python 中的普遍：总是在找一种简单的方式来做某些事情，即使它能被用到的不多。
这些神奇方法似乎看上去不那么有用，但当你需要使用它们的时候你会感激它们的存在(和你阅读的这本指南!)。

<a id="callable"></a>
## 8.可调用对象

正如你可能已经知道，在 Python 中函数是第一类对象。
这就意味着它们可以被传递到函数和方法，就像是任何类型的对象。
这真是一种难以置信强大的特性。

这是 Python 中一个特别的神奇方法，它允许你的类实例像函数。
所以你可以“调用”它们，把他们当做参数传递给函数等等。
这是另一个强大又便利的特性让 Python 的编程变得更可爱了。

    __call__(self, [args...])

允许类实例像函数一样被调用。
本质上，这意味着 `x()` 等价于 `x.__call__()`。
注意，`__call__` 需要的参数数目是可变的，也就是说可以对任何函数按你的喜好定义参数的数目定义 `__call__`

`__call__` 可能对于那些经常改变状态的实例来说是极其有用的。
“调用”实例是一种顺应直觉且优雅的方式来改变对象的状态。
下面一个例子是一个类表示一个实体在一个平面上的位置：

    class Entity:
        '''描述实体的类，被调用的时候更新实体的位置'''
                              
        def __init__(self, size, x, y):
            self.x, self.y = x, y
            self.size = size
                                  
        def __call__(self, x, y):
            '''改变实体的位置'''
            self.x, self.y = x, y
                                  
        #省略...

<a id="context"></a>
## 9.上下文管理

在 Python2.5 里引入了一个新关键字（`with`）使得一个新方法得到了代码复用。
上下文管理这个概念在 Python 中早已不是新鲜事了（之前它作为库的一部分被实现过），但直到 [PEP343](http://www.python.org/dev/peps/pep-0343/) 才作为第一个类语言结构取得了重要地位而被接受。
你有可能早就已经见识过 `with` 声明：

    with open('foo.txt') as bar:
        # 对bar执行某些动作

上下文管理允许对对象进行设置和清理动作，用 `with` 声明进行已经封装的操作。
上下文操作的行为取决于 2 个神奇方法：

    __enter__(self)

定义块用 `with` 声明创建出来时上下文管理应该在块开始做什么。
注意，`__enter__` 的返回值必须绑定 `with` 声明的目标，或是 `as` 后面的名称。

    __exit__(self,  exception_type, exception_value, traceback)

定义在块执行（或终止）之后上下文管理应该做什么。
它可以用来处理异常，进行清理，或行动处于块之后某些总是被立即处理的事。
如果块执行成功的话，`excepteion_type`，`exception_value`，和 `traceback` 将会置 `None`。
否则，你可以选择去处理异常，或者让用户自己去处理。
如果你想处理，确保在全部都完成之后 `__exit__` 会返回 `True`。
如果你不想让上下文管理处理异常，那就让它发生好了。

`__enter__` 和 `__exit__` 对那些已有良好定义和对设置，清理行为有共同行为的特殊类是有用。
你也可以使用这些方法去创建封装其他对象通用的上下文管理。
看下面的例子：

    class Closer:
        '''用with声明一个上下文管理用一个close方法自动关闭一个对象'''
                       
        def __init__(self, obj):
            self.obj = obj
                           
        def __enter__(self):
            return self.obj # 绑定目标
                       
        def __exit__(self, exception_type, exception_val, trace):
            try:
                self.obj.close()
            except AttributeError: #obj不具备close
                print 'Not closable.'
                return True # 成功处理异常

以下是一个对于 `Closer` 实际应用的一个例子，使用一个 FTP 连接进行的演示（一个可关闭的套接字）：

    >>> from magicmethods import Closer
    >>> from ftplib import :;;
    >>> with Closer(FTP('ftp.somsite.com')) as conn:
    ...     conn.dir()
    ...
    # 省略的输出
    >>> conn.dir()
    # 一个很长的AttributeError消息， 不能关闭使用的一个连接
    >>> with Closer(int(5)) as i:
    ...     i += 1
    ...
    Not closeable.
    >>> i
    6

瞧见我们如何漂亮地封装处理正确或不正确的用例了吗？那就是上下文管理和神奇方法的威力。

<a id="descriptor"></a>
## 10.构建描述符对象

描述符可以改变其他对象，也可以是访问类中任一的 `getting`,`setting`,`deleting`。
描述符不意味着孤立；相反，它们意味着会被它们的所有者类控制。
当建立面向对象数据库或那些拥有相互依赖的属性的类时，描述符是有用的。
当描述符在几个不同单元或描述计算属性时显得更为有用。

作为一个描述符，一个类必须至少实现 `__get__`,`__set__`,和 `__delete__`中的一个。
让我们快点看一下这些神奇方法吧：

    __get__(self, instance, owner)
当描述符的值被取回时定义其行为。`instance` 是 `owner` 对象的一个实例，`owner` 是所有类。

    __set__(self, instance, value)
当描述符的值被改变时定义其行为。`instance` 是 `owner` 对象的一个实例，`value` 是设置的描述符的值

    __delete__(self, instance)
当描述符的值被删除时定义其行为。`instance` 是 `owner` 对象的一个实例。


现在，有一个有用的描述符应用例子：单位转换策略

    class Meter(object):
        '''米描述符'''
                
        def __init__(self, value=0.0):
            self.value = float(value)
        def __get__(self, instance, owner):
            return self.value
        def __set__(self, instance, value):
            self.value = float(value)
                
    class Foot(object):
        '''英尺描述符'''
                    
        def __get__(self, instance, owner):
            return instance.meter * 3.2808
        def __set__(self, instance, value):
            instance.meter = float(value) / 3.2808
                
    class Distance(object):
        '''表示距离的类，控制2个描述符：feet和meters'''
        meter = Meter()
        foot = Foot()

<a id="pickling"></a>
## 11.Pickling 你的对象

假如你花时间和其他 Pythonistas 打交道，那么你至少有可能听到过 Pickling 这个词。
Pickling 是一种对 Python 数据结构的序列化过程。
如果你需要存储一个对象，之后再取回它（通常是为了缓存）那么它就显得格外地有用了。
同时，它也是产生忧虑和困惑的主要来源。

Pickling 是那么地重要以至于它不仅有自己专属的模块(pickle)，还有自己的 protocol 和神奇方法与其相伴。
但首先用简要的文字来解释下如何 pickle 已经存在的类型（如果你已经懂了可以随意跳过这部分内容）

### Pickling:盐水中的快速浸泡

让我们跳入 pickling。
话说你有一个词典你想要保存它并在稍后取回。
你可以把它的内容写到一个文件中去，需要非常小心地确保你写了正确的语法，然后用 `exec()` 或处理文件的输入取回写入的内容。
但这是不稳定的:如果你你在纯文本中保存重要的数据，它有可能被几种方法改变，导致你的程序 crash 或在你的计算机上运行了恶意代码而出错。
于是，我们准备 pickle 它：

    import pickle
             
    data = {'foo': [1,2,3],
            'bar': ('Hello','world!'),
            'baz': True}
    jar = open('data.pk1', 'wb')
    pickle.dump(data, jar) # 把pickled数据写入jar文件
    jar.close()

好了现在，已经过去了几个小时。
我们希望拿回数据，而我们需要做的事仅仅是 `unpickle` 它：

    import pickle
          
    pk1_file = open('data.pk1','rb') #连接pickled数据
    data = pickle.load(pk1_file) #把数据load到一个变量中去
    print data
    pk1_file.close()

发生了什么事？正如你的预期，我们获得了 `data`。

现在，我要给你一些忠告：pickling 并非完美。
Pickle 文件很容易因意外或出于故意行为而被损毁。
Pickling 可能比起使用纯文本文件安全些，但它仍旧有可能会被用来跑恶意代码。
还有因为 Python 版本的不兼容问题，所以不要期望发布 Pickled 对象，也不要期望人们能够打开它们。
但是，它依然是一个强大的缓存工具和其他常见序列化任务。

### Pickling你自定义的对象

Pickling 不仅可用在内建类型上，还可以用于遵守 pickle 协议的任何类。
pickle 协议有 4 个可选方法用于定制 Python 对象如何运行（这跟 C 扩展有点不同，但那不在我们讨论的范围内）：

    __getinitargs__(self)
如果你想当你的类 unpickled 时调用 `__init__`，那你可以定义`__getinitargs__`，该方法应该返回一个元组的参数，然后你可以把他传递给 `__init__`。注意，该方法仅适用于旧式类。

    __getnewargs__(self)
对于新式类，你可以影响有哪些参数会被传递到 `__new__` 进行 unpickling。
该方法同样应该返回一个元组参数，然后能传递给 `__new__`

    __getstate__(self)
代替对象的 `__dict__` 属性被保存。
当对象 pickled，你可返回一个自定义的状态被保存。
当对象 unpickled 时，这个状态将会被 `__setstate__` 使用。

    __setstate__(self, state)
对象 unpickled 时，如果 `__setstate__` 定义对象状态会传递来代替直接用对象的 `__dict__` 属性。
这正好跟 `__getstate__` 手牵手：当二者都被定义了，你可以描述对象的 pickled 状态，任何你想要的。

一个例子：

我们的例子是 `Slate` 类，它会记忆它曾经的值和已经写入的值。
然而，当这特殊的 `slate` 每一次 `pickle` 都会被清空:当前值不会被保存。

    import time
       
    class Slate:
        '''存储一个字符串和一个变更log，当Pickle时会忘记它的值'''
       
        def __init__(self, value):
            self.value = value
            self.last_change = time.asctime()
            self.history = {}
       
        def change(self, new_value):
            # 改变值，提交最后的值到历史记录
            self.history[self.last_change] = self.value
            self.value = new_value
            self.last_change = time.asctime()
       
        def print_changes(self):
            print 'Changelog for Slate object:'
            for k, v in self.history.items():
                print '%st %s' % (k, v)
       
        def __getstate__(self):
            # 故意不返回self.value 或 self.last_change.
            # 当unpickle，我们希望有一块空白的"slate"
            return self.history
       
        def __setstate__(self, state):
            # 让 self.history = state 和 last_change 和 value被定义
            self.history = state
            self.value, self.last_change = None, None

<a id="conclusion"></a>
## 12.总结

这份指南的目标就是任何人读一读它，不管读者们是否具备 Python 或面对对象的编程经验。
如果你正准备学习 Python，那你已经获得了编写功能丰富，优雅，易用的类的宝贵知识。
如果你是一名中级 Python 程序员，你有可能已经拾起了一些新概念和策略和一些好的方法来减少你和你的用户编写的代码量。
如果你是一名 Pythonista 专家，你可能已经回顾了某些你可能已经被你遗忘的知识点，或着你又学习到了一些新技巧。
不管你的的经验等级，我希望这次 Python 神奇方法的旅程达到了真正神奇的效果。（我无法控制自己在最后不用个双关语）

<a id="appendix1"></a>
## 附录：如果调用神奇方法

Python 中的一些神奇方法直接映射到内建函数；在这种情况下，调用它们的方法是相当明显的。
然而，在其他情况下，那些调用方法就不这么明显了。
本附录致力于揭开能够引导神奇方法被调用的非明显语法。

<table>
    <tbody>
        <tr>
            <td>神奇方法</td>
            <td>调用方法</td>
            <td>说明</td>
        </tr>
        <tr>
            <td>`__new__(cls [,...])`</td>
            <td>`instance = MyClass(arg1, arg2)`</td>
            <td>`__new__` 在创建实例的时候被调用</td>
        </tr>
        <tr>
            <td>`__init__(self [,...])`</td>
            <td>`instance = MyClass(arg1, arg2)`</td>
            <td>`__init__` 在创建实例的时候被调用</td>
        </tr>
        <tr>
            <td>`__cmp__(self, other)`</td>
            <td>`self == other`, `self > other`, 等</td>
            <td>在比较的时候调用</td>
        </tr>
        <tr>
            <td>`__pos__(self)`</td>
            <td>`+self`</td>
            <td>一元加运算符</td>
        </tr>
        <tr>
            <td>`__neg__(self)`</td>
            <td>`-self`</td><td>一元减运算符</td>
        </tr>
        <tr>
            <td>`__invert__(self)`</td>
            <td>`~self`</td>
            <td>取反运算符</td>
        </tr>
        <tr>
            <td>`__index__(self)`</td>
            <td>`x[self]`</td>
            <td>对象被作为索引使用的时候</td>
        </tr>
        <tr>
            <td>`__nonzero__(self)`</td>
            <td>`bool(self)`</td>
            <td>对象的布尔值</td>
        </tr>
        <tr>
            <td>`__getattr__(self, name)`</td>
            <td>`self.name  # name不存在`</td>
            <td>访问一个不存在的属性时</td>
        </tr>
        <tr>
            <td>`__setattr__(self, name, val)`</td>
            <td>`self.name = val`</td>
            <td>对一个属性赋值时</td>
        </tr>
        <tr>
            <td>`__delattr__(self, name)`</td>
            <td>`del self.name`</td>
            <td>删除一个属性时</td>
        </tr>
        <tr>
            <td>`__getattribute(self, name)`</td>
            <td>`self.name`</td>
            <td>访问任何属性时</td>
        </tr>
        <tr>
            <td>`__getitem__(self, key)`</td>
            <td>`self[key]`</td>
            <td>使用索引访问元素时</td>
        </tr>
        <tr>
            <td>`__setitem__(self, key, val)`</td>
            <td>`self[key] = val`</td>
            <td>对某个索引值赋值时</td>
        </tr>
        <tr>
            <td>`__delitem__(self, key)`</td>
            <td>`del self[key]`</td>
            <td>删除某个索引值时</td>
        </tr>
        <tr>
            <td>`__iter__(self)`</td>
            <td>`for x in self`</td>
            <td>迭代时</td>
        </tr>
        <tr>
            <td>`__contains__(self, value)`</td>
            <td>`value in self`, `value not in self`</td>
            <td>使用 `in` 操作测试关系时</td>
        </tr>
        <tr>
            <td>`__concat__(self, value)`</td>
            <td>`self + other`</td>
            <td>连接两个对象时</td>
        </tr>
        <tr>
            <td>`__call__(self [,...])`</td>
            <td>`self(args)`</td>
            <td>“调用”对象时</td>
        </tr>
        <tr>
            <td>`__enter__(self)`</td>
            <td>`with self as x:`</td>
            <td>`with` 语句上下文管理</td>
        </tr>
        <tr>
            <td>`__exit__(self, exc, val, trace)`</td>
            <td>`with self as x:`</td>
            <td>`with` 语句上下文管理</td>
        </tr>
        <tr>
            <td>`__getstate__(self)`</td>
            <td>`pickle.dump(pkl_file, self)`</td>
            <td>序列化</td>
        </tr>
        <tr>
            <td>`__setstate__(self)`</td>
            <td>`data = pickle.load(pkl_file)`</td>
            <td>序列化</td>
        </tr>
    </tbody>
</table>

希望这张表格可以帮你扫清你有关语法涉及到神奇方法的问题。
