---
layout: post
title: go是函数式编程语言吗?
keywords: 函数式编程语言, go, google
category : other
tags : [函数式编程语言, go]
---

**go是函数式编程语言吗?**

不是, 当然不是.

**那么, go提供函数吗?**

是的, 当然, 大多数编程语言都提供函数, go也不例外. 不相信吗? 我会用代码让你闭嘴:

    func SayHello() {
        fmt.Println("Hello")
    }

看见了吧. go使用关键字func定义函数, 并在函数体中编写函数逻辑. 


**go函数可以接受参数吗?**

嗯, 我又看到一个白痴的问题, 呵呵. 哦, 我懂了, 也许是我的SayHello函数给大家造成了错觉, 我会改造我的代码:

    func SayHelloToSomeone(name string) {
        fmt.Println("Hello " + name + ".")
    } 

函数SayHelloToSomeone接受一个string类型的参数name.


**go函数是否可以有返回值?**

是的, 是的, 是的! 就像数学意义上的函数一样, go函数可以返回给调用者一些东西. 为了演示这一点, 我将重新编写一个函数:

    func GetGreeting (name string) string {
       greeting := "Hello " + name + "."
       return greeting
    }
    // test
    greeting := GetGreeting("Bob")
    fmt.Println(greeting) //outputs "Hello Bob." 

当然这没有什么, 其他语言也可以做到. 但是, 准备好接受惊喜了吗? 

go函数的返回值与其他类C语言有些不同, 比如, 你可以为返回值指定名称. 这带来至少2个好处:

1. 不需要在函数体中为返回值定义变量.
2. 无需在return语句后加上返回值. go会自动将返回值加上.

    func GetGreeting (name string) (greeting string) {
       greeting = "Hello " + name + "."
       return
} 

GetGreeting函数为其返回值指定了名称: greeting. 在函数体中就可以直接使用greeting变量了, greeting其实就相当于函数中定义的一个局部变量. 
而且如你所见, GetGreeting函数的return语句后面没有加上返回值, 因为go会自动将greeting变量的值返回给调用者.

**go函数可以返回多个值吗?**

这, 这, 你是异想天开吗? 不过强大的go函数能够做到这一点, 哈哈. 要知道可以有多个返回值的函数可以避免很多丑陋的代码, 下面是示例:

    type Stack struct {
        pos  int
        data [10]int
    }
    func (s *Stack) Pop() (value int, ok bool) {
        if s.pos > 0 {
            s.pos--
            ok = true
            value = s.data[s.pos]
            return
        }
        ok = false
        return
    } 

代码中首先定义了Stack类型, 并提供了Pop函数. Pop函数返回2个值: value和ok, 分别代表pop的值和pop操作是否成功.

**go函数可以接受一个函数作为参数吗?**

嗯, 我想你终于开始集中注意力了. 

如果你是一个医生, 你是否会对每次都需要向你的病人SayHello感到厌烦? 没关系, go可以帮助你. 首先需要定义新的数据结构:

    type TormentList struct {
        patients []string
    }
    // 将[]string(string数组)包装成TormentList类型的指针
    func NewTormentList(people []string) *TormentList {
       return &TormentList{people}
    }

接下来, 让我们悄悄给TormentList类型增加Map方法:

    func (g *TormentList) Map(f func(string)) {
        // 遍历g.patients, 为其每个value调用f方法
        for _, val := range(g.patients) {
            f(val)
        }
    } 

Map方法接受f函数作为其输入参数, f函数接受一个string类型的值. 遍历TormentList的病人, 并为每个病人调用f函数.

现在已经做好了一切准备, 剩下的就是测试了:

    patients := []string{"Anand", "David", "Ivan", "JoJo", "Jin", "Mon", "Peter", "Sachin"}
    gl := NewTormentList(patients)
    // 还记得上面定义的SayHelloToSomeone函数吧?
    gl.Map(SayHelloToSomeone)

    /*
    outputs the following:

    Hello Anand.
    Hello David.
    Hello Ivan.
    Hello JoJo.
    Hello Jin.
    Hello Mon.
    Hello Peter.
    Hello Sachin.
    */
 
**go函数的返回值可以是函数吗?**

让我们先考虑一个现实问题: 假如你拥有一份吃过寿司的人的清单, 你是否能够根据人名确定他是否在清单上? 这是个很简单的问题, 你只需遍历清单. 
嗯, 如果你go的功底很弱, 不知道怎么遍历清单那怎么办? 没关系, 我会给你提供一个刷选器:

    func Screen(patients []string) func(string) bool {
        // 定义匿名函数并返回
       return func(name string) bool {
           for _, soul := range patients {
               if soul == name {
                   return true
               }
           }
           return false
       }
    } 

Screen方法会将刷选的函数返回给调用方, 这样你就可以不用懂怎么去遍历清单了, 你只需调用我返回给你的函数就可以:

    // 吃过寿司的人的清单
    those_who_bought_sushi := []string{"Anand", "JoJo", "Jin", "Mon", "Peter", "Sachin"}
    // 得到刷选器函数
    bought_sushi := Screen(those_who_bought_sushi)
    // 调用刷选器函数就可以知道某人是否在清单上
    fmt.Println(bought_sushi("Anand")) // true
    fmt.Println(bought_sushi("Alex")) // false
 
[本文翻译自[这里][1], 对原文有所扩展, 也有所删减. 版权属于原作者, 转载必须保留此声明.]

[1]: http://www.mprescient.com/journal/2011/2/8/screwtape-letter-32-is-go-a-functional-programming-language.html
