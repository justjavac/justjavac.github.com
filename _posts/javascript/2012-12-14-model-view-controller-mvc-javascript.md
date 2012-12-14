---
layout: post
title: 「译」JavaScript 的 MVC 模式 
description: 我喜欢 JavaScript，因为它是在世界上最灵活的语言之一。在 JavaScript 中，程序员可以根据自己的口味选择编程风格：面向过程或面向对象。如果你是一个重口味，JavaScript 一样可以应付自如：面向过程，面向对象，面向方面，使用 JavaScript 开发人员甚至可以使用函数式编程技术)。
keywords: mvc, JavaScript, design pattern, 设计模式
category : javascript
tags : [mvc, JavaScript]
---

原文：[Model-View-Controller (MVC) with JavaScript](http://www.alexatnet.com/articles/model-view-controller-mvc-javascript)

作者：[Alex@Net](http://www.alexatnet.com)

译文：[JavaScript 的 MVC 模式](http://justjavac.com/javascript/2012/12/14/model-view-controller-mvc-javascript.html)

译者：[justjavac](http://justjavac.com)

本文介绍了[模型-视图-控制器模式](http://en.wikipedia.org/wiki/Model-view-controller)在 JavaScript 中的实现。

我喜欢 JavaScript，因为它是在世界上最灵活的语言之一。
在 JavaScript 中，程序员可以根据自己的口味选择编程风格：面向过程或面向对象。
如果你是一个重口味，JavaScript 一样可以应付自如：
面向过程，面向对象，[面向方面](http://en.wikipedia.org/wiki/Aspect-oriented_programming)，
使用 JavaScript 开发人员甚至可以使用[函数式编程技术](http://www-128.ibm.com/developerworks/java/library/wa-javascript.html)。

这篇文章中，我的目标是编写一个简单的 JavaScript 组件，来向大家展示一下 JavaScript 的强大。
该组件是一个可编辑的项目列表（HTML中的 select 标签）：用户可以选择某一项并删除它，或者添加新的项目到列表中。
组件将由三个类构成，分别对应着 [MVC 设计模式](http://en.wikipedia.org/wiki/Model-view-controller)的模型-视图-控制器。

这篇文章只是一个简单的指导。
如果你希望在实际的项目中使用它，你需要进行适当的修改。
我相信你拥有创建和运行 JavaScript 程序的一切：大脑，双手，文本编辑器（如记事本），浏览器（例如我的最爱 Chrome）。

既然我们的代码要使用 MVC 模式，因此我在这里简单介绍一个这个设计模式。
MVC 模式的英文名称是 Model-View-Controller pattern，顾名思义，其主要部分组成：

* 模型Model()，用于存储程序中使用到的数据;
* 视图(View)，用不同的表现形式来呈现数据；
* 控制器(Controller)，更新模型。

在维基百科对 MVC 体系结构的定义中，它由如下三部分组成：

模型（Model） -“数据模型”（Model）用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。
“模型”有对数据直接访问的权力。
“模型”不依赖“视图”和“控制器”，也就是说，模型不关心它会被如何显示或是如何被操作。

视图（View） - 视图层能够实现数据有目的的显示，通常是一个用户界面元素。
在视图中一般没有程序上的逻辑。
在 Web 应用程序中的 MVC，通常把显示动态数据的 html 页面称为视图。

控制器（Controller） - 处理和响应事件，通常是用户操作，并监控模型上的变化，然后去修改视图。

The data of the component is a list of items, in which one particular item can be selected and deleted. 
So, the model of the component is very simple - it is stored in an array property and selected item property; and here it is:

我们将基于 MVC 实现一个数据列表组件，列表中的项目可以被选择和删除。
因此，组件模型是非常简单的 - 它只需要两个属性：

1. 数组 `_items` 用来存储所有元素
2. 普通变量 `_selectedIndex` 用来存储选定的元素索引

代码如下：

    /**
     * 模型。
     *
     * 模型存储所有元素，并在状态变更时通知观察者（Observer）。
     */ 
    function ListModel(items) {
        this._items = items;        // 所有元素
        this._selectedIndex = -1;   // 被选择元素的索引

        this.itemAdded = new Event(this);
        this.itemRemoved = new Event(this);
        this.selectedIndexChanged = new Event(this);
    }

    ListModel.prototype = {
        getItems : function () {
            return [].concat(this._items);
        },

        addItem : function (item) {
            this._items.push(item);
            this.itemAdded.notify({item : item});
        },

        removeItemAt : function (index) {
            var item;

            item = this._items[index];
            this._items.splice(index, 1);
            this.itemRemoved.notify({item : item});
            
            if (index === this._selectedIndex) {
                this.setSelectedIndex(-1);
            }
        },

        getSelectedIndex : function () {
            return this._selectedIndex;
        },

        setSelectedIndex : function (index) {
            var previousIndex;

            previousIndex = this._selectedIndex;
            this._selectedIndex = index;
            this.selectedIndexChanged.notify({previous : previousIndex});
        }
    };

`Event` 是一个简单的实现了观察者模式（Observer pattern）的类：

    function Event(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    Event.prototype = {
        attach : function (listener) {
            this._listeners.push(listener);
        },
        
        notify : function (args) {
            var index;

            for (index = 0; index < this._listeners.length; index += 1) {
                this._listeners[index](this._sender, args);
            }
        }
    };

`View` 类需要定义控制器类，以便与它交互。
虽然这个任务可以有许多不同的接口（interface），但我更喜欢最简单的。
我希望我的项目是在一个 ListBox 控件和它下面的两个按钮：“加号”按钮添加项目，“减”删除所选项目。
组件所提供的“选择”功能则需要 `select` 控件的原生功能的支持。

一个 `View` 类被绑定在一个 `Controller` 类上，
其中「…控制器处理用户输入事件，通常是通过一个已注册的回调函数」（wikipedia.org）。

下面是 `View` 和 `Controller` 类：

    /**
     * 视图。
     * 
     * 视图显示模型数据，并触发 UI 事件。
     * 控制器用来处理这些用户交互事件
     */ 
    function ListView(model, elements) {
        this._model = model;
        this._elements = elements;

        this.listModified = new Event(this);
        this.addButtonClicked = new Event(this);
        this.delButtonClicked = new Event(this);

        var _this = this;

        // 绑定模型监听器
        this._model.itemAdded.attach(function () {
            _this.rebuildList();
        });
        
        this._model.itemRemoved.attach(function () {
            _this.rebuildList();
        });

        // 将监听器绑定到 HTML 控件上
        this._elements.list.change(function (e) {
            _this.listModified.notify({ index : e.target.selectedIndex });
        });
        
        this._elements.addButton.click(function () {
            _this.addButtonClicked.notify();
        });
        
        this._elements.delButton.click(function () {
            _this.delButtonClicked.notify();
        });
    }

    ListView.prototype = {
        show : function () {
            this.rebuildList();
        },

        rebuildList : function () {
            var list, items, key;

            list = this._elements.list;
            list.html('');

            items = this._model.getItems();
            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    list.append($('<option>' + items[key] + '</option>'));
                }
            }
            
            this._model.setSelectedIndex(-1);
        }
    };

    /**
     * 控制器。
     *
     * 控制器响应用户操作，调用模型上的变化函数。
     */ 
    function ListController(model, view) {
        this._model = model;
        this._view = view;

        var _this = this;

        this._view.listModified.attach(function (sender, args) {
            _this.updateSelected(args.index);
        });

        this._view.addButtonClicked.attach(function () {
            _this.addItem();
        });

        this._view.delButtonClicked.attach(function () {
            _this.delItem();
        });
    }

    ListController.prototype = {
        addItem : function () {
            var item = window.prompt('Add item:', '');
            if (item) {
                this._model.addItem(item);
            }
        },

        delItem : function () {
            var index;

            index = this._model.getSelectedIndex();
            if (index !== -1) {
                this._model.removeItemAt(this._model.getSelectedIndex());
            }
        },

        updateSelected : function (index) {
            this._model.setSelectedIndex(index);
        }
    };

当然，`Model`, `View`, `Controller` 类应当被实例化。

下面是一个使用此 MVC 的完整代码：

    $(function () {
        var model = new ListModel(['PHP', 'JavaScript']),
        
        view = new ListView(model, {
            'list' : $('#list'), 
            'addButton' : $('#plusBtn'), 
            'delButton' : $('#minusBtn')
        }),
        
        controller = new ListController(model, view);        
        view.show();
    });
    
    <select id="list" size="10" style="width: 15em"></select><br/>
    <button id="plusBtn">  +  </button>
    <button id="minusBtn">  -  </button>
