---
layout: post
title: JavaScript中的异步梳理（2）——使用Promises/A
keywords: javascript, asynchronous
category : javascript
tags : [javascript, asynchronous]
---

原文：[JavaScript中的异步梳理（2）——使用Promises/A](http://jimliu.net/?p=64)

作者：[JimLiu](http://jimliu.net)

----------------------------------------------------

接[上篇](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-1-message-driven.html)，这篇探讨使用 CommonJS Promises/A 来管理异步操作。

写在前面：本人并没有系统深入研究过 Promises 模型，但以解决问题为目的进行了一些尝试，本文更多围绕自己的理解写，而非规范本身。

[Promises][] 是一种异步编程模型，通过一组 API 来规范化异步操作，这样也能够让异步操作的流程控制更加容易。

[Promises]: http://wiki.commonjs.org/wiki/Promises

这里谈的是 [Promises/A][]，算是 Promises 的一个分支吧，其实就是根据 Promises 模型定义了一组 API。
由于 Promises 对于新手而言理解曲线还是比较陡峭的，这里循序渐进的给大家介绍，同时实现一个最简单的 Promises/A 代码。

[Promises/A]: http://jimliu.net/Promises/A

Promises/A 有个别名叫做「thenable」，就是「可以 then」的。
这里一个 promise 有三种状态：[默认、完成、失败]，初始创建的时候是默认状态，状态只可以从默认变成完成，或者默认变成失败。
一旦完成或者失败，状态就不能再变。
为了简化文章，这里我们先只考虑完成，不考虑失败。

	var Promise = function(ok){
	    this.state = 'unfulfilled';
	    this.ok =  || function(obj) { return obj; };
	};
	Promise.prototype = {
	    resolve: function(obj){
	        if (this.state !== 'unfulfilled') throw '已完成，不能再次resolve';
	        this.state = 'fulfilled';
	    }
	};
	var promise = new Promise(function(obj){ return obj; });

构造函数中的 ok 是一个任务，`promise.resolve(obj)` 表示将该 `promise` 的状态改为完成，
此时 ok 会被执行，其返回值作为后续操作的参数以及 `resolve` 的返回值。

由于没有和任何异步操作关联在一起，这里的 Promise 还没有任何作用。
Promises/A 之所以叫「thenable」是因为它的核心 API 叫做 then，望文生义这个方法的作用是当一个 promise 完成或失败后继续干别的事情。

- then 传入一个函数作为参数 nextOK①，当该 promise 被 resolve 时，resolve 的返回值将会传递到 nextOK 中。

- then 返回一个 promise，当上述后续操作完成时，返回的 promise 也会被 resolve。

- 如果 promise 的状态是已完成，则 nextOK 会被立即调用。

但是这样并无法异步，因此这里有一个特殊情况，就是如果 nextOK 的返回值也是一个 Promise，
那么 then 返回的 promise 需要当这个 promise 被 resolve 时才会被 resolve。

	var Promise = function(ok){
	    this.state = 'unfulfilled';
	    this.ok = ok || function(obj) { return obj; };
	    this.thens = [];
	};
	Promise.prototype = {
	    resolve: function(obj){
	        if (this.state != 'unfulfilled') throw '已完成，不能再次resolve';
	        this.state = 'fulfilled';
	        this.result = this.ok(obj); // 执行ok
	 
	        for (var i=0, len=this.thens.length; i<len; ++i){
	            // 依次调用该任务的后续任务
	            var then = this.thens[i];
	            this._fire(then.promise, then.ok);
	        }
	        return this;
	    },
	    _fire: function(nextPromise, nextOK){
	        var nextResult = nextOK(this.result); // 调用nextOK
	        if (nextResult instanceof Promise){
	            // 异步的情况，返回值是一个Promise，则当其resolve的时候，nextPromise才会被resolve
	            nextResult.then(function(obj){
	                nextPromise.resolve(obj);
	            });
	        }else{
	            // 同步的情况，返回值是普通结果，立即将nextPromise给resolve掉
	            nextPromise.resolve(nextResult);
	        }
	        return nextPromise;
	    },
	    _push: function(nextPromise, nextOK){
	        this.thens.push({
	            promise: nextPromise,
	            ok: nextOK
	        });
	        return nextPromise;
	    },
	    then: function(nextOK){
	        var promise = new Promise();
	        if (this.state == 'fulfilled'){
	            // 如果当前状态是已完成，则nextOK会被立即调用
	            return this._fire(promise, nextOK);
	        }else{
	            // 否则将会被加入队列中
	            return this._push(promise, nextOK);
	        }
	    }
	};

到到了这里，我们的极简版 Promise 就完成了，那么如何使用呢？
这里举个例子，首先定义一些「任务」，例如：

	function print(num){
	    console.log(num);
	    return num;
	}
	function addTwo(num){
	    return num + 2;
	}

按需要组织这些任务

	var promise = new Promise(print);
	promise.then(addTwo)
	       .then(print)
	       .then(addTwo)
	       .then(print); // 这里的任务将会加入到队列中
	promise.resolve(3); // 激活整个队列

可以看到控制台里依次打印出了 3、5 和 7。

但这些任务都是同步的，无法体现出 Promise 的强大之处——异步控制。
这里我们通过 nextOK 返回 promise 的方法来实现一个 delay。

	function delay(ms){
	    return function(obj){
	        var promise = new Promise();
	        setTimeout(function(){
	            promise.resolve(obj);
	        }, ms);
	        return promise;
	    };
	}

利用它来改造上面的任务队列，让后两次打印之间延迟 2 秒：

	var promise = new Promise(print);
	promise.then(addTwo)
	       .then(print)
	       .then(delay(2000)) // 延迟2秒
	       .then(addTwo)
	       .then(print);
	promise.resolve(3);

利用这个原理，可以做一些巧妙的代码：

	function fibNext(pair){
	    print(pair[0]);
	    return [pair[1], pair[0]+pair[1]];
	}
	 
	var promise = new Promise(fibNext);
	promise.then(function(pair){
	    promise = promise.then(delay(1000))
	                     .then(fibNext)
	                     .then(arguments.callee);
	    return pair;
	});
	promise.resolve([1,1]);

上面没有使用循环，但是实现了一个无限每隔1秒自动打印的斐波那契数列。

Promises 模型相当优雅，通过一些扩展可以实现诸如 `when`, `whenAll` 等 API，对于封装异步操作非常有帮助。

事实上的库中不常直接用 Promise 这个名字，而常用 Deferred，Defer 的意思是「延迟」，因此 Deferred 常被成为「延迟队列」或者「异步队列」。
在 jQuery 1.5 中引入了 `jQuery.Deferred`，Dojo 在这方面也是先行者，dojo 0.3 就实现了 Deferred。
事实上在使用了 Deferred 之后，`jQuery.ajax` 和 `dojo.ajax` 返回的结果都是 Deferred，因此可以用 then 取代传统的传入回调函数的形式，非常方便，
例如在 dojo 中可以：

	dojo.xhrGet({ 
	    url: "users.json", 
	    handleAs: "json" 
	}).then(function(userList){ 
	    dojo.forEach(userList, function(user){
	        appendUser(user);
	    }); 
	});

使用这样的代码可以随时对 ajax 请求添加回调，而不一定是在定义之初设定回调，灵活性更强。

而「设定一系列函数，在合适的时候调用它们；在此之后加入的函数将会被立即调用」这样的特性简直天生就和 domReady 是一对，
实际上 jQuery 也使用 Deferred 重构了 `$.ready`。

与此同时，借助 Deferred 实现动画这样的连续、并行的异步任务也非常优雅。

通过 Promises 模型，把异步操作都理解为异步「任务」，以任务为单位来组织调度异步操作，实际上已经有那么点函数式的味道了。

[下一篇文章](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-3-windjs.html)，也是这个系列的最后一篇，将介绍另一种更加函数式的 JavaScript 异步操作组织方法。

①事实上 Promises/A 的定义要复杂的多，包括失败 reject 等等，本文不细做阐述。

**相关阅读**：

1. [JavaScript 中的异步梳理（0）](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-0.html)
2. [JavaScript 中的异步梳理（1）——使用消息驱动](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-1-message-driven.html)
3. [JavaScript 中的异步梳理（2）——使用 Promises/A](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-2-promises-a.html)
4. [JavaScript 中的异步梳理（3）——使用 Wind.js](http://justjavac.com/javascript/2013/08/08/asynchronous-in-javascript-3-windjs.html)
