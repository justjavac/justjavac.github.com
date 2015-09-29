---
layout: post
title: Flarum 的故事：我为什么开发 Flarum
description: Flarum 的故事：我为什么开发 Flarum
keywords: php,Flarum,laravel
category : php
tags : [php, Flarum,laravel]
---

原文：[Read The Flarum Story: Why I'm Building Flarum](http://flarum.org/story/)  
译文：[Flarum 的故事：我为什么开发 Flarum](http://justjavac.com/php/2015/09/28/read-the-flarum-story-why-im-building-flarum.html)  
译者：[Flarum 中文开发者社区](http://discuss.flarum.org.cn)

--------------------

我叫 Toby Zerner，是一个 22 岁的澳大利亚人。去年我完成了第三年的医学院本科学业。

今年，我有了学业以外的休息时间，来从事我的一个爱好：**构建简洁的论坛软件**。

这个故事是关于我为什么要做这些，以及 Flarum 的未来。

## 论坛软件烂透了

在我的成长过程中，我的哥哥 Simon 教会了我编程（从某种意义上来说）。

西蒙非常聪明开朗。即使不谈技术层面，虽然当时我们都知道 [PHP4 面条式代码](http://en.wikipedia.org/wiki/Spaghetti_code)，然而 Simon 却能领悟到别人领悟不到的事：**简洁 Simplicity**。

论坛软件在当时非常的不简洁。即便是使用“设计”这个词形容这些论坛，都是奢侈的。他们真的算是很粗心的迭代的产物：为了满足一些需求，就要添加一个功能，但却带来了额外的复杂性。然而这个过程会重复上百次，软件就会复杂上百倍。你无法做一个简洁的论坛用户——你必须是一个**超能用户**，花费你宝贵的时间去适应——这简直就是场**战斗**——和这些凌乱的功能战斗，和这些不违和的界面战斗。

Simon 想退一步，以使论坛保持简洁。回归到最基本的对话。为什么我们就**不能**在网上与人简简单单的交谈吗？ 所以我们就构建了 [esoTalk](http://esotalk.org)。

我们研究了所有论坛中关于讨论列表的层次结构，并交换了各自的意见。我们摆脱了识别标志，而是实现了一个强大的 **gambit** 搜索系统(一个简化版的 [GitHub's search tokens](https://help.github.com/articles/searching-issues/))。我们使用短轮询，因此在论坛中所以人可以几乎实时对话。esoTalk 是有别于其他论坛的，人们对此很感兴趣。

esoTalk 视频：[esoTalk: a simple fast free web-forum](https://vimeo.com/2867330)

<iframe src="https://player.vimeo.com/video/2867330" width="100%" height="450" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

不幸的是，Simon 在 2009 年去世。世界失去了一位杰出的人。

这是一个悲伤的时刻，带着对他的回忆，我竭力地继续为完善 esoTalk 而工作。然而，我毕竟是一个年轻的开发人员，编写的代码不知不觉地[重新发明了轮子](http://esotalk.org/blog/future-of-esotalk.html)。当我开始关注生活中的其他领域时，发现 esoTalk 已经逐渐变得陈旧。

但我没有停止思考。

## 构建更好的东西

尽管 esoTalk 已经停滞，可人们仍然喜欢使用它。甚至有些人愿意[赞助它，希望它进一步发展](http://esotalk.org/forum/478-esotalk-update-xojo-forum)。通过所有的错误、教训、迭代、和反馈……我开始坚信：人们期待好的论坛软件，也许我有能力设计出来。

为了锻炼我的想象力，我开始嘲笑“esoTalk 2.0”。一些审美的想法最终随着 esoTalk 的新版本发布了。但这些设计也仅仅是头脑风暴的一部分——而这些想法，最终导致了 Flarum 的概念版。

2013 年，在朋友 [Stephen](http://www.nephets.com) 的帮助下，我带着 Flarum 的想法参加了我们学校的创业者竞赛。首先我们开始构建一个原型，并设想一个商业模式。其次，一些现金，还有很多鼓励性的问题：**我们可以做这个吗？**

也许不是。原来，在现实世界中新的论坛软件是很难的。我们在 Kickstarter 的竞选活动 [generated interest, but not traction](https://www.kickstarter.com/projects/1221714515/flarum-forums-reimagined/posts/1023315)。投资或孵化也许已经成为了一种选择，但是我既不想放弃学医，也不想放弃这个社区型项目的想法。

看来最好的办法是启动它。我还有一年的时间才能离开学校，并把它的构建过程开放。然后我可以市场化，构建一个小型的基于服务的业务。 开源第一，赚钱第二。

事实证明，你需要达到一定阶段后开源协作才变得可行。这比我希望的时间要长一点。但 8 个月后我们做到了: Flarum beta 发布了。我相信它实现了一个很强的愿景，而这个愿景，是从 Simon 和我一起发布 esoTalk 第一版时就一直梦想的，如今它实现了。Flarum 的目标是:

- **快速、简单** 没有混乱，没有膨胀，没有复杂的依赖关系。Flarum 使用 PHP 构建，因此它很容易部署。界面使用 Mithril，它是一个高性能 JavaScript 框架。

- **漂亮、响应式** Flarum 由我们的设计师精心设计，它是跨平台的、开箱即用的。界面布局使用了 LESS，所以主题风格只是小事一桩。

- **强大、可扩展** 为了满足您的社区需求，您可以定制、扩展和集成 Flarum。Flarum 的架构非常灵活，它拥有非常全面的 API 和[文档](https://justjavac.gitbooks.io/flarum/content/)。

- **自由、开放** Flarum 基于 [MIT license](https://github.com/flarum/flarum/blob/master/LICENSE) 发布。

## 让 Flarum 更稳定

没有任何庆功会，因为还有很多工作要做!

我从 esoTalk 学到了一件事：如果一个软件没有建立良好的基于扩展的生态系统，那么这个软件必将失败。我不打算 Flarum 犯同样的错误。我的计划是**扩展市场**，任何人都可以购买和出售扩展——配有简单的安装和更新。然而，只有 Flarum 发布了稳定版，这一切才会有可能。

与此同时，我真的不知道自己该做什么了，而 Flarum 无疑是这一事实的化身。我做了大量的开发，从 Franz Liedke 获得了一些帮助。**getting it done**的精神，导致我迄今为止都忽视了[编写测试](](https://github.com/flarum/core/issues/245))和[审计性能](https://github.com/flarum/core/issues/127)。 没有团队的反馈，我创造了一些低质量的代码和 API，而这些都需要修订。

如今我的重点变成了：**Flarum 需要你们的帮助!**

beta 版的目标是让开发人员可以从代码库中得到完整代码。现在，已经激发了很多潜在的贡献者，我们写了许多 GitHub issues 的详细描述。它们包含一些忠告，需要做什么和在哪里查看。[看看有哪些是你想要做的!](https://github.com/flarum/core/issues)

特别是，我们想要一个关于扩展 API 的深入讨论。你可以阅读[初版文档](https://justjavac.gitbooks.io/flarum/content/extend/index.html)来学习扩展是如何工作的。这里有一个在 [GitHub 的问题反馈](https://github.com/flarum/core/issues/246)。

如果你不是一名开发人员，可以考虑[捐赠](http://flarum.org/donate)。所有捐款将用于支付服务器费用和支付专用的开发时间。(如果你有兴趣为开源项目做一些有偿工作：告诉我们你能做什么贡献！)

在接下来的几个月里，让我们慢慢地工作，以便 Flarum 顺利走向[稳定版](https://github.com/justjavac/flarum/issues/3)。

## 鸣谢

在此次叙述中我谈到了很多关于自己的事。但是到目前为止我们取得的所有成就，不可能没有别人的帮助。

**Franz Liedke** 是 [FluxBB](http://fluxbb.org) 的开发者，在今年早些时候加入了我的团队。他分享我的激情，超过我的才华，并一直工作至今。谢谢你！

感谢那些热情地跟随我一起开发的人，特别是 **Berlo**、**Dominion** 和 **Stephen**。你们让我有动力，通过你们的测试和反馈，Flarum 有了明显的改善。

**Matthew McKinlay** 是我在创业竞赛的导师，也已经成为了我的好朋友。他让我有了宝贵的建议并验证这些想法(*Just Do It™*)。 谢谢 Matt。

**我的父母和兄弟姐妹** 支持我追求我的梦想。为此我非常感激。我有一个相当 cool 的家庭。

最后，我的哥哥，**Simon**，他把种子种了下去，直到他生命的最后一天。Flarum 是献给你的，我希望我已经让你感到骄傲。

最后一段，我保留一下原文：

> Finally, my brother, **Simon**, who planted the seed and watered it right up until his last day. Flarum is dedicated to you; I hope I have made you proud.
