---
layout: post
title: web.py 0.3 新手指南 - 模板系统
description: web.py 的模板语言叫做Templetor，它能负责将 python 的强大功能传递给模板系统。在模板中没有重新设计语法，它是类 python 的。
keywords: python, web.py, 新手指南, 模板
category : python
tags : [python, web.py]
---

<h2 name="introduction">Introduction</h2>

<style>
pre {
    background-color:#F0F0F0;
    border:1px solid #CCCBBA;
       padding: 10px 10px 10px 20px;
}
code {
    background: inherit;
    color: inherit;
}
.warning {
    border: 1px solid #FFAAAA;
    padding: 10px;
    background-color: #FFF0F0;
}
</style>

web.py 的模板语言叫做 `Templetor`，它能负责将 python 的强大功能传递给模板系统。
在模板中没有重新设计语法，它是类 python 的。 
如果你会 python，你可以顺手拈来。

这是一个模板示例:

    $def with (name)
    Hello $name!

第一行表示模板定义了一个变量 `name`。
第二行中的 `$name` 将会用 `name` 的值来替换。

<div class="warning">
如果是从 web.py 0.2 升级请看这里 <a href="#upgrading">升级 </a> 部分。
</div>

<a name="using"> </a>
## 使用模板系统

通用渲染模板的方法：

    render = web.template.render('templates')
    return render.hello('world')
   
`render` 方法从模板根目录查找模板文件，`render.hello(..)`表示渲染 hello.html 模板。实际上，系统会在根目录去查找叫 `hello`的所有文件，直到找到匹配的。(事实上他只支持 .html 和 .xml 两种)

除了上面的使用方式，你也可以直接用文件的方式来处理模板 `frender`：

    hello = web.template.frender('templates/hello.html')
    render hello('world')
    
直接使用字符串方式：

    template = "$def with (name)\nHello $name"
    hello = web.template.Template(template)
    return hello('world')

<a name="syntax"> </a>
## 语法

### 表达式用法

特殊字符 `$` 被用于特殊的 python 表达式。表达式能够被用于一些确定的组合当中 `()` 和 `{}`:

    Look, a $string. 
    Hark, an ${arbitrary + expression}. 
    Gawk, a $dictionary[key].function('argument'). 
    Cool, a $(limit)ing.

### 赋值

有时你可能需要定义一个新变量或给一些变量重新赋值，如下：
    
    $ bug = get_bug(id)
    <h1>$bug.title</h1>
    <div>
        $bug.description
    <div>

注意 `$`在赋值变量名称之前要有一个空格，这有区别于常规的赋值用法。

### 过滤

模板默认会使用 `web.websafe` 过滤 html 内容(encodeing 处理)。

    >>> render.hello("1 < 2")
    "Hello 1 &lt; 2"

不需要过滤可以在 `$` 之后 使用 `:`。示例：

    该 Html 内容不会被义
    $:form.render()
    
### 新起一行用法

在行末添加 `\` 代表显示层该内容不会被真实处理成一行。

    If you put a backslash \ 
    at the end of a line \ 
    (like these) \ 
    then there will be no newline.
    
### 转义 `$`

使用 `$$` 可以在输出的时候显示字符 `$`.

    Can you lend me $$50?
    
### 注释

`$#` 是注释指示符。任何以 `$#` 开始的某行内容都被当做注释。

    $# this is a comment
    Hello $name.title()! $# display the name in title case

### 控制结构

模板系统支持 `for`, `while`, `if`, `elif` 和 `else`。像 python 一样，这里是需要缩进的。

    $for i in range(10): 
        I like $i

    $for i in range(10): I like $i
        
    $while a:
        hello $a.pop()

    $if times > max: 
        Stop! In the name of love. 
    $else: 
        Keep on, you can do it.

`for` 循环内的成员变量只在循环内发生可用：

    loop.index: the iteration of the loop (1-indexed)
    loop.index0: the iteration of the loop (0-indexed)
    loop.first: True if first iteration
    loop.last: True if last iteration
    loop.odd: True if an odd iteration
    loop.even: True if an even iteration
    loop.parity: "odd" or "even" depending on which is true
    loop.parent: the loop above this in nested loops
    
有时候，他们使用起来很方便：

    <table>
    $for c in ["a", "b", "c", "d"]:
        <tr class="$loop.parity">
            <td>$loop.index</td>
            <td>$c</td>
        </tr>
    </table>
    
### 其他

#### 使用 `def`

可以使用 `$def` 定义一个新的模板函数，支持使用参数。

    $def say_hello(name='world'):
        Hello $name!
    
    $say_hello('web.py')
    $say_hello()

其他示例：
        
    $def tr(values):
        <tr>
        $for v in values:
            <td>$v</td>
        </tr>

    $def table(rows):
        <table>
        $for row in rows:
            $:row
        </table>
    
    $ data = [['a', 'b', 'c'], [1, 2, 3], [2, 4, 6], [3, 6, 9] ]
    $:table([tr(d) for d in data])
    
#### 代码

可以在 `code` 块书写任何 python 代码：
    $code:
        x = "you can write any python code here"
        y = x.title()
        z = len(x + y)
        
        def limit(s, width=10):
            """limits a string to the given width"""
            if len(s) >= width:
                return s[:width] + "..."
            else:
                return s
                
    And we are back to template.
    The variables defined in the code block can be used here.
    For example, $limit(x)
    
#### 使用 `var`

`var` 块可以用来定义模板结果的额外属性：

    $def with (title, body)
    
    $var title: $title
    $var content_type: text/html
    
    <div id="body">
    $body
    </div>
    
以上模板内容的输出结果如下：

    >>> out = render.page('hello', 'hello world')
    >>> out.title
    u'hello'
    >>> out.content_type
    u'text/html'
    >>> str(out)
    '\n\n<div>\nhello world\n</div>\n'

<a name="builtins"> </a>
## 内置 和 全局

像 python 的任何函数一样，模板系统同样可以使用内置以及局部参数。很多内置的公共方法像 `range`，`min`，`max`等，以及布尔值 `True` 和 `False`，在模板中都是可用的。部分内置和全局对象也可以使用在模板中。

全局对象可以使用参数方式传给模板，使用 `web.template.render`：

    import web
    import markdown
    
    globals = {'markdown': markdown.markdown}
    render = web.template.render('templates', globals=globals)

内置方法是否可以在模板中也是可以被控制的：

    # 禁用所有内置方法
    render = web.template.render('templates', builtins={})

<a name="security"> </a>
## 安全

模板的设计想法之一是允许非高级用户来写模板，如果要使模板更安全，可在模板中禁用以下方法：

* 不安全部分像 `import`，`exec` 等；
* 允许属性开始部分使用 `_`；
* 不安全的内置方法 `open`, `getattr`, `setattr` 等。

如果模板中使用以上提及的会引发异常 `SecurityException`。

<a name="upgrading"> </a>
## 从 web.py 0.2 升级

新版本大部分兼容早期版本，但仍有部分使用方法会无法运行，看看以下原因：

* Template output is always storage like `TemplateResult` object, however converting it to `unicode` or `str` gives the result as unicode/string.
* 重定义全局变量将无法正常运行，如果 x 是全局变量下面的写法是无法运行的。
    
        $ x = x + 1
    
以下写法仍被支持，但不被推荐。

* 如果你原来用 `\$` 反转美元字符串， 推荐用 `$$` 替换；
* 如果你有时会修改 `web.template.Template.globals`，建议通过向 `web.template.render` 传变量方式来替换。