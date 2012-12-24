---
layout:     post
title:      大型应用的 javascript 架构
keywords: javascript, 架构
category : javascript
tags : [javascript, 架构]
---

目前很多网站基本没有明确的前端架构，大多是服务端渲染视图页，输出到浏览器，再配合一些 js，来进行交互。

<p>如果只是实现一些简单的效果，没有较复杂的逻辑，那么这种处理是合理的，
尤其是有了jQuery之类的利器，js代码写起来甚至有种随心所欲的感觉。</p>

<p>但一旦网站要改版，或者随着网站的发展，逻辑变得越来越复杂，或者为了更好的用户体验，
js要承担更多的任务，这时如果维持现状不变，那js就会变得越来越臃肿，越来越难维护。</p>

<p>解决之道就是采用模块化编程，将页面分成多个模块，模块之间互相独立，
通过发布/订阅方式来进行模块间交互，从而使模块与模块解耦，也就是说移除一个模块不会对当前页面造成影响。</p>

<p>配合模板的话，可以让前端和后端程序员更高效地配合。
前端只负责数据的显示与页面的交互，开发时，可以拟造数据，而不需要服务端程序。
后端程序员也可以专注于提供更易用，稳定的接口，而不需要关心数据的展示。</p>

<p>yahoo的这个视频详细地阐述了前端模块化编程，大致摘录如下：</p>

<h2>js架构的4个组成部分</h2>

<ul>
<li>模块(Modules)</li>
<li>沙箱(Sandbox)</li>
<li>应用(App Core)</li>
<li>类库(Base Lib)</li>
</ul><h2>模块(一切皆模块)</h2>

<p>模块就像孩子一样，他们需要遵守一些规则才能保证不会到处惹麻烦</p>

<p>模块必须在沙箱里，无论条件多么苛刻</p>

<p>模块不知道页面到底是怎样的，他们只知道沙箱</p>

<p>模块之间要解耦</p>

<h3>模块的规则</h3>

<ul>
<li>
<p>管好自己</p>

<ul>
<li>只能调用自己的或沙箱的方法</li>
<li>不要访问不属于自己的DOM节点</li>
<li>不要访问非内置全局变量</li>
</ul>
</li>
<li>
<p>先申请，再使用</p>

<ul>
<li>你需要的任何东西，要向沙箱提出申请</li>
</ul>
</li>
<li>
<p>不要把玩具放得到处都是</p>

<ul>
<li>不要创建全局变量</li>
</ul>
</li>
<li>
<p>不要和陌生人说话</p>

<ul>
<li>不要直接引用其他模块</li>
</ul>
</li>
</ul><h2>安全沙箱</h2>

<p>沙箱要保证接口的一致性，模块调用时一定要有</p>

<p>模块只知道沙箱，其他的架构对模块而言是不存在的</p>

<p>沙箱就像一个安保员，知道哪些是模块可以调用的</p>

<h3>沙箱的职责</h3>

<ul>
<li>
<p>一致性</p>

<ul>
<li>接口一定要可靠</li>
</ul>
</li>
<li>
<p>安全性</p>

<ul>
<li>检测哪一部分是模块可以访问的</li>
</ul>
</li>
<li>
<p>交互</p>

<ul>
<li>将模块的请求发送到系统</li>
</ul>
</li>
</ul><p>多花些时间来设计沙箱接口，可以添加新方法，但不能移除，也不能修改已有方法</p>

<h2>应用核心</h2>

<p>应用核心负责模块间的交互</p>

<p>应用核心通知一个模块何时该初始化，何时该注销</p>

<p>应用核心处理错误</p>

<h3>应用核心的任务</h3>

<ul>
<li>
<p>管理模块的生存周期</p>

<ul>
<li>通知一个模块何时该初始化，何时该注销</li>
</ul>
</li>
<li>
<p>内部模块间的交互</p>

<ul>
<li>让模块尽可能解耦</li>
</ul>
</li>
<li>
<p>错误处理</p>

<ul>
<li>检测，报告错误</li>
</ul>
</li>
<li>
<p>可扩展</p>

<ul>
<li>任何可扩展的东西都不会过时</li>
</ul>
</li>
</ul><h2>基本类库</h2>

<p>理想状态下，只有应用核心知道使用了哪个类库</p>

<h3>基本类库的任务</h3>

<ul>
<li>浏览器兼容性</li>
<li>
<p>常用的工具</p>

<ul>
<li>解析/序列化XML，JSON等等</li>
<li>对象操作</li>
<li>DOM操作</li>
<li>Ajax操作</li>
</ul>
</li>
<li><p>提供底层的可扩展性</p></li>
</ul><h2>实践</h2>

<p>我没有全部按照上面说的来实现，而是借鉴了部分pureMVC的思想，这样似乎更简单些。</p>

<h3>概述</h3>

<ul>
<li>一个模块对应页面的某一部分</li>
<li>模块提供了所有Mediator可以调用的方法</li>
<li>一个Mediator管理一个特定的模块</li>
<li>模块只被Mediator调用，模块甚至不知道Mediator的存在</li>
<li>Mediator之间通过发布/订阅的方式进行交互</li>
</ul><h2>demo</h2>

<p><strong>模块基类(这里使用了John Resig的simple javascript inheritance)</strong></p>

<pre><code>var Module = Class.extend({
        init: function(obj) {
                this.name = obj.name;
                this.tpl = obj.tpl ? $(obj.tpl).text() : $('#'+obj.name+'-tpl').text();
                this.$el = obj.el ? $(obj.el) : $('#'+obj.name);
                this.data = {};
        },
        getTplData: function(data) {
                return this.data.tplData;
        },
        renderTpl: function(data) {
                this.data.tplData = data;
                //使用了Mustache模板引擎
                var html = Mustache.to_html(this.tpl, data);
                this.$el.html(html);
        }});
</code></pre>

<p><strong>列表模块</strong></p>

<pre><code>var List = Module.extend({
        // Module 提供方法供Mediator调用
        hl: function($item, lock) {
                var $lis = this.$el.find('li');
                $lis.each(function(){
                        $(this).removeClass('hl');
                        if (lock) {
                                $(this).data('locked', false);
                        }
                        if (!lock &amp;&amp; $(this).data('locked')) {
                                $(this).addClass('hl');
                        }
                });
                if (lock)
                        $item.data('locked', true);
                $item.addClass('hl');
        },
        unhl: function($item) {
                $item.removeClass('hl');
        }});
</code></pre>

<p>前面说了模块就是准备好方法，让Mediator调用。</p>

<p><strong>列表Mediator</strong></p>

<pre><code>var ListMediator = Mediator.extend({
        init: function(){
                var self = this;
                // 初始化Module
                this.module =new List({
                        "name": "list"
                });
                // 绑定事件
                self.module.$el.delegate('li', 'click', function(e){
                        e.preventDefault();
                        // 调用Module方法
                        self.module.hl($(this), true);
                        var index = self.module.$el.find('li').index($(this));
                        // 发布消息，所有监听该事件的方法将被触发
                        // 参数为object，方便以后添加键值对
                        $.publish(self.module.name+':click', {
                                "content": self.module.getTplData().list[index].content
                        });
                }).delegate('li', 'mouseover', function(e){
                        self.module.hl($(this));
                }).delegate('li', 'mouseout', function(e){
                        self.module.unhl($(this));
                });
                // 获取源数据，使用了$.proxy，创建特定的context
                $.getJSON('data.json', $.proxy(function(data){
                        // 调用Module的方法
                        this.module.renderTpl(data);
                        // 发布数据已载入消息
                        $.publish(self.module.name+':loaded', data);
                }, this));
        }});
</code></pre>

<p>可以把模块想像成Model，Mediator想像成Controller，这样就实现了高内聚，低耦合。
每一个单元(模块+Mediator)都可以单独使用，也可以被移除，而不影响现有架构。</p>