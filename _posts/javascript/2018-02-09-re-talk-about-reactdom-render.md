---
layout: post
title: 再谈 ReactDom.render
description: 再谈 ReactDom.render
keywords: javascript,React
category : javascript
tags : [javascript, React]
---

今天看到一篇很有意思的文章：[有没有考虑过ReactDom.render的第一个参数到底是什么？](https://zhuanlan.zhihu.com/p/33649996)

初看标题以为作者有什么重大发现，结果发现文章很短。看完我总结一下就是，作者从如下代码：

```jsx
ReactDOM.render(<App />, document.getElementById('root'));
```

推导出了实际上，`ReactDOM.render` 的第一个参数就是一段 jsx。（为什么我觉得这是显而易见的呢？`<App />` 不就是一个 jsx 吗）

作者得出一个结论：

> 不管你在这放组件，元素，还是无状态组件，本质上都是在放一个JSX的语法

大误！

-------------

`render` 函数的方法签名：

```jsx
ReactDOM.render(element, container[, callback]) 
```

既然讨论类型，那不如看看强类型的 ts 对这个函数的类型定义：

```ts
export interface Renderer {
    // Deprecated(render): The return value is deprecated.
    // In future releases the render function's return type will be void.

    <T extends Element>(
        element: DOMElement<DOMAttributes<T>, T>,
        container: Element | null,
        callback?: () => void
    ): T;

    (
        element: Array<DOMElement<DOMAttributes<any>, any>>,
        container: Element | null,
        callback?: () => void
    ): Element;

    (
        element: SFCElement<any> | Array<SFCElement<any>>,
        container: Element | null,
        callback?: () => void
    ): void;

    <P, T extends Component<P, ComponentState>>(
        element: CElement<P, T>,
        container: Element | null,
        callback?: () => void
    ): T;

    (
        element: Array<CElement<any, Component<any, ComponentState>>>,
        container: Element | null,
        callback?: () => void
    ): Component<any, ComponentState>;

    <P>(
        element: ReactElement<P>,
        container: Element | null,
        callback?: () => void
    ): Component<P, ComponentState> | Element | void;

    (
        element: Array<ReactElement<any>>,
        container: Element | null,
        callback?: () => void
    ): Component<any, ComponentState> | Element | void;

    (
        parentComponent: Component<any> | Array<Component<any>>,
        element: SFCElement<any>,
        container: Element,
        callback?: () => void
    ): void;
}
```

`render` 方法的返回值被废弃，在将来的版本中将返回 `void`。理由大概是将来可能会使用异步 render。

第一个参数的类型包括：

- `DOMElement` 或 `DOMElement` 数组，返回 `Element`
- `SFCElement` 或 `SFCElement` 数组，返回 `void`
- `CElement` 或 `CElement` 数组，返回 `Component`
- `ReactElement` 或 `ReactElement` 数组，返回 `Component` 或 `Element` 或 `void`

其中 `SFCElement`、`CElement`、`DOMElement` 都是 `ReactElement` 的子类，分别对应类组件和函数组件生成的 `Element` 以及 DOM 元素的包装。

还有最后一个，接收 4 个参数：

```ts
(
    parentComponent: Component<any> | Array<Component<any>>,
    element: SFCElement<any>,
    container: Element,
    callback?: () => void
): void;
```

从方法签名看，第一个参数接收的是一个 React 组件。

我试了一下，直接报错 `Target container is not a DOM element.`：

![Target container is not a DOM element](/assets/images/target-container-is-not-a-dom-element.jpg)

查看 React 的源码也没有这个方法签名，和这个接近的方法是非正式的 `unstable_renderSubtreeIntoContainer`。

---------------

很多人误解了 React 的 Component 和 Element。

```ts
const App = ({ name }) => (
  <div>
    Hello {name}!
  </div>
);
```

App 就是 Component，而 `<App />` 是 Element。

------------

已经给 DefinitelyTyped/DefinitelyTyped 提了一个 issue [`ReactDOM.render` has a wrong method signature](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23527)
