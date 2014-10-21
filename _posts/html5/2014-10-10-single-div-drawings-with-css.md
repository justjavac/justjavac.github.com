---
layout: post
title: 基于单个 div 的 CSS 绘图
description: 基于单个 div 的 CSS 绘图
keywords: html5,div, css3
category : html5
tags : [div, html5, css3]
---

原文： [Single Div Drawings with CSS][26]

译文： [基于单个 div 的 CSS 绘图](http://zhuanlan.zhihu.com/FrontendMagazine/19854868)

译者： 前端外刊评论

---------------------

> 译注：通读本文，强烈地感受到了技术与艺术的结合！赞作者的这句话：Restricting your available options forces you to re-evaluate the tools you already have. 
限制你的可选项，会让你重新评估手头上已有的工具。

## 为什么只使用一个 Div？

2013年5月，我参加了 CSSConf，看到了[Lea Verou 关于 border-radius 的演讲][1]，你可能会认为这个属性很不起眼。但是这个演讲让我大开眼界，认识到 CSS 还有很多行为我是不了解的。回忆起我还是艺术生的那段时光，不断地推动着我成为所选媒介的专家。作为一个 Web 设计师，CSS 是我的媒介，因此我尽我所能地学习，探索它的极限。

### 为什么只有一个 Div？

回忆我以前学画的时候，课堂上还做了混合颜色的实验，我们就使用三原色，红、黄、蓝，创造出了其他颜色的光谱。这个实验的目的是让我们了解颜色的特性，同时这种限制也让我们明白了混合的力量。你当然可以买一只绿色的笔，但是你也可以使用蓝色和黄色把绿色做出来。限制你的可选项，会让你重新评估手头上已有的工具。

我决定开始一个使用 [CSS 绘画的项目][2]，过段时间我就会给出一个只用 CSS 绘制的新东西。为了得到更大的挑战，探索 CSS 的潜力，我给自己定了这个限制，只是用一个 Div。不能直接买一只绿色的笔（添加更多的 Div），我要做的就是尽其所能地结合 CSS 属性来实现我的目的。

## 工具箱

一个 Div 加上浏览器支持的那些 CSS 属性，看起来可用的工具太少了。但是我发现问题不在于你在使用多少东西，而在于你如何看待你在使用的东西。

### 伪元素

因为 CSS 有伪类，所以虽然只有一个 Div，但实际上我可以使用三个元素。因此，使用 `div`，`div:before`，`div:after`，我们可以这样：

![伪元素][3]

{% highlight css %}
    div { background: red; }
    div:before { background: yellow; }
    div:after { background: blue; }
{% endhighlight %}

容易想到，这三个元素可以并排成为三个叠在一起的层。因此，在我的脑海中，它看起来是下面这样的：

![][4]

### 形状

使用 CSS 和单个元素，我们可以制作三种基础图形。使用 `width` 和 `height` 属性制作正方形/矩形，使用 `border-radius` 制作圆/椭圆，使用 `border` 制作三角形/梯形。

![形状][5]

我们还可以使用 CSS 创建其他图形，不过大部分都可以简单组合这些基础图形来实现，这些简单的图形最容易制作，也最容易修改。

### 多个相同的形状

使用叠加的 `box-shadow`，我们可以创建多个相同的形状，这些形状可以拥有不一样的大小、颜色和模糊效果。我们可以在x或者y轴上移动这些图形，因此几乎可以绘制无限的图形。

![多个相同的形状][6]

```css
    div {
        box-shadow: 170px 0 10px yellow,
                    330px 0 0 -20px blue,
                    330px 5px 5px -20px black;
    }
```

我们甚至可以给 `box-shadow` 添加 `box-shadow`。注意它们申明顺序。再者，把它们当做层更容易理解。

### 渐变

渐变通过给定一个光源，可以被用来制造明暗和深浅效果，可以让简单扁平的图形看起来更真实。结合多个 `background-image`，我们可以使用很多层的渐变来实现更加复杂光影，甚至是更多的图形。

![渐变][7]

    div {
        background-image: linear-gradient(to right, gray, white, gray, black);
    }
    
    div:after {
        background-image: radial-gradient(circle, yellow 50%, transparent 50%), linear-gradient(to right, blue, red); 
    }

## 视觉

最困难的部分视觉，即如何拼凑这些形状成为可被感知的绘图。随着我越来越注重绘图的技巧，发现视觉这一步很重要。为了做到这一点，我常常凝视这主题相关的图片，将其切割为多个可视的部分。都是一个个形状，都是一个个颜色。我把整张图片简化为一些小的带颜色形状或者区块，我知道（大体上）如何使用 CSS 来实现它们。

## 实例

我们一起仔细看看两个绘图，并学习如何分解成不同的区块，合成一个大的图形。第一个就是一支绿色的蜡笔。

蜡笔由两个基础图形构成：矩形的笔身和三角形的笔尖。

![蜡笔由两个基础图形构成：矩形的笔身和三角形的笔尖][8]

我必须实现下面这些点来捕获真实蜡笔的感觉：

- 纸质包装上不同的颜色
- 印刷在包装上的形状和文字
- 条纹暗示蜡笔是圆的
- 明暗效果，暗示圆形的蜡笔和光源

首先，我使用 `div` 和 `background` 颜色制作蜡笔的身体部分，从顶部到底部渐变，并使用 `box-shadow` 暗示立体感：

![][9]

    div {
        background: #237449;
        background-image: linear-gradient(to bottom,
                                      transparent 62%,
                                      black(.3) 100%);
        box-shadow: 2px 2px 3px black(.3);
    }

然后，我使用一个从左到右的 `linear-gradient` 制作纸包装。`alpha` 值为 `.6`，这样的之前的渐变可以透出来。

![][10]

    div {
        background-image: linear-gradient(to right,
                                      transparent 12px,
                                      rgba(41,237,133,.6) 12px,
                                      rgba(41,237,133,.6) 235px,
                                      transparent 235px);
    }

接下来，我继续使用同样的方式，从左到右渐变，制作蜡笔上的条纹。

![][11]

    div {
        background-image: linear-gradient(to right,
                                      transparent 25px,
                                      black(.6) 25px,
                                      black(.6) 30px,
                                      transparent 30px,
                                      transparent 35px,
                                      black(.6) 35px,
                                      black(.6) 40px,
                                      transparent 40px,
                                      transparent 210px,
                                      black(.6) 210px,
                                      black(.6) 215px,
                                      transparent 215px,
                                      transparent 220px,
                                      black(.6) 220px,
                                      black(.6) 225px,
                                      transparent 225px);
    }

纸包装上印刷的椭圆，使用一个 `radial-gradient` 轻松搞定！

![][12]

    div {
        background-image: radial-gradient(ellipse at top,
                                      black(.6) 50px,
                                      transparent 54px);
    }

我刚才单独展示了各个部分，不过别忘了 `background-image` 看起来是这样的：

    div {
                          // ellipse printed on wrapper
        background-image: radial-gradient(ellipse at top,
                                      black(.6) 50px,
                                      transparent 54px),
                          // printed stripes
                          linear-gradient(to right,
                                      transparent 25px,
                                      black(.6) 25px,
                                      black(.6) 30px,
                                      transparent 30px,
                                      transparent 35px,
                                      black(.6) 35px,
                                      black(.6) 40px,
                                      transparent 40px,
                                      transparent 210px,
                                      black(.6) 210px,
                                      black(.6) 215px,
                                      transparent 215px,
                                      transparent 220px,
                                      black(.6) 220px,
                                      black(.6) 225px,
                                      transparent 225px),
                          // wrapper
                          linear-gradient(to right,
                                      transparent 12px,
                                      rgba(41,237,133,.6) 12px,
                                      rgba(41,237,133,.6) 235px,
                                      transparent 235px),
                          // crayon body shading
                          linear-gradient(to bottom,
                                      transparent 62%,
                                      black(.3) 100%)
    }

完成了 `div`，我们把注意力转移到 `:before` 伪类元素上，创建蜡笔的笔头。使用实心和透明的边框，我制作了一个三角形，把它和我之前绘制的 `div` 放到一起。

![][13]

    div:before {
        height: 10px;
        border-right: 48px solid #237449;
        border-bottom: 13px solid transparent;
        border-top: 13px solid transparent;
    }

比起蜡笔笔杆，笔头看起来有点平，我们可以使用 `:after` 伪类元素来修复这个问题。我添加一个从顶部到底部的 `linear-gradient`，制作了一个反光效果，贯穿整只蜡笔。

![][14]

    div:after {
        background-image: linear-gradient(to bottom,
                                        white(0) 12px,
                                        white(.2) 17px,
                                        white(.2) 19px,
                                        white(0) 24px);
    }

这给那个扁平的三角形添加更多的层次感，更加真实。制作接近尾声，我给 `:after` 添加一些文字，定位，使得看起来像是印刷在蜡笔包装上的一样。

![][15]

    div:after {
        content: 'green';
        font-family: Arial, sans-serif;
        font-size: 12px;
        font-weight: bold;
        color: black(.3);
        text-align: right;
        padding-right: 47px;
        padding-top: 17px;
    }

大功告成！

## 另外一个实例

蜡笔作为一个不错的例子，很好地展示了如何使用 `background-image` 和 `gradient` 来产生真实的效果。下面这个例子将展示多个 `box-shadow` 的强大之处：单 `div` 的照相机。

这是照相机的主体部分，使用 `background-image` 和 `border-image` 制作的。

![][16]

下面是一张 gif，展示 `:before` 伪类元素（黑色的那个矩形），以及使用它的 `box-shadow` 创建出来的很多照相机的细节部分。

![][17]

    div:before {
        background: #333;
        box-shadow: 0 0 0 2px #eee,
                    -1px -1px 1px 3px #333,
                    -95px 6px 0 0 #ccc,
                    30px 3px 0 12px #ccc,
                    -18px 37px 0 46px #ccc,
     
                    -96px -6px 0 -6px #555,
                    -96px -9px 0 -6px #ddd,
     
                    -155px -10px 1px 3px #888,
                    -165px -10px 1px 3px #999,
                    -170px -10px 1px 3px #666,
                    -162px -8px 0 5px #555,
     
                    85px -4px 1px -3px #ccc,
                    79px -4px 1px -3px #888,
                    82px 1px 0 -4px #555;
    }

类似的，下面是 `:after`（灰色的圆）以及使用它的 `box-shadow` 制作的几个细节部分。

![][18]

    div:after {
        background: linear-gradient(45deg, #ccc 40%, #ddd 100%);
        border-radius: 50%;
        box-shadow: 0 3px 2px #999,
                    1px -2px 0 white,
                    -1px -3px 2px #555,
                    0 0 0 15px #c2c2c2,
                    0 -2px 0 15px white,
                    -2px -5px 1px 17px #666,
                    0 10px 10px 15px black(.3),
     
                    -90px -51px 1px -43px #aaa,
                    -90px -50px 1px -40px #888,
                    -90px -51px 0 -34px #ccc,
                    -90px -50px 0 -30px #aaa,
                    -90px -48px 1px -28px black(.2),
     
                    -124px -73px 1px -48px #eee,
                    -125px -72px 0 -46px #666,
                    -85px -73px 1px -48px #eee,
                    -86px -72px 0 -46px #666,
                    42px -82px 1px -48px #eee,
                    41px -81px 0 -46px #777,
                    67px -73px 1px -48px #eee,
                    66px -72px 0 -46px #666,
     
                    -46px -86px 1px -45px #444,
                    -44px -87px 0 -38px #333,
                    -44px -86px 0 -37px #ccc,
                    -44px -85px 0 -34px #999,
     
                    14px -89px 1px -48px #eee,
                    12px -84px 1px -48px #999,
                    23px -85px 0 -47px #444,
                    23px -87px 0 -46px #888;
    }

有点疯狂？不过你看到了吧， 多个 `box-shadow` 确实可以给使用单个 `div` 绘图添加很多细节部分。

## 最大的挑战

我碰到了两个最大的挑战，三角形的限制和 `gradient` 独特的行为。

## 三角形的问题

因为三角形是使用 `border` 创建的，这极大地限制了我对它的利用。使用 `border-image` 给 `border` 添加 `gradient`，不能单独添加其中一边。无法给 `border` 创建出来的三角形添加 `box-shadow`，因为 `box-shadow` 是添加在盒模型上的。因此要创建多个三角形就会很困难。看起来就是下面这样：

![][19]

    div {
        border-left: 80px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 80px solid red;
    }
     
    div:before {
        border-left: 80px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 80px solid red;
        border-image: linear-gradient(to right, red, blue);
    }
     
    div:after {
        border-left: 80px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 80px solid red;
        box-shadow: 5px 5px 5px gray;
    }

### 多层渐变

渐变的行为就是会填满整个 `background`。在堆叠多个 `gradient` 的时候就显得很讲技巧。需要花费额外的时间思考透明度、`z-index`这些事，还要搞清楚什么要可见，什么不要。不过若能有效地使用 `gradien`t，我们的绘图可以包含很多令人惊叹的细节。

Tardis 就是一个很好的例子，显示或隐藏渐变，创建了一张细节极强的图片。下图显示的是绘制的中间过程，可以看到数个从顶部到底部的渐变，宽度填满整个容器。

![][20]

使用从左到右和从右到左的 `gradient`，我可以遮住一部分渐变，同时把其他部分渐变显示出来。

![][21]

最终的结果看上去包含了很多图形来构成 Tardis 的前面，但实际上它就是层叠的 `linear-gradient`。很多时候不得不伪造呀。

## 动态地查看它们

源于这个项目，有一个非常酷非常有用的好东西突然出现，那就是 Rafael Carício（[@rafaelcaricio][22]） 开发的名为 [CSS Gradient Inspector][23] 的 Chrome 浏览器插件。这个开发工具可以探测且可以开关元素上的每一个 gradient，看起来就像开关一个个层。（它在日常项目中也非常有用。）

我希望设计师和开发者使用动画或者 JavaScript 的功能来做类似的尝试，或者对这些绘画做一些变形。你可以到 [http://div.justjavac.com][24] 或者 [GitHub][25] 上把玩一下这些 CSS。



  [1]: http://2013.cssconf.com/talk-verou.html
  [2]: http://div.justjavac.com
  [3]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-1.png
  [4]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-2.png
  [5]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-3.png
  [6]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-4.png
  [7]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-5.png
  [8]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-6.png
  [9]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-7.png
  [10]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-8.png
  [11]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-9.png
  [12]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-10.png
  [13]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-11.png
  [14]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-12.png
  [15]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-13.png
  [16]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-14.png
  [17]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-15.gif
  [18]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-16.gif
  [19]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-17.png
  [20]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-18.png
  [21]: https://hacks.mozilla.org/wp-content/uploads/2014/09/asinglediv-19.png
  [22]: https://twitter.com/rafaelcaricio
  [23]: https://chrome.google.com/webstore/detail/css-gradient-inspector/blklpjonlhpakchaahdnkcjkfmccmdik
  [24]: http://div.justjavac.com
  [25]: https://github.com/justjavac/a-single-div
  [26]: https://hacks.mozilla.org/2014/09/single-div-drawings-with-css/
  
  
