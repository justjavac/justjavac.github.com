---
layout: post
title: 一张神奇的 gif 图，可以显示自己的 MD5 值
keywords: javascript,md5
category : javascript
tags : [javascript, md5]
---

这是一张神奇的 gif 图片，它可以显示自己的 MD5 值。

![md5.gif][1]

这张图片的 MD5 值是:

    f5ca4f935d44b85c431a8bf788c0eaca

原始图片地址：https://shells.aachen.ccc.de/~spq/md5.gif

## 相关链接：

 - [An animated GIF that shows its own MD5 Reddit：Animated][2]
 - [GIF displaying its own MD5 hash • r/programming][3]

文中讨论区也大致解释了图片的生成原理。

1979 年 Ralph Merkle 博士发表了关于单向函数构造抗碰撞的信息摘要论文 R.C. Merkle. [Secrecy, authentication, and public key systems][4].  （PS：后来博士转而去研究奈米科技以及人体冷冻技术）

![Merkle-Damgård construction](/assets/images/merkle-damgard-hash.png)

(图片来源维基百科：[Merkle-Damgård construction][5])

Merkle 就是 MDx 中的 M，另一 D 是丹麦人 Ivan Damgård。（伊万？？？）

在 13 年后的 1992 年，Ronald Rivest 发表了 MD5 算法，用于改进之前的 MD、M1、...、M4 算法。

通过再仔细观察上面的图就很容易发现，MDx 族算法是一种基于块的流式算法。

-----------------

我们回到这张神奇的 gif 图上，本质是一种碰撞攻击  [Herding Hash Functions and the Nostradamus Attack][6]。

 王小云的差分攻击算法虽然可以找到 MD5 的消息碰撞对，但是她找到的碰撞消息对是一组随机比特字符，碰撞消息对没有语义。而前缀构造碰撞算法可以构造出只有尾部不同的两个文件。

![前缀构造碰撞算法](/assets/images/3849225327-593406316a935.png)

（图片来源见水印）

如果我们找到一个碰撞，可以用两个不同的值然后给他们分别附加数据后可以计算出相同的值：

在原始的 MD5 碰撞基础上，计算两个消息 M1 和 M2，有 H(M1) = H(M2)，其中函数 H(x) 是计算哈希值函数。Stevens 扩展了该研究，并且找到了一种方法，使两个已知值 P1 和 P2 通过附加字节产生碰撞。

使用前缀 P1 和 P2，他能够证明如何找到 S1 和 S2，使得 H(P1 | S) = H(P2 | S2)。

而这张图使用了类似的方式，在评论中有人提到：

> 1. Generate a gif for each possible digit in the first column
> 2. Append collision blocks to each gif to make a 16 way collision
> 3. Repeat for each digit
> 4. Hash the final product
> 5. Replace each digit with the correct digit

如果想自己构造要给碰撞程序，可以参考这个链接：[Create your own MD5 collisions][7]。

--------------

欢迎关注我的公众号，关注前端文章：

![justjavac微信公众号](http://justjavac.com/assets/images/weixin-justjavac.jpg)

  [1]: /assets/images/md5.gif
  [2]: https://news.ycombinator.com/item?id=13823704
  [3]: https://www.reddit.com/r/programming/comments/5y03g9/animated_gif_displaying_its_own_md5_hash/
  [4]: http://www.merkle.com/papers/Thesis1979.pdf
  [5]: https://en.wikipedia.org/wiki/Merkle%E2%80%93Damg%C3%A5rd_construction#/media/File:Merkle-Damgard_hash_big.svg
  [6]: https://eprint.iacr.org/2005/281.pdf
  [7]: https://natmchugh.blogspot.cz/2015/02/create-your-own-md5-collisions.html