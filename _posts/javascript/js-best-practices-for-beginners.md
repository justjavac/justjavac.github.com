---
layout: post
title: JavaScript初学者应知的24条最佳实践（译）
tags: [JavaScript, 翻译]
---

原文：[24 JavaScript Best Practices for Beginners](http://net.tutsplus.com/tutorials/javascript-ajax/24-javascript-best-practices-for-beginners/)

译者：[youngsterxyf](https://github.com/youngsterxyf)

*（注：阅读原文的时候没有注意发布日期，觉得不错就翻译了，翻译到JSON.parse那一节觉得有点不对路才发现是2009年发布的文章，不过还是不错的啦。另外，文章虽说24条最佳实践，其实只有23条，不知道原作者怎么漏了一条。）*

###1.优先使用===，而不是==

JavaScript使用两种相等性操作符：===|!==和==|!=。通常认为做比较的最佳实践是使用前一组操作符。

>
>"若两个操作数的类型和值相同，那么===比较的结果为真，!==比较的结果为假。" --- JavaScript语言精粹(JavaScript: The Good Parts)
>

然而，如果使用==和!=，当比较不同类型的操作数时，你就会碰到问题啦。在这种情况下，这组操作符会尝试对操作数的值做无用的强制转换。

###2.Eval就是糟糕的代名词

对于那些不熟悉JavaScript的人来说，函数"evel"让我们能够访问JavaScript编译器。我们可以通过给"eval"传递一个字符串参数来得到该字符串执行的结果。

这不仅会极大地降低你的脚本的性能，也会造成一个巨大的安全隐患，因为这赋予传递进来的纯文本太多的能力。要尽可能地避免eval函数的使用。

###3.不要懒手

技术上来说，你确实可能侥幸地省略多数花括号和分号。大多数浏览器都能够正确地解释如下代码片段：

{% highlight js %}
if(someVariableExists)
    x = false
{% endhighlight %}

然而，再考虑一下这段代码：

{% highlight js %}
if(someVariableExists)
    x = false
    anotherFunctionCall();
{% endhighlight %}

可能会有人认为上一段代码等价于：

{% highlight js %}
if(someVariableExists) {
    x = false;
    anotherFunctionCall();
}
{% endhighlight %}

很不幸，他错了。事实上，它的本意是：

{% highlight js %}
if(someVariableExists)
    x = false;
anotherFunctionCall();
{% endhighlight %}

你应该也注意到了，代码中缩进模仿了花括号的功能。毋庸置疑，这是非常恐怖的做法，无论如何都应该避免。唯一可以省略花括号的时候是在一行式的语句中，但即使这种情况，也是很有争议的。

{% highlight js %}
if(2 + 2 === 4) return 'nicely done';
{% endhighlight %}

**始终要想着以后**

如果以后的某个时候，你需要在这种if语句中增加更多的命令，那该怎么办呢？没法子，你就只能重写这块代码了。处理这个问题的底线是对于省略写法保持谨慎。

###4.使用JS Lint

[JSLint](http://www.jslint.com/)是Douglas Crockford编写的一个调试器。简单地将你的脚本拷贝进去，它就会快速地扫描你的代码中任何明显的问题和错误。

>
>"JSLint获取一份JavaScript源码，然后扫描代码。如果发现问题，就会返回一条信息描述这个问题以及这个问题在源码中的大致位置。问题虽然经常是语法错误，却不一定是。JSLint也会查看一些风格习惯以及结构问题。它并不证明你的代码是否正确，只是提供另外的一双眼睛来帮助发现问题。"---JSLint文档
>

在结束脚本代码的编写之前，对其执行一次JSLint，能够保证你不会犯一些愚蠢的错误。

###5.将脚本置于页面的底部

这条技巧在本系列前面的文章中也推荐过。因为它在此处也非常合适（As it's highly appropriate though），所有我将那段信息直接粘贴在这里。

<img src="/assets/pics/javascriptButton.png" alt="javascriptButton.png">

记住---这条最佳实践的主要目标是尽可能快速地为用户加载页面。当加载一个脚本时，浏览器直到整个脚本文件全部加载完毕才能继续。因此，用户必须等上更长的时间才能注意到任何的进度。

如果JS文件的目的仅仅是增加功能---例如，在点击某个按钮后---那么就将那些文件放在底部，body结束标签之前吧。这绝对是一个最佳实践。

**更好的做法**

{% highlight js %}
<p>And now you know my favorite kinds of corn. </p>
<script type="text/javascript" src="path/to/file.js"></script>
<script type="text/javascript" src="path/to/anotherFile.js"></script>
</body>
</html>
{% endhighlight %}

###6.在For语句之外声明变量

当执行一个冗长的"for"语句之时，仅仅让解释引擎做必须干的活吧。例如：

**糟糕的做法**

{% highlight js %}
for(var i = 0; i < someArray.length; i++) {
    var container = document.getElementById('container');
    container.innerHtml += 'my number: ' + i;
    console.log(i);
}
{% endhighlight %}

注意上面代码片段中的每次迭代都需要检查数组的长度，并且每次都要遍历DOM树找到"container"元素---效率多低啊！

**更好的做法**

{% highlight js %}
var container = document.getElementById('container');
for(var i = 0, len = someArray.length; i < len; i++) {
    container.innerHtml += 'my number: ' + i;
    console.log(i);
}
{% endhighlight %}

感谢有位朋友留下评论展示如何进一步优化上面的代码块。

###7.构建字符串的最快方式

当需要遍历一个数组或者对象之时，不要总是使用你能信手粘来的"for"语句。创造性地找个能够完成工作的最快速的方案。

{% highlight js %}
var arr = ['item 1', 'item 2', 'item 3', ...];
var list = '<ul><li>' + arr.join('</li><li>') + '</li></ul>';
{% endhighlight %}

>
> "我不会以测试基准来烦你；你只须相信我（或者自己去测试一下）---这是目前为止最快的方式！"
>
> 使用原生方法（比如join()），不用管抽象层面背后发生了什么，通常会比任何非原生方法快得多。 --- James Padolsey, james.padolsey.com"
>

###8.减少全局变量

>
> "通过将全局的东西封装进单个命名空间，能够大大降低与其他应用、部件、代码库交互混乱的概率。"--- Douglas Crockford
>

{% highlight js %}
var name = 'jeffrey';
var lastname = 'Way';

function doSomething() {...}

console.log(name);      // Jeffrey -- or window.name
{% endhighlight %}

**更好的做法**

{% highlight js %}
var DudeNameSpace = {
    name: 'Jeffrey',
    lastname: 'Way',
    doSometing: function() {...}
}
console.log(DudeNameSpace.name);    // Jeffrey
{% endhighlight %}

注意我们是怎样将全局性的“足迹”减少为一个命名可笑的"DudeNameSpace"对象的。

###9.注释你的代码

一开始看起来似乎没有必要，但请相信我，你将会想尽可能好地注释你的代码。当你几个月后再次回到项目，会发生什么呢？发现你根本没法轻松地记起当初对每一行代码的想法。或者，如果你的某个同事需要修改你的代码，那又会怎么样呢？始终，一直记着注释你代码的重要部分吧。

{% highlight js %}
// Cycle through array and echo out each name
for(var i = 0, len = array.length; i < len; i++) {
    console.log(array[i]);
}
{% endhighlight %}

###10.拥抱渐进增强

始终考虑到如何处理JavaScript禁用的情况。也许你会想“大多数我网页的阅读器都是启用JavaScript的，因此我不担心这个问题。”然而，这会是一个巨大的错误。

你曾花时间去看过关闭JavaScript后你的漂亮的滑动条是什么样么？（[下载](https://addons.mozilla.org/en-US/firefox/addon/web-developer/)Web开发者工具栏以方便干这事。）也许它会完全破坏你的站点。按照以往经验，设计你的站点时应假设将会禁用JavaScript。那么，一旦你这样做了，那么开始渐进地增强你的网页布局吧！

###11.不要传递字符串给"SetInterval"或"SetTimeOut"

考虑一下如下代码：

{% highlight js %}
setInterval(
"document.getElementById('container').innerHTML += 'my new number: ' + i", 3000
);
{% endhighlight %}

这段代码不仅低效，而且其行为与"eval"函数相同。永远不要传给字符串给SetInterval和SetTimeOut。相反，应传递一个函数名。

{% highlight js %}
setInterval(someFunction, 3000);
{% endhighlight %}

###12.不要使用"With"语句

乍一看，"With"语句似乎是个聪明的想法。基本概念是它们能够为访问深度嵌套对象提供一种简写方式。例如...

{% highlight js %}
with (being.person.man.bodyparts) {
    arms = true;
    legs = true;
}
{% endhighlight %}

**取代如下写法**

{% highlight js %}
being.person.man.bodyparts.arms = true;
being.person.man.bodyparts.legs = true;
{% endhighlight %}

很不幸，经过一些测试，会发现这种简写在设置新成员时表现非常糟糕。作为替代，你应该使用var。

{% highlight js %}
var o = being.person.man.bodyparts;
o.arms = true;
o.legs = true;
{% endhighlight %}

###13.使用{}而不是New Object()

JavaScript中有多种创建对象的方式。也许更传统的方式是使用"new"构造器，像这样：

{% highlight js %}
var o = new Object();
o.name = 'Jeffrey';
o.lastname = 'Way';
o.someFuncion = function() {
    console.log(this.name);
}
{% endhighlight %}

然而，这种方式因其行为并不是我们所想的那样而被认为是“糟糕的实践。相反，我推荐你使用更健壮的对象字面方法。

**更好的写法**

{% highlight js %}
var o = {
    name: 'Jeffrey',
    lastName: 'Way',
    someFunction: function() {
        console.log(this.name);
    }
};
{% endhighlight %}

注意如果你只是想简单地创建个空对象，{}就派上用场了。

{% highlight js %}
var o = {};
{% endhighlight %}

>
> "对象字面量使我们能够编写支持很多特性的代码，并对代码的实现者来说代码仍然相对直观。不需要直接调用构造器或维护传递给函数的参数的正确顺序，等等。" --- dyn-web.com
>

###14.使用\[\]而不是New Array()

这同样适用于创建一个新数组。

**过得去的写法**

{% highlight js %}
var a = new Array();
a[0] = 'Joe';
a[1] = 'Plumber';
{% endhighlight %}

**更好的写法**

{% highlight js %}
var a = ['Joe', 'Plumber'];
{% endhighlight %}

>
>"JavaScript中一个常见的错误是需要数组时使用对象或需要对象时使用数组。规则很简单：当属性名是小的连续整数时，你应该使用数组。否则，使用对象"---Douglas Crockford
>

###15.一长串变量？省略"var"关键字，使用逗号替代

{% highlight js %}
var someItem = 'some string';
var anotherItem = 'another string';
var oneMoreItem = 'one more string';
{% endhighlight %}

**更好的写法**

{% highlight js %}
var someItem = 'some string',
    anotherItem = 'another string',
    oneMoreItem = 'one more string';
{% endhighlight %}

相当的不言自明。我不知道这里是否有任何真正的速度提升，但是它使你的代码更加简洁了。

###16.始终，始终使用分号

技术上来说，大多数浏览器都允许你的省略一些分号。

{% highlight js %}
var someItem = 'some string'
function doSomething() {
    return 'something'
}
{% endhighlight %}

话虽如此，但这是一种非常糟糕的做法，可能导致更大的问题，问题查找起来也更困难。

**更好的写法**

{% highlight js %}
var someItem = 'some string';
function doSomething() {
    return 'something';
}
{% endhighlight %}

###18."For in"语句

遍历对象内的成员时，你也会得到方法函数。为了解决这个问题，应始终将你的代码包装在一个if语句中来过滤信息。

{% highlight js %}
for(key in object) {
    if(object.hasOwnProperty(key)) {
        ... then do something...
    }
}
{% endhighlight %}

引自*JavaScript: 语言精粹， Douglas Crockford著*

###19.使用Firebug的"Timer"特性来优化代码

需要一种快速简单的方法来检测一个操作花费多长时间么？使用Firebug的"timer"特性记录结果。

{% highlight js %}
function TimeTracker() {
    console.time("MyTimer");
    for(x=5000; x > 0; x--){}
    console.timeEnd("MyTimer");
}
{% endhighlight %}

###20.阅读，阅读，再阅读

我是一个Web开发博客的超级粉丝（比如这个博客！），但吃午餐或者睡前，博客确实不是书籍的替代品。始终在你的床前桌上放一本wen开发书籍吧。如下是一些我最喜欢的JavaScript书籍。

- [面向对象的JavaScript](http://www.packtpub.com/object-oriented-javascript-applications-libraries/book)
- [JavaScript：语言精粹](http://oreilly.com/catalog/9780596517748/)
- [学习jQuery 1.3](http://www.packtpub.com/learning-jquery-1.3/book)
- [学习JavaScript](http://oreilly.com/catalog/9780596527464/)

多阅读几遍。我仍旧在读！

###21.自执行函数(Self-Executing Functions)

相比调用函数，当页面加载或调用父函数时，让函数自动执行会简单些。简单地将你的函数包装在圆括号内，并添加额外的一对圆括号，其本质上就调用了这个函数。

{% highlight js %}
(function doSomething() {
    return {
        name: 'jeff',
        lastName: 'way'
    };
 })();
{% endhighlight %}

###22.原始(raw)JavaScript代码的执行速度始终快于使用代码库

JavaScript代码库，如jQuery和Mootools，能够为你节省大量的编码时间---特别是使用AJAX操作。话虽如此，始终谨记代码库的执行速度始终是比不上原始JavaScript代码的（假设了代码的正确性）。

jQuery的"each"方法用来做遍历非常赞，但使用原生"for"语句始终会快一些。

###23.Crockford的JSON.Parse

虽然JavaScript 2应该有一个内置的JSON解析器，但写本文之时，我们仍旧需要自己实现。Douglas Crockford，JSON的创造者，已经实现了一个解析器供你使用。可以从[这里](https://github.com/douglascrockford/JSON-js)下载。

简单地导入该脚本，你就能获得一个新的JSON全局对象，用于解析你的.json文件。

{% highlight js %}
var response = JSON.parse(xhr.responseText);

var container = document.getElementById('container');
for(var i = 0, len = response.length; i < len; i++) {
    container.innerHTML += '<li>' + response[i].name + ' : ' + response[i].email + '</li>';
}
{% endhighlight %}

###24.删除"Language"

几年前，在script标签内常见有"language"属性。

{% highlight js %}
<script type="text/javascript" language="javascript">
...
</script>
{% endhighlight %}

然而，这个属性很早就被弃用了，所以就不要再使用了。

###就这些了，同志们

现在你知道这JavaScript初学者应该知道的24条基本技巧。有机会也让我知道一下你的小贴士吧。感谢阅读。
