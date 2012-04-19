---
layout: post
title: lua脚本文档中文翻译（基础）
description: lua脚本文档中文翻译（基础）
keywords: 手册, 文档, 翻译, lua
category : other
tags : [手册, 文档, 翻译, lua]
---
 
## 介绍
 
Lua读作“鹿啊”，是一种据创作者说的类Pascal脚本语言。
巴西人做的，其名字"lua"是西班牙语的月亮。
Lua是目前在游戏工业中用得最多的脚本语言。
优点是执行速度快。
 
## 基本概念
 
一段脚本就是一组命令和数据。

命令的术语叫作 **语句**，一段语句可以用 `do ... end` 括起来构成一个语句块。
语句块是一个相对独立的块，逻辑上等同于一条语句。
 
脚本中两个减号“--”后面到行末的内容为 **注释**，脚本解释器会忽略它们。
多行注释为“-- [[”打头直到匹配的“]]”。

 
**标识符** 是字母或下划线打头由字母、下划线和数字组成的标识，用作变量名或函数名。
 
## 数据

数据分不同的类型。

Lua支持的类型有：

    nil：空类型，即没有数据
    boolean：布尔类型，即真(true)或假(false)
    number：数值类型，如123，24.5，1.23e-12 (即1.23乘10的-12次方）
    string：字符串，即一段文字
    table：数据表类型，即键-值数据对的集合
    function：函数，即一段命令，在脚本中命令也可作为数据操作
    userdata：用户数据，扩展的数据类型
    thread：线程类型
 
保存数据的东西叫变量。变量分全局变量和局部变量。
全局变量一直存在，局部变量只执行到它所在的局部才存在。
应该尽量使用局部变量，以避免逻辑错误。
 
例：

        local x = 10        -- 局部变量x保存数值10
        local title = "你好" -- 局部变量title保存字符串"你好"
        local dead = true   -- 局部变量dead保存真

     
        x = 10                -- 全局变量x保存10
        do                    -- 语句块
          local x = x         -- 局部变量x被赋予全局变量x的值，只在块内存在
          print(x)            --> 显示10
          x = x+1
          do                  -- 又一个内部语句块
               local x = x+1     -- 又一个局部变量只在该块内存在
            print(x)          --> 显示12
          end
          print(x)            --> 显示11
        end
        print(x)              --> 显示10  全局变量x的值
 
## 字符串
 
字符串数据使用引号括起来以区别于其他符号，注意是英文引号。

如：

        "Hello, world!"
    
字符串中，用“/"”表示引号，用“/'”表示单引号，用“//”表示“/”，用“/n”表示换行。

## 表达式
 
**表达式** 就是算式概念的扩展。
 
数学表达式的运算符有 +, -, \* (乘), / (除), ^ (指数)，- (负号)<br />
如果操作数是字符串类型，并可以被转换成数值，则将自动转换成数值
 
关系运算符返回布尔值true或false，有：== （等于），~= （不等于），< （小于），> （大于），<= （小于等于），>= （大于等于）<br />
注意，对数值类型不要用==比较，应判断两数的差是否小于一个足够小的数，否则对有些数看起来相等却不相等。0 除外。
 
逻辑运算符包括：and （和，并且）， or （或者），not （非，不）<br />
逻辑运算的操作数一定要是布尔类型或nil，nil表示空，被当作false处理。使用其他类型的操作数不会报错，因为有其特定的功能，但坚决不推荐使用。
 
字符串连接运算符：.. （取得两个字符串连接后的字符串）<br />
如果操作数是数值型，则自动转换为字符串
 
优先级，从底到高：

    or
    and
    <     >     <=    >=    ~=    ==
    ..
    +     -
    *     /
    not   - (负号)
    ^
       
..和^是右结合，就是说 `2^2^3 == 2^(2^3)`。
 
例：

    hp < 10 and not player.frozen -- hp小于10 并且 玩家没有被冰冻 时为真
 
## 流程控制语句
 
    while 表达式 do
      语句块
    end

如果表达式的结果为true，则执行语句块，到end后返回while再循环。
如果表达式的结果为false，则跳过语句块执行end后的语句。
 
    repeat
      语句块
    until 表达式

先执行语句块，再判断表达式是否为true，是则继续向下执行，否则返回repeat重复。
 
循环内可用break语句跳出包含该break的一层循环。
 
    if 表达式 then
      语句块
    else
      语句块
    end

     
    if 表达式 then
      语句块
    elseif 表达式 then
      语句块
    else
      语句块
    end

根据表达式的结构选择执行。
 
    for 循环变量 = 初值, 终值 do
      语句块
    end

     
    for 循环变量 = 初值, 终值，每次的增量 do
      语句块
    end

**绝对不要在for语句块中修改循环变量**。
 
## 函数
 
函数即可被重复调用的语句块。
 
    function 函数名(参数列表)
      语句块
    end
 
参数列表为用逗号分隔的变量名列表，当执行到函数体内部时，他们就是函数体内的局部变量，
并且已用调用时指定的实参赋值。参数列表可以为空。
 
函数可以返回值给调用者，使用 

    return 返回值
    
执行return之后将从函数返回调用者的下一条语句继续执行。
 
例：

    function max(a, b)
      if a > b then
        return a
      else
        return b
    end

     
    local c = max(10, 20)   -- c == 20
 
调用函数时使用

    函数名(参数列表) 或 函数名()
    
注意括号必须加上，这样才表示函数调用，执行函数内的语句。
如果不加则表示一个函数类型的值。\*

 
当需要返回多个值时，使用

    return 返回值1，返回值2，...
    
调用时用多个变量接收返回值，例：

    local v1, v2, v3
    v1, v2, v3 = a_multi_return_value_funtion()
    
注意尽量不要使用多返回值，因为脚本解释器不检查变量的个数是否匹配，多则丢弃，少则置nil，容易倒致错误而不易发现。
 
## 数据表
 
数据表是脚本系统的核心数据结构，本质上是从键到值的映射。
其它的数据结构都由数据表表示。

如数组，以从1开始的整数为键索引：

    local arr = {10, 100, 1000} -- arr[1] = 10, arr[2] = 100, arr[3] = 1000
    
词典，以字符串索引：

    local dict = {"pig" = "猪", "dog" = "狗"} -- dict["pig"] = "猪" ……
    
对象，以属性（即对对象的描述）名索引：

    local pig = {legs = 4, tail = 1, name = "猪"} -- pig.legs = 4 ……
    
作为对象使用时，字符串作键、函数作值即表示对象的方法（即对对象的操作），调用方法的例子：

    deamon.attack(deamon, target, strength)
    
也可简写为

    deamon:attack(target, strength)
    
即是说因为第一个参数也是数据表，所以将点换成冒号并省掉第一个参数。
 
## 使用数据表的for语句
 
    for 循环变量i, 循环变量v in ipairs(数据表t) do
      语句块
    end

i是整数键，v是值, 循环将逐次得到 `(i = 1, v = t[1]), (i = 2, v = t[2]), ……`
 
    for 循环变量k, 循环变量v in pairs(数据表t) do
      语句块
    end

k是键，v是值, 循环将逐次得到数据表中的每一个键-值对。
 
**绝对不要在for语句块中修改循环变量**。
 
## 常用函数
 
`assert(v [, message])` -- 用于调试，断言v一定为true，否则说明有逻辑错误，中断运行并显示message的内容。
 
`tostring(e)` -- 将e转换成字符串
 
`tonumber(e [, base]）`-- 将e转换成数值，如果指定base，则按指定的进制转换
 
`next(table [, index])` -- 取数据表中index的下一个索引键；如果省略index则返回第一个；如果index为最后一个则返回nil。
 
`error(message [, level])` -- 终止执行并给出错误信息
 
## 数据表函数
 
`table.sort(table [, comp])` -- 将数据表元素按值排序。如果指定comp比较函数，则使用comp函数进行比较。comp应有两个参数，当a<b时返回true。

`table.insert(table, [pos,] value)` -- 在table的pos索引位置插入value。
 
`table.remove(table [, pos])` -- 删除table中索引为pos的元素，省略pos时为最后一个元素。
 
`table.foreachi(table, f)` -- 对table中每一个值，调用f函数，参数为整数索引和元素值
 
`table.foreach(table, f)` -- 对table中每一个值，调用f函数，参数为键和值
 
数学库函数
 
    math.abs     math.acos    math.asin    math.atan    math.atan2
    math.ceil    math.cos     math.deg     math.exp     math.floor
    math.log     math.log10   math.max     math.min     math.mod
    math.pow     math.rad     math.sin     math.sqrt    math.tan
    math.frexp   math.ldexp   math.random  math.randomseed

## 类型

Lua是动态类型语言，不需要人为指明变量类型，脚本解释器会自动判断变量类型。
简单的说，给变量赋什么类型的值，变量就变成什么类型。

函数 `type(var)` 返回变量var的类型名。

**注意**：不同类型的变量用“==”比较总是为 `false`，`false == nil` 也是 `false`。
为避免不易查出的错误，不要比较不同类型的变量。

## 引用类型

数据表类型（table），函数类型（function），用户定义类型（userdata) 都是引用类型。
即他们是对内容的引用，多个引用类型的变量可以引用同一个内容。

例：

    local table1 = {1, 2, 3, 4}
       local table2 = table1             -- table1和table2都引用同一个数据表
       table2[2] = 99
       print(table1[2])                     -- table1[2] = 99

如果引用类型没有提供自己的==、~=运算符操作，则执行缺省的比较运算，即判断两引用是否指向同一内容；
注意不是比较内容是否一致。

例：

    {} == {}    -- 永远为false，因为创建了两个空数据表，它们不是同一个数据表。 

## 变量

Lua处理局部变量要比处理全局变量快几倍，所以尽量使用局部变量。
在所有函数外部即全局也可声明局部变量，差别是全局变量一直存在，
而声明在全局的局部变量只在该模块的生存期存在，并只能被声明它的模块访问。

使用全局变量有难以发现的错误，例：

    g_DeamonCount = 10
       ...
       g_DeamonCuont = 20    -- 拼写错误，o和u颠倒了，但不会被脚本解释器发现，
                -- 因为一个新的全局变量被创建了

Lua正在加入 `global` 关键字以解决此问题。

读取未赋值的变量也不会报错，所以最好声明变量时赋个缺省值。 

## 函数嵌套

函数既是可执行的命令，也是可使用的数据，所以函数满足变量的作用域规则，即只在声明它的块内存在，例：

    function foo()
         ...
       end
    do
         function foo()
           ...
         end
         foo()                   -- 调用do...end内的foo()
       end
       foo()               -- 调用全局的foo()

即 `function foo()..end` 等同于 `local foo = function()...end`

## 一些库函数

`dofile(文件名)` -- 执行指定文件中的脚本

`print(e1, e2, ...)` -- 显示变量或常量的值

`math.abs(v)` -- 取v的绝对值

`math.acos(v)`, `math.asin(v)` -- 反余弦，反正弦

`math.atan(y/x)`, `math.atan2(y, x)` -- 反正切，前者只适用于第一象限，后者可用于所有象限

`math.floor(v)` -- 取小于等于v的最大整数

`math.ceil(v)` -- 取大于等于v的最小整数

`math.cos(v)`, `math.sin(v)`, `math.tan(v)` -- 取余弦，正弦，正切

`math.deg(v)` -- 弧度变角度

`math, rad(v)` -- 角度变弧度

`math.exp(v)` -- 取e的v次幂

`math.log(v)` -- 取以e为底的对数（自然对数）

`math.log10(v)` -- 取以10为底的对数

`math.pow(x, y)` -- 即x的y次幂

`math.min(v1, v2, ...)`, `math.max(v1, v2, ...)` -- 取最小的，最大的

`math.mod(v1, v2)` -- 取v1 / v2的余数

`math.sqrt(v)` -- 取v的平方根

`math.random()` -- 取0到1的随机小数

`math.random(upper)` -- 取1到upper的随机整数

`math.random(lower, upper)` -- 取lower到upper的随机整数

`math.randomseed(seed)` -- 置随机数种子

## 写游戏脚本的注意事项

尽量使用本系列文档中提到的用法：Lua本身语法很松，用法很灵活，在看其它文档和样例时会有在此没有提到的语法内容，
这些语法内容不是必要的，但却容易导致错误或带来过大的复杂性。
例如用 `(test) and v1 or v2` 来模拟C语言的三元表达式，我们不推荐使用。
