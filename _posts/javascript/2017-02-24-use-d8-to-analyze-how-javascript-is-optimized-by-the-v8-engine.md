---
layout: post
title: 使用 D8 分析 javascript 如何被 V8 引擎优化的
keywords: javascript,V8
category : javascript
tags : [javascript, V8]
---

在上一篇文章中我们讲了[如何使用 GN 编译 V8 源码][1]，文章最后编译完成的可执行文件并不是 V8，而是 D8。这篇我们讲一下如何使用 D8 调试 javascript 代码。

**如果没有 d8，可以使用 node 代替。**

新建文件 [add-of-ints.js][2]，输入以下内容：

```
function add(obj) {
    return obj.prop + obj.prop;
}

const length = 1000 * 1000;

const o = { prop: 1 };

for (let i = 0; i < length; i++) {
    add(o);

}
```

运行：

    d8 --trace-opt-verbose add-of-ints.js
    或
    node --trace-opt-verbose add-of-ints.js

输出结果为：

![][3]

从输出结果我们可以看到 add 函数被编译器优化了，并且解释了优化的原因。ICs 是 [inline caches][4] 的缩写，内联缓存是一种很常见的优化技术，这段简短的代码被 V8 引擎优化了两次，但是原因却不同。

- 第一次优化的原因是 small function，add 函数是小函数，为了减小函数调用的开销，V8 引擎对 add 做了优化。

- 第二次的原因是 hot and stable，我在知乎另一个问题中曾说过，V8 有两个编译器，一个通用编译器，负责将 javascript 代码编译为机器码，另一个是优化编译器。从上面的输出可以看出 V8 使用的优化编译器引擎是 Crankshaft。Crankshaft 负责找出经常被调用的代码，做内联缓存优化，后面的信息进一步说明了这个情况：ICs with typeinfo: 7/7 (100%), generic ICs: 0/7 (0%)。

在此再纠正之前的 2 个问题。

一个是 ~~V8 没有解释器，只有编译器，代码是直接编译成机器吗执行的~~，这是之前的 V8，而网络上关于 V8 的文章也大多比较老旧。这几天为了阅读 V8 源码查看了网上很多关于 V8 的论文和文章，发现 V8 已经引进了[解释器][5]。因为 V8 不仅仅可以优化代码，还可以去优化（deopt），引入解释器可以省去一些代码的重编译时间，另一个原因是解释器不仅仅可以解释 javascript 代码，还可以解释 asm 或者其他二进制中间码。

另一个错误就是关于 V8 优化的，之前写过 [JavaScript 函数式编程存在性能问题么？][6] 中道：

> 永远不可能被优化的有：
> 
>  - Functions that contain a debugger statement 
>  - Functions that call literally eval() 
>  - Functions that contain a with statement

这个也是之前的文章，是以 Crankshaft 引擎为标准得出的结论。而 V8 已经开发了新的优化引擎——[TurboFan][7]。

我们再创建另一个文件 add-of-mixed.js，输入：

```
// flag: --trace-opt-verbose

function add(obj) {
    return obj.prop + obj.prop;
}

var length = 1000 * 1000;

var objs = new Array(length);

var i = 0;

for (i = 0; i < length; i++) {
    objs[i] = Math.random();
}

var a = { prop: 'a' };
var b = { prop: 1 };

for (i = 0; i < length; i++) {
    add(objs[i] > 0.5 ? a : b);

}
```

运行：

```
d8 --trace-opt-verbose add-of-mixed.js
或
node --trace-opt-verbose add-of-mixed.js
```

输出结果为：

![][8]

![][9]


可以看到这段代码能不能做内联缓存优化全看 RP(人品) 了。

我们再使用 `--trace-opt --trace-deopt` 参数看看 V8 引擎如何**去优化**。

新建文件 [add-of-mixed-dep.js][10]，输入：

```
// flags: --trace-opt --trace-deopt

function add(obj) {
    return obj.prop + obj.prop;
}

var length = 10000;
var i = 0;
var a = { prop: 'a' };
var b = { prop: 1 };

for (i = 0; i < length; i++) {
    add(i !== 8000 ? a : b);

}
```

运行：

```
d8 --trace-opt --trace-deopt add-of-mixed-dep.js
或
node --trace-opt --trace-deopt add-of-mixed-dep.js
```

结果为：

![][11]

V8 引擎内部使用 [Hidden Classes][12] 来表示 Object，关于 Hidden Classes 的文章已经很多了，我就不累述了。

运行 `d8 --help` 可以查看所有的 d8 命令行参数。如果使用 node，直接运行 `node --help` 输出的是 node 的命令行参数，如果想查看 V8 的，需要使用 `node --v8-options`。

后面章节会介绍 V8 的 GC（命令行参数 `--trace-gc`）以及最有意思的 `--allow-natives-syntax`。

推荐阅读一下 V8 的 [bailout-reason.h][13] 源码，这是一个 C++ 的头文件，里面几乎没有任何代码逻辑，定义了所有 javascript 代码不能被 V8 引擎优化的原因，比如：

```
"Array index constant value too big"
"eval"
"ForOfStatement"
"Too many parameters"
"WithStatement"
……
```

后面章节介绍的 `--allow-natives-syntax` 相关 C++ 头文件是 [runtime.h][14]，通过 `--allow-natives-syntax` 参数可以在 javascript 中使用 V8 的运行时函数。我们在之前的文章中已经使用过了，例如 `HasFastProperties`。

参考文章：

 - [V8 - A Tale of Two Compilers][15] 
 - [Performance Tips for JavaScript in V8][16]
 - [Ignition: V8 Interpreter][17]


  [1]: https://zhuanlan.zhihu.com/p/25120909
  [2]: https://github.com/justjavac/v8-source-read/blob/master/src/add-of-ints.js
  [3]: /assets/images/trace-opt-verbose-1.png
  [4]: https://en.wikipedia.org/wiki/Inline_caching
  [5]: https://docs.google.com/document/d/11T2CRex9hXxoJwbYqVQ32yIPMh0uouUZLdyrtmMoL44/edit#
  [6]: https://www.zhihu.com/question/54637225/answer/140362071
  [7]: http://v8project.blogspot.de/2015/07/digging-into-turbofan-jit.html
  [8]: /assets/images/trace-opt-verbose-2.png
  [9]: /assets/images/trace-opt-verbose-3.png
  [10]: https://github.com/justjavac/v8-source-read/blob/master/src/add-of-mixed-dep.js
  [11]: /assets/images/trace-opt-verbose-4.png
  [12]: http://blog.twokul.io/hidden-classes-in-javascript-and-inline-caching/
  [13]: https://github.com/v8/v8/blob/84b9c6301e4e01bb084f467bc8582826cdf55e28/src/bailout-reason.h
  [14]: https://github.com/v8/v8/blob/84b9c6301e4e01bb084f467bc8582826cdf55e28/src/runtime/runtime.h#L856-L919
  [15]: http://wingolog.org/archives/2011/07/05/v8-a-tale-of-two-compilers
  [16]: https://www.html5rocks.com/en/tutorials/speed/v8/
  [17]: https://docs.google.com/document/d/11T2CRex9hXxoJwbYqVQ32yIPMh0uouUZLdyrtmMoL44/edit#
