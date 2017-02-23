---
layout: post
title: React："don't fuck it up like Google did with Angular"
keywords: javascript,reactjs,Angular
category : javascript
tags : [javascript, reactjs]
---

React 核心开发人员 sebmarkbage 大神在 GitHub 开了个 [issues][1]，用来征询社区对 JSX 2.0 的建议。

![ReactJS VS AngularJS][2]

到底增加（改动）了什么呢？

- \#4 - 不对属性和文本中的 HTML 转义标识进行转义
- \#21 - 属性支持表达式
- \#23 - 传参时使用对象简写表示
- \#25, #51, #64 - 属性是单一符号或有小括号时，大括号可以省略

而且还包括了：

- \#39 - 隐式 do 表达式
- \#35 - Drop implicit text content and curlies as children.
- \#66 - 自定义属性命名空间

用过 React 的开发者都知道，React 的理念就是 All In Javascript，是彻彻底底的 javascript 中心论。

之前我们都是直接把 javascript 写在 HTML里面，后来又觉得这样不利于维护，也不符合编程领域中“低耦合”的理念，重新梳理前端：HTML 是数据，CSS 是表现，javascript 是行为。因此我们都是把 javascript 写在单独的文件，然后在 HTML 中引用。

但是 facebook 的工程师不仅不让我们在 HTML 中写 javascript，反而让我们在 javascript 总写 HTML。而且 facebook 的工程师并没有因此止步，他们在 React 文档中又告诉开发者，不仅仅要把 html 写到 javascript 中，css 也应该写到 javascript 中。

![黑人问号][3]

我个人比较喜欢 all in javascript。至于原因以后再写文章讨论，这个不是今天的重点。

下面进入今天的话题：

JSX 里面不能写条件语句，只能用 JS 的三目运算符，因为有人（@mohsen1）建议，为 JSX 增加类似 ng-if 的功能，或者直接使用Angular 2 的 *if 也行：

> Something like Angular ng-if would be nice to have in JSX. Making rendering of an element conditional is not easy in JSX. Maybe adopt Angular 2 *if

截至我写此文时，这个建议收到了 32 个赞同 和 324 个反对。（我也点了反对）

而对于此问题，@lacker 也提到了另一种解决方案，增加 if 标签，例如：

```
<if {myCondition}>
  <div>This part only gets shown if myCondition is true</div>
</if>
```

这种提议也不乐观，28 赞同，296 反对。（我也点了反对）

随后，@kevinsimper 回答了他们的问题，解决问题的方式不是 JSX 的标签，而是使用 javascript 的短路逻辑运算符，再一次体现了 React 的 JS 中心论：

```
{ somethingTrue &&
  <div>Will only show if somethingTrue is true</div>
}
```

@bjrmatos 的回复博得了众人的喝彩：

> @mohsen1 "It's just JavaScript, not a template language" -> no need to replicate JS functionalities with custom syntax. That is the main benefit of JSX IMO, seriously is so easy to do this with js even if it looks "weird" (for me it is not weird, it is just the syntax of the language)

简单翻译过来就是：JSX 只是 javascript 语法的扩展，而不是一种模板语言。无论怎么使用JSX 自定义语法，也不应该影响这种好处，即使最终实现看起来有一些怪异。（原文中提到的 IMO 是不是就是 In My Opinion 的意思？）

之后的讨论依然激烈并精彩，终于 @nkkollaw 回复到：

> Don't fuck it up like Google did with Angular 2, keep the thing compatible with older versions...

不要他妈的像 Google 升级 Angular 2 一样啊，能不能保持旧版本的兼容啊

@mstijak 在评论中又提出另一个属性绑定写法：

```
<input type="text" value:bind="firstName">
```

我的天哪！，好不容易 JSX 不像 Angular 了，突然又变成了 vue。

后面的讨论渐渐趋于平和，此时 @xpagesbeast 说到

```
JavaServer Faces (JSF) Expression language has stood the test of time, JSX is a very similar new kid on the block
```

我去！！你们讨论 Angular，讨论 Vue，讨论 jQuery 也就算了，这个 JSF 是什么鬼？！

原文太精彩了，感兴趣的可以去 github 上围观 [JSX 2.0 · Issue #65 · facebook/jsx][4]

  [1]: https://github.com/facebook/jsx/issues/65
  [2]: /assets/images/comparing-reactjs-vs-angularjs.jpg
  [3]: /assets/images/black-man-fxxk.jpg
  [4]: https://github.com/facebook/jsx/issues/65
