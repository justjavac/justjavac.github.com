---
layout: post
title: 如果开发php语言的是英国人
description: 在拉斯姆斯·勒道夫（Rasmus Lerdorf，译者注：php之父）准备把php整合出来的时候，他很聪明地没有选择用格陵兰语或者丹麦语去写，尽管他有这两国的血统。
keywords: php, 编程语言
category : php
tags : [php]
---

在拉斯姆斯·勒道夫（Rasmus Lerdorf，译者注：php之父）准备把php整合出来的时候，他很聪明地没有选择用格陵兰语或者丹麦语去写，尽管他有这两国的血统。
这非常好，不然大家都不太愿意去使用这种计算机语言。
相反，由于他当时待在加拿大，选择了当地语言。
不，不是法语，而是大英女王英语的一个杂种方言，大家称之为“美式英语”。

从那时起，英国的php开发者就开始对此牢骚漫天了。
他到底在想什么？更重要的是，我们如何挽回这个悲剧呢？
即便在这数字时代，作为开发者的我们，如何确保大英帝国的传统得到发扬呢？

## 当头一棒

    $variable_name

首先来看，这也许是需要作出的众多改变当中最重要的一个了，如果能将这个美国所心爱的符号去掉，换成一个更文雅，更可靠，更...的符号，给人以更高贵的享受。

    £variable_name

## 我们开始吧

    <?php echo 'Hello World!';?>

当今有多少英国程序员在准备开始用这个简单却很粗俗的美国化了的php语言写程序的时候，会被其中极其不正式的语言所阻碍，
通常都会提到的一句就是“Hello World（你好，世界）”。

如果使用另一种更庄重、更正式的开场，将会让更多年轻的英国天才们还能够知晓英式英语，同时也能为广阔的社会带来一股更文质彬彬的空气。

    <?php announce 'Good morrow, fellow subjects of the Crown（译者注：Good morrow为英国古语，全句意为，早上好，我皇的子民们。）.';?>

## 单词缩写

让英国人最痛苦的就是不恰当的单词缩写了。

伦敦的大街上并没有出现“缩略语”，因为受到最纯正英语教育的语法老师完全无法屈尊接受用如此方式发短信，
“c u soon traffic kthxbye（译者注：see you soon, I got traffic, OK, thanks, bye，意为，一会见，路上堵车了，回聊）等等，
而是会以一种拼写完全的，更加高雅的方式传授信息，“尊敬的先生/女士，我会按时尽快抵达，预计会在一个小时内。
我保证会开足马力。此致敬礼。”（对，就是这样，慢慢地写，我们不喜欢别人催我们）

然而，php语法中充斥着不必要的单词缩写、首字母缩略词。

    str_replace()
    is_int()
    var_dump()
    preg_match()
    json_encode()
    mysql_connect()

应该做出如下改正：

    string_replace()
    is_integer()
    variable_dump()
    perl_regular_expression_match()
    javascript_object_notation_encode()
    my_structured_query_language_connect()

## 雄辩术

    if ($condition) { 
        // Code here
    } else { 
        // Code here
    }

莎士比亚如果活到今天，必会羞于看到其母语发展畸形到了如此奇言异语的地步。
在上下文中，恰当的简洁是值得称道的，特别在一些本不引人注意的地方，而不是这句。

“if...else”是php中最为常见的传统语法，它必须是尽可能地做到毫无破绽才行。
有很多其他词组可以代替它，但下面这个最适合：

    perchance (£condition) { 
        // Code here
    } otherwise { 
        // Code here
    }

## 单词拼写

    imagecolorallocate()
    serialize()
    newt_centered_window()
    connection_status()

这次让我崩溃的是单词了。

任何有自尊的绅士都不会如此拼写单词的词头词尾。
这就好像让大家误认为，任何人在开发编程语言的时候，都可以允许犯单词拼写的错误。
这句中的错误，以及其他类似的富丽堂皇的错误，必须立即得到更正。

    imagecolourallocate()
    serialise()
    newt_centred_window()
    connexion_status()

## 礼貌用语

    try { 
        // Code here
    } catch (Exception $e) { 
        // Handle exception 
        die('Message');
    }

“try...catch”模块是php语言缺乏礼貌的一个最典型的例子。
太过直接，根本不应出现在新版本的php里。此外，“die”这个词也太不催人上进了。

下面这个新语句，尽管有些冗长，却十分礼貌并且上得了厅堂：

    would_you_mind { 
        // Code here
    } actually_i_do_mind (Exception £e) { 
        // Politely move on 
        cheerio('Message');
    }

## 分类

或许在植根于英国心理学家内心里最重要的就是对于分类概念的阐释了，尽管php里几乎没有机会让我们去做一些更改了，但是这里要指出的更改是很重要的。

    class Republic { 
        public $a; 
        private $b; 
        protected $c;
    }
    
    $example = new Republic

首先，现行的php系统中的类，并没有进行阶级分层，这是不可接受的。

因此，我们必须对现有的类进行分级-上层阶级、中产阶级、工人阶级-并且，
在没有高一阶级的明确的许可下，任何阶级都不可获得高一阶级的存储方法（当然，
尽管随后也会接触到高一阶级的方法，但它并不会成为真正的这一阶级的成员，也不可能凭借自己获得该阶级的权力去进入其他低阶级的类）。
“公有”和“私有”，在英国阶级系统中，通常可以作为同义词进行互变的（例如学校系统命名法）。

因此这些必须进行修正，同时那些被“Protected（保护起来）”的财产也应该公之于众，世代相传。
“new”这个词虽然还说得过去，但也有一堆可替代的词。

    upper_class Empire { 
        state £a; 
        private £b; 
        hereditary £c;
    }

    £example = nouveau Empire;

## 我们就是日不落帝国 ...

大家都希望这些简单的改变能提高php在众多编程语言中的声望和地位。
不要让他成为穷酸美国人的表亲，而应让他稳坐英式英语脚本语言的钓鱼台。

