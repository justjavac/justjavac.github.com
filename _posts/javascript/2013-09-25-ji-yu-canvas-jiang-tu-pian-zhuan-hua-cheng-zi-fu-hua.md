---
layout: post
title: 基于 canvas 将图片转化成字符画
keywords: javascript, canvas
category : javascript
tags : [javascript, canvas]
---

![img2txt](/assets/images/img2txt.jpg "img2txt")

字符画大家一定非常熟悉了，那么如何把一张现有的图片转成字符画呢？
HTML5 让这个可能变成了现实，通过 canvas，可以很轻松实现这个功能。

其实原理很简单：扫描图片相应位置的像素点，再计算出其灰度值，根据灰度值的大小，分别用字符 `#*+“` 和空格来填充。

下面是源码：

HTML：一个 `canvas` 元素 `#cv`，一个字符画容器 `#txt`。

```html
<canvas id="cv">fuck ie</canvas>
<div id="txt"></div>
```

css：由于每一行用 `p` 来填充，所以 `p` 的 `height` 和 `font-size` 大小应该一致都是 `12px`，这样可以避免每行出现空隙。

```css
* {margin: 0;padding: 0;}
body {font-size: 12px; margin: 10px; font-family: simsun; background: #fff;}
p { height: 12px;}
p.ts { margin: 10px 0 0 0; width: 500px; float: left;}
span {width: 12px;}
#cv, #txt {float: left;}
#cv { margin-right: 5px;}
```

javascript：请看注释和下面的解释。

```html
<script src="https://gist.github.com/justjavac/6696499.js"></script>
```javascript

**如何取到相应像素点的灰度？**

`getImageData` 方法返回一个对象，每个像素点的 `rgba` 值都保存在其 `data` 属性下面，这是一个一位数组，
也就是说，`rgba` 分别对应一个值，然后接着就是一下像素点的 `rgba`，假设 `getImageData.data` 的值为 `[1,2,3,4,5,6,7,8]`，
那么 `getImageData` 对象范围就包含了 2 个像素点，第一个像素点的 `rgba` 值分别是 `1,2,3,4`，第二个像素点的就是 `4,5,6,7,8`。
因此，我们在取每个像素点的 `rgba` 值的时候其 `index` 应该在像素点的索引值上乘以 `4`，然后通过 `getGray()` 计算灰度。

**如何对应到字符？**

再考虑一下每个字符串的宽度是 `6px`，高度是 `12px`，所以我们不可能每个像素点都要对应一个字符，那样生成的图案将非常之大。
我们只能根据图片宽高，来定义一个间隔，横向间隔 `6px`，纵向间隔 `12px` 取一次像素，这样可以保证生成的字符画大小和原图保持一致。

最后请看 demo： <http://justjavac.com/img2txt/>

原文链接： <http://www.cssha.com/img2txt-canvas>

