---
layout: post
title: 如何避免产生赋值语句
description: 如何避免产生赋值语句
category : javascript
tags : [javascript, 赋值]
---

我在之前的文章里谈论过 [赋值语句的危害性][1]。 
使用赋值语句会使程序变的冗长，更难理解。
但事实上，赋值语句对编程来说是一种基本语句，想限制它的使用几乎是不可能的。

幸运的是，我们实际上是能做到的，下面我就会向你展示如何去做。

## 用正确的方式初始化

    // 错误       |  // 正确
    int x;        |
    // ...        |  // ...
    x = init();   |  int x = init();

“正确” 方式的主要优点是你能很方便的浏览 x 的定义的同时知道它的值。
这样也能 **保证 x 始终处在一个固定变量状态**，大多数的编译器都能检测到这种状态。
其次，这样可以使代码减少冗余。

“错误” 方式之所以存在完全是因为很多老式的编程语言都强制要求在程序的开始处先声明变量。
这样编译器好处理。
但现在这已经不是问题了，即使在 C 语言里。

## 构造新数据

    // 错误          |  // 正确
    int x = init();  |  int x = init();
    // ...           |  // ...
    x = something(); |  int y = something();

这样做很重要。

它能保证变量被定义后不会被改变。
不留任何机会。
x的值我们可以保证它是通过 `init()` 初始化的值。

人们使用 “错误” 方式一般有两个原因：高效和简洁。
效率并不是个问题，现代编译器能够通过给变量重新分配地址来优化性能。
而由于简洁而导致的语义模糊是得不偿失的。

## 用函数，不要用过程

    // 错误                  |  // 正确
    void to_utf8(string s);  |  string to_utf8(string s);
                             |
    // ...                   |  // ...
                             |
    string s1 = latin();     |  use_string(to_utf8(latin()))
    to_utf8(s1);             |
    use_string(s1);          |

“正确” 方式使用的是一个普通的数字函数：它接受输入值，返回计算后的值。
另一边，“错误” 方式使用了过程。
跟函数不一样，过程不仅会影响返回的结果，还能影响其它数据，例如，过程中可以修改它的参数值。
这会使这些参数很容易被污染。

所以， **当能够使用函数的时候，尽量不要使用过程**。
你的程序这样会变得更简单。
这种技巧可以让你避免去思考如何去做(变换一个字符串)，而是如何被做(一个变换了的字符串)。
要着眼于最终结果，而不是处理过程。

“错误” 方式之所以存在完全是由于许多老的编程语言很难处理复杂的返回值。
你只能返回单个数字。

所以，当需要一个内容更丰富的返回值时，你只能在过程中达到这个目的。
而真正的返回值通常是一些简单的错误标号代码。
然而现在不同了，返回复杂的结果已经不再是个问题。
即使是在 C 语言里你也可以返回复杂的结果。

## 固化你的对象

在很多的入门级的介绍面向对象编程的课程中，你能看到这样一个著名的二维坐标的例子：

    // 非常非常错误
    class Point
    {
    public:
      // constructor
      Point() { x = 0; y = 0; }

      float get_x() { return x; }
      float get_y() { return y; }

      void set_x(float new_x) { x = new_x; }
      void set_y(float new_y) { y = new_y; }

      move(Point p) {
        x = x + p.x;
        y = y + p.y;
      }
    private:
      float x; float y;
    };

这样设计的原因很简单：你可以通过构造函数创建一个新的坐标，然后通过 `set_x()` 和 `set_y()` 进行初始化。
内部数据是经过封装的(private)，只能通过 `get_x()` 和 `get_y()` 来访问。
还有个好处是，你可以通过 `move()` 方法来移动这个坐标点。

然而，从代码本身看，却是没必要的复杂化了，而且有几个主要的错误：

* 构造函数直接把 x 和 y 初始化成 0 了。如果你希望它是其它值，你还需要手工的设置。你不能初始时做到这些。
* 操作一个点的缺省方法就是修改它。这是一种赋值操作。你被限制了创建一个新值。
* set_x(), set_y(), 和 move() 方法现场修改这个对象。这些是过程, 不是函数。
* x (和 y) 是私有的，但你可以通过 get_x() 和 set_x()操作它们。所以，你认为你是封装了它们，而实际上没有。
* move() 这个方法不需要放在 Point 类里。放在类里使类的体积变大，影响理解和使用。

正确的设计更简单，而且不失功能：

    // 正确的
    class Point
    {
    public:
      // constructor
      Point (float x, float y) {
        _x = x; _y = y;
      }

      x() { return x; }
      y() { return y; }

    private:
      float _x; float _y
    }

    Point move(Point p1, Point p2) {
      return Point(p1.x() + p2.x(),
                   p1.y() + p2.y());
    }

另外，如果你愿意，你可以把 _x 和 _y 声明成 public 和常量。

## 使用纯功能性数据结构

从上面的介绍里我们说明了应该构建新数据。

这个建议即使是大数据结构也是有效的。
意外吗，它并不是像你想象的那样失去作用。
有时候你为了避免每次都拷贝整个数据结构，你可能要使用修改操作。
而数组和 hash table 就是属于这种情况的。

这种情况下你应该是使用我们所谓的纯功能性数据结构。
如果你想对这有所了解，Chris Okasaki’s thesis (也是同名著作)是个好的教材。
这里，我只给大家简单的讲讲 linked list。

一个链接表要么是个空表，要么是其中有个单元格存着一个指向另一个表的指针。

    ┌───┬───┐   ┌───┬───┐
    │ x │  ───> │ y │  ───> empty
    └───┴───┘   └───┴───┘

这样的数据结构如果在ML语言里是很好设计出来的，但在以类为基础的语言里会稍微有点复杂：

    -- Haskell
    -- A list is either the Empty list,
    -- or it contains an Int and a List
    data List = Empty
              | NotEmpty Int List

    -- utility functions

    is_empty Empty         = true
    is_empty NotEmpty x xs = false

    head Empty         = error
    head NotEmpty x xs = x

    tail Empty         = error
    tail notEmpty x xs = xs

    // Java(ish)
    class List
    {
    public:
      // constructors
      List() { _is_empty = true; }
      List(int i, List next) {
        _i        = i;
        _next     = next;
        _is_empty = false;
      }

      bool is_empty() { return _is_empty; }

      int head() {
        if (_is_empty) error();
        return _i;
      }

      List tail() {
         if (_is_empty) error();
         return _next;
      }

    private:
      int  _i;
      List _next;
      bool _is_empty;
    }

你可以看到，现在这个 List 类是不可变的。
我们不能修改 List 对象。
我们只能在现有的对象外新建新的 List。 
这很容易。
因为当你构建一个新 List 时，它会共享现有的大多数的单元。

假设我们有个 list l，和一个整数i：

        ┌───┬───┐   ┌───┬───┐
    l = │ x │  ───> │ y │  ───> empty
        └───┴───┘   └───┴───┘

    i = 42

此时，在 l 的顶部加入 i，这样就会产生一个新的 list l2：

         ┌──┬───┐
    l2 = │i │ │ |
         └──┴─│─┘
              │
              │  ┌──┬───┐  ┌──┬──┐
    l  =      └─>│x │ ───> │y │ ───> empty
                 └──┴───┘  └──┴──┘

或者，在代码里：

    List l  = List(x, List(y, List()));
    int  i  = 42;

    List l2 = List(i, l); // cheap

l 仍然存在，不可变，而新建的 l2 只是多了一个新建的单元。
类似的，删除顶部的元素也是不费任何资源的容易。

当我们不能这样做时有时，你不能避免赋值操作，或者受其它因素限制。
也许是你需要更高的效率，你必须修改数据状态来优化程序。
或者由于一些外界因素影响，比如一个用户。
或者由于你使用的语言不能自动处理内存使用，这些都会阻止你使用**纯功能性**的数据结构。

这种情况下你所能做的最好的方式是隔离那些程序中不合规范的代码(那些使用赋值语句的代码)。
比如说，你想给一个数组排序，你必须用 quicksort。
Quicksort 严重的依赖于变换转移操作，但是你可以隐藏这些操作：

    array pure_sort (array a)
    {
      array a2 = copy(a);
      quicksort(a2); // modify a2, nothing else
      return a2;
    }

于是，当 `pure_sort()` 这个内部函数不能按照我的建议的去写时，影响并不大，因为它被限制在函数内了。
最终，`pure_sort()` 的行为就像是个普通的函数了。

相反的，当你与其它业务有交互时，要小心的将交互部分的代码和运算部分的代码分隔开。
比如你要写段在屏幕上画个点的程序，而且能根据鼠标的移动而移动。

写出来可能会是这样：

    // 错误

    Point p(0, 0);
    wile(true) // loop forever
    {
      p = move(p, get_mouse_movement());

      if (p.x() < 0   ) p = Point(0    , p.y());
      if (p.x() > 1024) p = Point(1024 , p.y());
      if (p.y() < 0   ) p = Point(p.x(), 0    );
      if (p.y() > 768 ) p = Point(p.x(), 768  );

      draw(p);
    }

这里有个错误，它在主程序里对越界坐标进行了检查。

更好的方式是这样：

    // 正确

    point smart_move(point p, point mouse_movement)
    {
      float x = p.x() < 0    ? 0
              : p.x() > 1024 ? 1024
              :                p.x();

      float y = p.y() < 0   ? 0
              : p.y() > 768 ? 768
              :               p.y();

      return Point(x, y);
    }

    // 主程序
    Point p(0, 0);
    wile(true) // loop forever
    {
      p = smart_move(p, get_mouse_movement());
      draw(p);
    }

现在，主程序变得更简单了。
运算部分，`smart_move()`，可以进行单独测试，甚至可以在其它地方重用。 

现在，如果你不喜欢这样的三元操作的语法，不想按我介绍的规则，不去构造新数据：

    // 这样也不是很差

    point smart_move(point p, point mouse_movement)
    {
      float x = p.x();
      float y = p.y();

      if (x < 0   ) x = 0;
      if (x > 1024) x = 1024;
      if (y < 0   ) y = 0;
      if (y > 768 ) y = 768;

      return Point(x, y);
    }

不管你怎么写，`smart_move()` 始终应该是个函数。

结论我说的这些都是关于降低耦合的技巧。
**每个程序都应该有很清晰的内部边界**。
**每个模块应暴露最少量的接口**。
这能使程序更易于理解和使用。

避免使用赋值语句，坚持对象恒定的原则能使接口清晰明确。
但这也不是银弹，这只是辅助手段。
很有用的辅助手段。
