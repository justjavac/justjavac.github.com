---
layout:     post
title:      一天时间用python写门语言
keywords: python
description: 用一天的时间，利用python写一门属于自己的编程语言。
category : python
tags : [python]
---

今天没事做, 就又练习写计算器程序了. 
本来打算用python来写一个简单的支持加减乘除括号的计算器, 
后来有加上了变量复制, 比较符, 条件判断, 循环, 最后还加上了函数, 
几乎可以说是一个简单的语言了. 以后我也可以说写过一门语言了哈哈.

回到正题. 这里面整理一下这个简单的程序用到的方法, 
代码在: <https://bitbucket.org/linjunhalida/code-example/src/tip/python/calculator/>

一开始, 我希望实现一个简单的支持加减乘除括号的计算器, 
我不打算用python自带的方式(eval), 而是自己写一个. 

虽然有种种取巧的方式, 我还是采用教科书般的方法, 首先词法分析, 然后语法分析+计算结果.

## 词法分析

词法分析的函数是syntax_analysis, 输入一个字符串, 拆分成一个个的词, 解析整型和浮点. 

比如: "2 \* 3 + 1" 就拆分成 [2, '\*', 3, '+', 1], 没什么好说的, 从头开始解析即可. 
没有用到状态机, 只是简单的根据字符串的首字母做条件判断, 然后一个个往下读, 根据状况拆分.

## 语法分析

我采用的方法是从the C++ programming language里面那个计算机程序学来的方法: 
首先写出基本的语法, 
然后每个语法模块写一个函数, 
然后通过函数的递归调用来模拟语法树的生成和解析, 不需要显式地生成语法树.

我用了一个类Caculator来保存词法分析后的list, 以及当前处理到的符号位置, 
变量表等东西, 语法模块都是这个类的方法, 这样写起来方便一点.

我们一部分一部分来吧. 首先我先实现加减乘除括号. 整理基本的语法:

    l0 = (ltop) | n | - n
    l1 = l1 * l0 | l1 / l0 | l0
    l2 = l2 + l1 | l2 - l1 | l1
    ltop = l2

n 是数字. 
里面l0, l1, l2, 是根据优先级做了分割, 保证优先级高的操作首先执行. 
ltop的目的是为了方便扩充新的运算符号.

l2函数如下, 整体的逻辑是, 

* 当发现下一个符号是'+-'的时候, 就一直解析和计算v, 然后返回v. 
* self.ls是词法分析后的词列表, 
* self.p是表示当前处理到的词位置. 
* inc()表示解析下一个词, 
* get()获取下一个词, 
* has_next()判断下面还有没有.

所有的函数都类似这样的方式, 不传参数进去, 解析词列表, 返回计算后的结果.

    def l2(self):
        v = self.l1()
        while (self.has_next()
               and self.isstr(self.get())
               and self.get() in '+-'):
            if self.get() == '+':
                self.inc()
                v2 = self.l1()
                v += v2
            elif self.get() == '-':
                self.inc()
                v2 = self.l1()
                v -= v2
        return v
    
赋值然后我开始实现赋值功能, 同时考虑扩展成为能够解析多个表达式的语法, 
这个基本也是抄the C++ programming language的方法, 改了几点:

* 加了program, exp_list, exp, 更像一个语言了.
* l0加上NAME, 能够获取NAME对应变量的值.
* assignment赋值的操作. 为了通用, 赋值也是有返回值的.

    l0 = (ltop) | n | NAME

    program = END | exp_list END
    exp_list = exp_list ; exp
    exp = ltop | assignment

    assignment = NAME = exp

赋值和计算都是exp的一种, 代码是这样写的:

    def exp(self):
        if self.has_next(1):
            if self.get(1) == '=':
                return self.assignment()
            ...

        return self.ltop()
        
我在Caculator类里面加了一个values的dict, 用来保存赋值的值, 赋值和获取值的代码:

    def assignment(self):
        name = self.get()
        self.inc()
        self.inc()
        v = self.exp()
        self.values[name] = v
        return v

    def l0(self):
        g = self.get()
        ...
        elif self.issymbol(g):
            self.inc()
            return self.values[g]
        
条件判断现在我的简单语法变得有点像一门真正的语言了, 但是还缺少很多必要的东西, 
我思考如何实现条件判断. 

首先实现判断语句, 语法:

    l3 = l2 < l2 | l2 > l2 | l2 == l2 | l2
    ltop = l3

实现很简单, 判断下一个符号是什么而已, 为了简单, 
我没有加上True/False, 而是统一用1/0的方式来做, 真返回1, 假返回0.

    def l3(self):
        v = self.l2()

        if not self.has_next():
            return v

        if self.get() == '<':
            self.inc()
            v2 = self.l2()
            if v < v2: return 1
            else: return 0
        elif self.get() == '>':
            self.inc()
            v2 = self.l2()
            if v > v2: return 1
            else: return 0
        elif self.get() == '==':
            self.inc()
            v2 = self.l2()
            if v == v2: return 1
            else: return 0

        return v
        
然后实现条件判断. 语法如下:

    exp = ltop | assignment | condition
    condition = if ltop {exp_list} else {exp_list}

exp里面判断第一个词是不是if, 然后跳转到condition函数(循环, 函数也采用类似的方法来判断), 
然后解析条件判断的值, 如果大于一, 解析第一个exp_list, 
不然解析第2个exp_list. 里面做了一些语法错误的判断. 

还有else部分是可选的, 为了简单没有实现elif的方式. 
对于不需要解析的exp_list, 我利用goto_next_block来跳转, 要注意的是处理嵌套{}的问题.

    def exp(self):
        if self.has_next(1):
            if self.get(1) == '=':
                return self.assignment()
            elif self.get() == 'if':
                return self.condition()
            ...

    def condition(self):
        self.inc()
        v = self.ltop()
        if self.get() != '{':
            self.error('exp error : no {')
        self.inc()

        if v > 0:
            v = self.exp_list()
        else:
            self.goto_next_block()

        if self.get() != '}':
            self.error('exp error : not }')
        self.inc()

        if self.has_next() and self.get() == 'else':
            self.inc()
            if self.get() != '{':
                self.error('exp error : no {')
            self.inc()

            if v <= 0:
                v = self.exp_list()
            else:
                self.goto_next_block()

            if self.get() != '}':
                self.error('exp error : not }')
            self.inc()
        return v

    def goto_next_block(self):
        count = 1
        while self.has_next():
            if self.get() == '}':
                count -= 1
                if count <= 0: break
            elif self.get() == '{':
                count += 1
            self.inc()
            
循环好了, 条件判断实现了, 下面该是循环了. 语法:

    exp = ltop | assignment | condition | loop
    loop = while ltop {exp_list}

具体实现上, 我缓存了loop开始的位置, 先判断ltop, 
如果发现满足, 执行exp_list, 
然后设置self.p为loop开始,
然后继续判断ltop. 
不满足的话就跳出来.. 比我现象中的容易实现.

    def loop(self):
        self.inc()
        p = self.p
        while True:
            v = self.ltop()

            if self.get() != '{':
                self.error('exp error : no {')
            self.inc()

            if v > 0:
                v = self.exp_list()
            else:
                self.goto_next_block()

            if self.get() != '}':
                self.error('exp error : not }')
            self.inc()

            if v <= 0:
                break
            else:
                self.p = p

        return v
        
函数好了, 没有函数的语言是不完整的. 
为了实现函数, 需要做很多工作.

先看语法, l0上面加的是调用函数, function_args是函数调用的参数, 
exp里面加上函数定义的部分, function_args_names是形参.

    l0 = (ltop) | n | NAME | - n | NAME ( function_args )

    exp = ltop | assignment | condition | loop | function

    function = def NAME(function-args-names){exp_list}
    function_args_names = function_args , NAME | NAME  | None
    function_args = function_args , exp | exp | None

根据我看SICP学来的经验, 函数可以采用环境来实现. 

所谓环境的概念, 就是函数本身是嵌套的, 每个函数内部就是一个环境, 
保存有一些局部变量, 只在函数内部有效. 

传给函数的参数就是在函数的环境里面做对应的赋值.

比如: def f1(a, b) {...}; f1(1, 2) , 
f1的环境是env1, f2的环境是env2, 在调用f1的时候, 
执行到f1内部时, Caculator的self.env是env1, env1.values含有a, b 2个变量, 
值分别是调用f1(1, 2)时传进来的1和2.

我们看Env类的定义. 

现在我们删除掉Caculator的values, 
让Env的 get_value()和set_value来获取和设置变量. 
Env是嵌套的, 因为函数调用的时候, 也可以访问上层赋值过的变量.

    class Env():
        def __init__(self, parent=None):
            self.values = {}
            self.parent = parent

        def get_value(self, v):
            if v in self.values:
                return self.values[v]

            if not self.parent:
                raise Exception('cannot find value: %s, current_values: %s' % (v, str(self.values)))

            return self.parent.get_value(v)

        def set_value(self, name, v):
            self.values[name] = v
            
然后是函数赋值, 我把函数抽象成了一个类, 保存函数名,
开始位置, 以及缓存词列表, 因为caculator类是可以执行多次代码的. 

最后我利用赋值的方式把函数保存下来.

    class Func():
        pass

    def function(self):
        func = Func()

        self.inc()

        name = self.get()
        if not self.issymbol(name):
            self.error('function error name : %s' % name)
        self.inc()
        func.name = name

        if self.get() != '(':
            self.error('function error not (')
        self.inc()

        func.arg_names = self.function_args_names()

        if self.get() != ')':
            self.error('function error not )')
        self.inc()

        if self.get() != '{':
            self.error('function error not {')
        self.inc()

        func.p = self.p
        func.ls = self.ls

        self.goto_next_block()

        if self.get() != '}':
            self.error('function error not }')
        self.inc()

        self.env.set_value(func.name, func)
        return 0
        
然后是函数执行的部分了. l0里面根据语法识别到函数调用, 然后执行function_all, 
里面首先生成一个新的环境, 然后在新的环境里面, 
把实际参数赋值给形参, 然后保存现在的ls, p, env, 然后执行函数体, 
然后回复ls, p, env. 

function_args解析和返回实际参数列表, 
function_args_names解析和返回形参名称, 保存在Func.names里面, 都比较简单就不列出来了.

    def l0(self):
        g = self.get()
        ...
        elif (self.has_next(2)
              and self.issymbol(g)
              and self.get(1) == '('):
            func = self.env.get_value(g)
            self.inc()
            self.inc()
            args = self.function_args()

            if not self.get() == ')':
                self.error('l0 function call error')
            self.inc()

            return self.function_call(func, args)

    def function_call(self, func, args):
        env = Env(self.env)
        for name, v in zip(func.arg_names, args):
            env.set_value(name, v)

        self.push_p(env, func.p, func.ls)

        v = self.exp_list()

        return v

    def push_p(self, env, p, ls):
        self.env = env
        self.pre_p = self.p
        self.p = p
        self.pre_ls = self.ls
        self.ls = ls

    def pop_p(self):
        if self.env.parent == None:
            self.error('pop_p: no parent for env!')
        self.env = self.env.parent
        self.p = self.pre_p
        self.ls = self.pre_ls
        
写完后才知道, 真的... 不复杂!

函数可以返回现在函数还是一直执行到结尾才返回, 
我希望能够支持return语句, 原本考虑了半天, 不知道如何通过重重的函数调用, 
返回到最上面, 后来经过 岚临 同学的提醒, 用抛出异常, 
在上层捕捉的方式实现了, 加的代码只有4行!

语法:

    exp = ltop | assignment | condition | loop | function | return
    return_exp = return ltop

进到return_exp里面后, 会抛出ReturnException, 
在function_call里面捕捉, 正好是当前调用函数的部分.

    class ReturnException(Exception):
        """for implement return expression"""
        def __init__(self, v):
            Exception.__init__(self)
            self.value = v

    def function_call(self, func, args):
        try:
            v = self.exp_list()
            self.pop_p()
        except ReturnException as e:
            v = e.value

    def exp(self):
        if self.has_next(1):
            ...
            elif self.get() == 'return':
                return self.return_exp()

    def return_exp(self):
        self.inc()
        v = self.exp()
        self.pop_p()
        raise ReturnException(v)
        
结论我一开始没有想到能够写那么多的, 结果一个语法一个语法加下来就变成这样了... 

虽然没有性能优化, 以及其他的错误处理什么的东西, 
能够写出一个简单的语言, 还是让我很有成就感的. 

我不是一个很强的程序员, 也能写出一个简单的语言, 相信你也可以写一个来玩玩!

下一步: 虚拟机+字节码+编译 方式的语言, 实现协程+原生同步!

(本文来自网络，原文已不可考，貌似已经太监了)
