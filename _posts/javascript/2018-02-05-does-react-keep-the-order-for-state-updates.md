---
layout: post
title: React 是否保持 state 更新的顺序？
description: React 的状态更新是异步执行的，是批量更新的。所以你永远不能确信在调用 setState 后状态是否更新了
keywords: javascript,React
category : javascript
tags : [javascript, React]
---

stackoverflow 有人提问：[Does React keep the order for state updates?
](https://stackoverflow.com/q/48563650/343194)

我知道 React 的状态更新是**异步执行**的，为了性能优化，状态是批量更新的。所以你永远不能确信在调用 `setState` 后状态是否更新了。但是你是否可以确认 **`setState` 调用后状态的更新顺序**呢？

比如以下情况：

- 相同的组件？
- 不同的组件？

考虑以下按钮点击的例子：

1. 是否有可能 **`a` 是 `false`，`b` 是 `true`**?

```js
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { a: false, b: false };
  }

  render() {
    return <Button onClick={this.handleClick}/>
  }

  handleClick = () => {
    this.setState({ a: true });
    this.setState({ b: true });
  }
}
```

2. 是否有可能 **`a` 是 `false`，`b` 是 `true`**?

```js
class SuperContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { a: false };
  }

  render() {
    return <Container setParentState={this.setState.bind(this)}/>
  }
}

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { b: false };
  }

  render() {
    return <Button onClick={this.handleClick}/>
  }

  handleClick = () => {
    this.props.setParentState({ a: true });
    this.setState({ b: true });
  }
}
```

请记住，这是我对用例的极端简化。我知道我可以改善我的代码，例如，在例 1 中同时更新两个 state 值，以及在例 2 中的第一个 `setState` 的回调中执行第二个 `setState`。但是，这不是我的问题，而且我只想知道 React 执行这些状态更新时有没有确切的方式和顺序，仅此而已。

---------

不久后，React 的作者 Dan Abramov 亲自来回答了。

> I work on React.

开场定乾坤。很有力度的一句话。

> TLDR:

很多英文文章中都会出现 TLDR，有时候会写成 tl_dr、tl;dr，是 Too Long; Didn't Read 的缩写，作用就是告诉读者，这篇内容篇幅比较长，如果不想深入探讨或时间有限，可以看总结。

Dan Abramov 先给出了结论：

- 同一个组件中，`setState` 是否有确定的顺序？**是的**。
- 不同组件中，`setState` 是否有确定的顺序？**是的**。

--------

状态始终是按照特定的顺序更新的。无论你是否看到介于两个状态之间的一个中间状态，无论你是否在批处理内。

目前（React 16 及更早版本），默认情况下，只有 React 事件处理程序中的更新才会被批处理。有一个不稳定（unstable）的 API 来强制在事件处理程序之外进行批处理，以便在需要时处理罕见的情况。

在未来的版本（可能是 React 17 或更高版本）中，React 将默认批量更新所有更新，因此你不必考虑这一点。与往常一样，我们将在 [React 博客](https://reactjs.org/blog/)和 release note 中宣布对此的任何更改。

-------------------

理解这一点的关键在于，**在 React 事件处理程序中，不论 `setState()` 调用了多少次，也不论 `setState()` 
 被多少个组件调用，它们在事件结束时只会生成一次重新渲染**。这对于大型应用程序性能至关重要，因为如果 `Child` 与 `Parent` 处理 click 事件的时候都调用 `setState()`，你不希望重新渲染 `Child` 两次。

在这两个例子中，`setState()` 调用都发生在 `React` 事件处理程序中。因此，在事件结束时，他们总是被合并到一起（而且你看不到中间状态）。

更新总是**按照它们发生的顺序进行浅合并（shallowly merge）**。所以如果第一次更新是 `{a: 10}`，第二次是 `{b: 20}`，第三次 `{a: 30}`，呈现的状态将是 `{a: 30, b: **20}`。对 `state` 中同一个 key 的更新（例如我的例子中 `a` 的更新），最新(近)的更新总是“胜出”。**

当我们在批处理结束时重新呈现 UI 时，`this.state` 对象已经被更新了。所以如果你需要根据之前的状态更新状态（比如增加一个计数器），你应该使用 `setState(fn)` 的回掉函数版本来提供之前的状态，而不是读取状态 `this.state`。如果你对这个理由感到好奇，我在[这个评论](https://github.com/facebook/react/issues/11527#issuecomment-360199710)中深入地解释了它。

-------

在你的例子中，我们不会看到“中间状态”，因为我们在具有批处理功能的 **React 事件处理程序**中（因为 React “知道”什么时候退出该事件）。

但是，在 React 16 和更早版本中，**React 事件处理程序之外还没有默认的批处理**。因此，如果在你的例子中，我们吧 `handleClick` 替换为 AJAX 处理程序，那么每个 `setState()` 都会立即处理。在这种情况下，是的，你**会**看到一个中间状态：

```js
promise.then(() => {
  // 我们不在事件处理程序中，因此它们都会被刷新。
  this.setState({a: true}); // 使用 {a: true, b: false } 重新渲染
  this.setState({b: true}); // 使用 {a: true, b: true } 重新渲染
  this.props.setParentState(); // 重新渲染父组件
});
```

我们认识到，根据**是否处于事件处理程序中，行为是不同的**，这是不方便的。这将在未来的 React 版本中进行更改，默认情况下将批量更新所有更新（并提供选择性 API 以同步刷新更改）。直到我们切换默认行为（可能在 React 17 中），有一个 API 可以用来强制批量处理：

```js
promise.then(() => {
  // 强制批量处理
  ReactDOM.unstable_batchedUpdates(() => {
    this.setState({a: true}); // 不重新渲染
    this.setState({b: true}); // 不重新渲染
    this.props.setParentState(); // 不重新渲染
  });
  // 当我们退出 unstable_batchedUpdates函数后，重新渲染一次
});
```

在 React 内部，事件处理程序都被包装在 `unstable_batchedUpdates` 内，这就是默认情况下批处理的原因。请注意，将 `setState` 封装 `unstable_batchedUpdates` 两次是不起作用的。当我们退出最外层的`unstable_batchedUpdates` 调用时，更新被刷新。

该 API 是“不稳定的”，因为如果默认情况下已经启用批处理，我们将删除它。但是，在 React 小版本中我们不会删除它，所以在 React 17 之前，如果你需要在 React 事件处理程序之外的某些情况下强制批处理，你可以安全地依赖它。

----------

总之，这是一个令人困惑的话题，因为 React 默认只在事件处理程序中进行批处理。这将在未来的版本中发生变化，那么行为将更直接。但解决方案不是减少批处理，而是默认开启更多的批处理。这就是我们要做的。

