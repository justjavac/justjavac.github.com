---
layout: post
title: 前端开发，从菜鸟到大牛的取经之路
keywords: web, 前端
category : web
tags : [web, 前端]
type: porter
---

文章来源知乎

原文链接：<https://www.zhihu.com/question/19809484/answer/13215239>

原文作者：[李路](https://www.zhihu.com/people/li-lu-69)

--------------

以我的经验，大部分技术，熟读下列四类书籍即可。 

1. 入门，用**浅显**的语言和方式讲述**正确**的道理和方法，如head first系列
2. 全面，**巨细无遗**地探讨每个细节，遇到疑难问题时往往可以在这里得到理论解答，如Definitive Guide/Programming xx系列
3. 实践，结合实际中经常遇到的情景环境，来描述如何**设计和解决问题**，如cookbook系列
4. 深入，讲解一些文化，思路，甚至于哲学上的东西，真正做到**深入一种语言去编程**，如unix编程艺术，程序员修炼之道等等

那么，目前为止我认为最好的书是： 

## css： 

1. 入门： [Head First HTML and CSS, XHTML][1] （中文版，第二版）这本2005年底的书依然是最易懂，清晰和正确的入门读物，去看看amazon排名就知道了
2. 全面： CSS, The Definitive Guide (3th Edition) （《[CSS权威指南(第3版)][2]》）Meyer可能是css领域最权威和知名的作者，他在这本书里讲解了每个细节的实现和原理，更详细的东西恐怕只能从w3c那几乎不可读的文档中去寻找了
3. 实践：CSS Mastery (2th Edition) （《[精通CSS:高级Web标准解决方案(第2版)][3]》）Andy budd恐怕是英国最出色的css作者，这本书用简单直接的方式论述了很多实践中组件的正确实现以及可替代方法，包括css3
4. 深入：很遗憾，css在这方面还没有一本必读著作，也可能并不需要，因为到了这个程度，多是用户体验和视觉设计了，目前最接近的是 Transcending CSS （《[超越CSS:Web设计艺术精髓(修订版)][4] 》）, 但不断的技术进化使得书中某些部分感觉有些落伍。

关于css3, 她是一个模块化的渐进式增强，且以2.1为基础，因此，请学好css2再学习css3，这方面我认为只需要一本实践书即可，告诉你css3能做到什么，毕竟，原理是共通的。 

The Book of CSS3 推荐这本，一个技术人员写的组织清晰的css3模块描述和实践指南，还包括浏览器的实现情况，2011年5月出版，是目前为止最好的。 

## javascript: 

1. 入门：Eloquent Javascript 一位hacker写的编程入门，书中向hacker，open source, free software的欣赏和痴迷比比皆是， 比如官网下边那个向emacs致敬的console。作者很聪明，这本书的目标读者，beginners, 是不会因为这些小细节而向他叫好的。他想要的，只是把在其中浸淫多年的，真正意义上的编程精神，传达给初学者们而已。 少见地打败了对应的HeadFirst系列（Headfirst Javascript)
2. 全面：Javascript, The Definitive Guide(6th edition) （《[JavaScript权威指南(第6版)][5]》）伴随我们web开发者成长的一本javascript圣经，一直以来都是无可争议的最好与最全面的js书籍，2011年出版了最新版。
3. 实践：在目前的web开发环境中，我们都是在使用各种js框架，很少自己写框架来开发，因此这本书的位置，应该留给你所使用的框架。如果是jquery，我推荐 Jquery: Novice to Ninja （《[JQUERY从菜鸟到忍者(第2版)][6] 》）这本，框架方面的书，经常一本入门的就够了，因为更新实在太快，之后的研究学习只能全靠网络了。
4. 深入：与css不同，js是一种真正的编程语言，所以对他的深入研究是一个长期的过程，css的深入更偏向技艺/工匠，而js更偏向设计/架构/艺术，我推荐以下几本从不同方面深入js的书，他们都是业界最顶级的js开发团队（yahoo）的成员和同事，因此思路是很统一的，著名的高性能网站建设指南1和2都出自这个团队。

* Javascipt, The Good Parts （《[JavaScript语言精粹(修订版)][7] 》）由JSON的发明者撰写
* Javascript Patterns （《[JavaScript模式][8]》）YSlow的合作开发者撰写
* High Performance Javascript 最好的zakas的书，虽然我不太喜欢他

附上一些即将出版，我非常想看的书，有先睹为快的朋友可以分享一下心得: 

* Secrets of Javascript Ninja （好像没有中文版）Jquery作者John Resig最新著作
* Node: Up and Running 认识一下流行的no-block js server
* Javascript Web Applications （《[基于MVC的JavaScript Web富应用开发][9]》）这本号称是对当下js landscape的总结


  [1]: http://www.amazon.cn/gp/product/B00FF3P8FY/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00FF3P8FY&linkCode=as2&tag=cfjh-23
  [2]: http://www.amazon.cn/gp/product/B0011F5SIC/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0011F5SIC&linkCode=as2&tag=cfjh-23
  [3]: http://www.amazon.cn/gp/product/B003IURKAM/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B003IURKAM&linkCode=as2&tag=cfjh-23
  [4]: http://www.amazon.cn/gp/product/B008O70OKC/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B008O70OKC&linkCode=as2&tag=cfjh-23
  [5]: http://www.amazon.cn/gp/product/B007VISQ1Y/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B007VISQ1Y&linkCode=as2&tag=cfjh-23
  [6]: http://www.amazon.cn/gp/product/B00EVO8PCG/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B00EVO8PCG&linkCode=as2&tag=cfjh-23
  [7]: http://www.amazon.cn/gp/product/B0097CON2S/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0097CON2S&linkCode=as2&tag=cfjh-23
  [8]: http://www.amazon.cn/gp/product/B008QTG1HS/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B008QTG1HS&linkCode=as2&tag=cfjh-23
  [9]: http://www.amazon.cn/gp/product/B0082226FU/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&creativeASIN=B0082226FU&linkCode=as2&tag=cfjh-23
