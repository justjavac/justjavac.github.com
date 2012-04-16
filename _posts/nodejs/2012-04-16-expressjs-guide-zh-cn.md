---
layout: post
title: Express.js 中文入门指引手册
description: Express.js 中文入门指引手册
keywords: node.js,javascript, expressjs
category: nodejs
tags: [nodejs, javascript, express.js]
---

[Express](http://expressjs.com/) 是基于 [Node.js](http://justjavac.com/nodejs/2012/04/03/node-beginner/)，高性能、一流的web开发框架。

## express 的安装

    $ npm install express
    
或者

    $ npm install -g express

## 创建服务器

要创建 express.HTTPServer 的实例，只需简单的调用 `createServer()` 方法即可。通过 HTTPServer 实例 app 我们可以定义基于 HTTP 动作（HTTP verbs）的路由（routes），本例中为 `app.get()`。

    var app = require('express').createServer();

    app.get('/', function(req, res){
      res.send('hello world from justjavac.com!');
    });

    app.listen(3000);

## 创建 HTTPS 服务器

要初始化一个express.HTTPSServer实例，与上例相似，不同的是在createServer方法我们传入一个对象作为配置参数，该对象接受 key， cert 和其它在NodeJS https文档中提到的配置参数。

    var app = require('express').createServer({ key: ... });

## 配置

Express支持多工作环境，比如生产环境和开发环境等。开发者可以使用 `configure()` 方法根据当前环境的需要进行设置，
当configure()没有传入环境名称时，它会在各环境之前被调用（注：相当于被各个明确环境所共享）。

下面的示例我们只抛出异常（dumpException），并且在开发模式对异常堆栈的输出做出响应，
但是不论对开发或者生产环境我们都使用了methodOverride和bodyParser。

特别注意对app.router的使用，它可以被用来设置应用的路由（可选），
否则首次对app.get()、app.post()等的调用会设置路由。

    // 定义共享环境
    app.configure(function(){
        app.use(express.methodOverride());
        app.use(express.bodyParser());
        app.use(app.router);
    });

    // 定义开发环境
    app.configure('development', function(){
        app.use(express.static(__dirname + '/public'));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    // 定义生产环境
    app.configure('production', function(){
        var oneYear = 31557600000;
        app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
        app.use(express.errorHandler());
    });

对于内部和多重设置（internal和arbitrary），Express提供了 set(key[, val]), enable(key), disable(key)等方法：

    app.configure(function(){
       app.set('views', __dirname + '/views');
       app.set('views');
       // => "/absolute/path/to/views"

       app.enable('some feature');
       // 与 app.set('some feature', true); 相同

       app.disable('some feature');
       // 与 app.set('some feature', false); 相同

       app.enabled('some feature')
       // => false
    });

要修改环境，可以通过设置NODE_ENV环境变量来实现，例如：

    $ NODE_ENV=production node app.js

这很重要，因为许多的缓存机制只有在生产环境才会启用。

## 设置

Express 支持以下设置项：

* home为res.redirect()提供应用的基准路径，透明的处理已安装的应用。
* views视图（views）层的根目录，默认指向CWD/views
* view engine默认的视图（view）引擎的名字，不包含扩展名。
* view options用于设置全局视图选项的对象

## 路由

Express利用HTTP动作提供了有意义并富有表现力的URL映射API，
例如我们可能想让用户帐号的URL看起来像/user/12的样子，下面的例子就能实现这样的路由，
其中与占位标识符（本例为:id）相关的值可以被req.params获取到。

    app.get('/user/:id', function(req, res){
        res.send('user ' + req.params.id);
    });

上例中当我们访问/user/12时返回“user 12”,
注：app.get相当于在服务器注册了一个监听get请求事件的侦听器，当请求的URL满足第一个参数时，
执行后面的回调函数，该过程是异步的。

路由是一个可以被内部编译成正则表达式的简单字符串，比如当/user/:id被编译后，被内部编译后的正则表达式字符串看起来会是下面的样子（简化后）：

    /user/([^/]+)/?

要实现复杂点的，我们可以传入正则表达式直接量，因为正则捕获组是匿名的因此我们可以通过req.params进行访问，
第一个捕获组应该是req.params[0]，第二个应该是req.params[1]，以此类推。

    app.get(/^/users?(?:/(d+)(?:..(d+))?)?/, function(req, res){
        res.send(req.params);
    });

通过Linux的curl命令来测试我们定义的路由：

    $ curl http://justjavac.com:3000/user
    [null,null]
    $ curl http://justjavac.com:3000/users
    [null,null]
    $ curl http://justjavac.com:3000/users/1
    ["1",null]
    $ curl http://justjavac.com:3000/users/1..15
    ["1","15"]

下面是一些路由例子，以及与之相匹配的关联路径：

    "/user/:id"
    /user/12

    "/users/:id?"
    /users/5
    /users

    "/files/*"
    /files/jquery.js
    /files/javascripts/jquery.js

    "/file/*.*"
    /files/jquery.js
    /files/javascripts/jquery.js

    "/user/:id/:operation?"
    /user/1
    /user/1/edit

    "/products.:format"
    /products.json
    /products.xml

    "/products.:format?"
    /products.json
    /products.xml
    /products

    "/user/:id.:format?"
    /user/12
    /user/12.json

另外，我们可以通过POST方式提交json数据，然后利用bodyParser中间件解析json请求体并把json数据返回给客户端：

    var express = require('express')
      , app = express.createServer();

    app.use(express.bodyParser());

    app.post('/', function(req, res){
      res.send(req.body);
    });

    app.listen(3000);

通常我们所使用的占位符（比如/user/:id）都没有任何限制，即用户可以传入各种各样数据类型的id值，
如果我们希望限制用户id为数字，可以这样写“/user/:id(d+)”，
这样就能保证只有该占位符数据类型为数值类型才会进行路由的相关处理。

## 路由控制

一个应用中可以定义多个路由，我们可以控制以令其转向下一个路由，Express提供了第三个参数即 `next()` 函数。

当一个模式不被匹配时，控制将被转回Connect（Express基于Connect模块），同时中间件会继续按照它们在 `use()` 中增加的顺序来执行。

当多个定义的路由都可能匹配同一个URL时也是如此，除非某个路由并不调用 `next()` 且已将响应输出到客户端，否则它们也将按顺序执行。

    app.get('/users/:id?', function(req, res, next){
        var id = req.params.id;
        if (id) {
            // 注：如果在这里就将响应内容输出给客户端，那么后续的URL映射将不会被调用
        } else {
            next(); // 将控制转向下一个符合URL的路由
        }
    });

    app.get('/users', function(req, res){
        // do something else
    });

`app.all()` 方法可以对所有HTTP动作应用单一调用入口，这在有些情况下很有用。

下面我们使用该功能来从我们的模拟数据库中加载一个用户，并把它分配给req.user。

    var express = require('express')
      , app = express.createServer();

    var users = [{ name: 'www.justjavac.com' }];

    app.all('/user/:id/:op?', function(req, res, next){
      req.user = users[req.params.id];
      if (req.user) {
        next();
      } else {
        next(new Error('cannot find user ' + req.params.id));
      }
    });

    app.get('/user/:id', function(req, res){
      res.send('viewing ' + req.user.name);
    });

    app.get('/user/:id/edit', function(req, res){
      res.send('editing ' + req.user.name);
    });

    app.put('/user/:id', function(req, res){
      res.send('updating ' + req.user.name);
    });

    app.get('*', function(req, res){
      res.send('what???', 404);
    });

    app.listen(3000);

## 中间件

中间件可以通过Connect传入express.createServer()，就像正常的连接服务器一样，比如：

    var express = require('express');

    var app = express.createServer(
        express.logger(),
        express.bodyParser()
    );

另外，在configure()函数块中利用use()函数增加中间件，也是一种很好的方式。

    app.use(express.logger({ format: ':method :uri' }));

通常连接中间件可以通过require("connect")的方式，如：

    var connect = require('connect');
    app.use(connect.logger());
    app.use(connect.bodyParser());

这让人感觉有些不太爽，于是express重新输出了（re-exports)这些中间件属性，但是在使用上保持了一致性：

    app.use(express.logger());
    app.use(express.bodyParser());

## 路由中间件

这里路径映射也可以理解为路由的意思，路由通过传入一个或多个附加的回调函数（或数组）到方法中，从而可以利用特定路由的中间件。

该功能对限制访问以及加载路由使用的数据非常有用。

通常情况下异步数据的查询看起来像下面的样子，这里我们使用:id参数，并尝试获取一个用户。

    app.get('/user/:id', function(req, res, next){
      loadUser(req.params.id, function(err, user){
        if (err) return next(err);
        res.send('Viewing user of justjavac.com ' + user.name);
      });
    });

为了保持代码整洁并且提高可读性，我们可以在中间件内部应用该逻辑。

正如你所看到的，将逻辑抽象到中间件里让我们达到一定程度的复用，同时代码更干净。

    function loadUser(req, res, next) {
      // 这里提供假数据，你可以从数据库中获取真实用户信息
      var user = users[req.params.id];
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error('不存在的用户 ' + req.params.id));
      }
    }

    app.get('/user/:id', loadUser, function(req, res){
      res.send('正在查看用户 ' + req.user.name);
    });

注：看到了吗？上面的路径映射的回调函数参数是可以支持多个的。

多重路由中间件可以被按照顺序来执行，从而可以实现更复杂的逻辑，比如限制访问某个用户的访问权限，下面的代码将只允许认证用户才可以编辑其帐号信息。

    function andRestrictToSelf(req, res, next) {
      req.authenticatedUser.id == req.user.id
        ? next()
        : next(new Error('无权限'));

    }

    app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
      res.send('开始编辑用户 ' + req.user.name);
    });

请记住中间件是简单的函数，我们还能定义返回中间件的函数，从而可以创建一个更有表现力和更易用的如下方案：

    function andRestrictTo(role) {
      return function(req, res, next) {
        req.authenticatedUser.role == role
          ? next()
          : next(new Error('无权限'));

      }
    }

    app.del('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
      res.send('已删除用户 ' + req.user.name);
    });

注：app.del的第三个参数之所以可以这样写，是因为其返回的是一个函数，而该函数可以访问’admin’的值，这里涉及到闭包的概念，如有疑问请在justjavac.com查找闭包相关文章。

通常使用的中间件的“栈”可以被作为数组（递归应用）传入，如此可以被混合并能匹配更复杂的功能。

    var a = [middleware1, middleware2]
      , b = [middleware3, middleware4]
      , all = [a, b];

    app.get('/foo', a, function(){});
    app.get('/bar', a, function(){});

    app.get('/', a, middleware3, middleware4, function(){});
    app.get('/', a, b, function(){});
    app.get('/', all, function(){});

可以去express源码仓库查看完整的路由中间件示例。

## HTTP 方法

在前面的文章中我们已经接触过app.get()多次了，同时Express也提供了对其它HTTP动作的封装，如app.post(), app.del()等。

对于POST最常见的例子，就是当我们提交一个表单时，下面我们在HTML中将表单的method特性设置为“post”，然后需要在服务端定义对该表单提交的路由控制。

    <form method="post" action="/">
       <input type="text" name="user[name]" />
       <input type="text" name="user[email]" />
       <input type="submit" value="Submit" />
    </form>

默认情况下Express并不知道该如何处理该请求体，因此我们需要增加bodyParser中间件，用于分析application/x-www-form-urlencoded和application/json请求体，并把变量存入req.body。

我们可以像下面的样子来“使用”中间件：

    app.use(express.bodyParser());

接下来下面的路由就可以访问req.body.user对象了，该对象包含客户端提交的name和email属性。

    app.post('/', function(req, res){
      console.log(req.body.user);
      res.redirect('back');
    });

要在表单中使用PUT的HTTP方法，我们可以利用名为_method的隐藏表单域，它能改变HTTP方法。

而在服务端，我们首先需要利用methodOverride中间件，把它放在bodyParser中间件下方，从而可以利用包含表单值的req.body。

    app.use(express.bodyParser());
    app.use(express.methodOverride());

之所以需要这样做，是因为这些处理并不总是默认进行的，原因很简单，因为这些对Express的整体功能来说并不是必需的，依据应用的具体需求，你并不一定需要这些功能，如果客户端直接支持PUT和DELETE方法也可以被直接访问到，同时methodOverride为表单提供了强大的解决方案，下面我们展示下PUT的使用：

    <form method="post" action="/">
        <input type="hidden" name="_method" value="put" />
        <input type="text" name="user[name]" />
        <input type="text" name="user[email]" />
        <input type="submit" value="Submit" />
    </form>

    app.put('/', function(){
        console.log(req.body.user);
        res.redirect('back');
    });

## 错误处理

Express提供了app.error()方法来接收路由或传入next(err)的异常，下面的示例为不同的页面提供专门的NotFound异常服务：

    function NotFound(msg){
      this.name = 'NotFound in justjavac.com';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
    }

    NotFound.prototype.__proto__ = Error.prototype;

    app.get('/404', function(req, res){
      throw new NotFound;
    });

    app.get('/500', function(req, res){
      throw new Error('keyboard cat!');
    });

像下面一样，我们可以多次调用app.error()，这里我们检查如果是NotFound实例就显示404页面，否则将其传入下一个错误处理。

注意这些处理可以定义在任何地方，它们可以放在路由可以listen()之处。

这也允许在configure()块内做定义，于是我们就可以以不同的基于环境的方式处理异常。

    app.error(function(err, req, res, next){
        if (err instanceof NotFound) {
            res.render('404.jade');
        } else {
            next(err);
        }
    });

下面的演示我们假设所有错误都为500错误，但你可以根据喜好选择。

例如当node在处理文件系统调用时，就有可能接收到这样的错误对象，其ENOENT的error.code为“no such file or directory”，这时我们可以在错误处理函数中进行处理然后显示特定的页面给用户。

    app.error(function(err, req, res){
       res.render('500.jade', { error: err });
    });

我们的应用也可以利用Connect errorHandler中间件来汇报异常信息。例如我们想在“开发”环境输出异常到stderr：

    app.use(express.errorHandler({ dumpExceptions: true }));

同时在开发期间我们想用好看的HTML页面显示异常信息时，可以设置showStack的值为true：

    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));

如果请求头 `Accept: application/json`，errorHandler中间件也能以json方式做出响应，
这对依赖于客户端Javascript的应用开发很有益处。

## 路由参数预处理

路由参数预处理通过隐式的数据处理，可以大幅提高应用代码的可读性和请求URL的验证。

假如你经常性的从几个路由获取通用数据，如通过/user/:id加载用户信息，通常我们可能会这样做：

    app.get('/user/:userId', function(req, res, next){
      User.get(req.params.userId, function(err, user){
        if (err) return next(err);
        res.send('user ' + user.name);
      });
    });

利用预处理后参数可以被映射到回调函数，从而可以提供诸如验证、强制性改变值，甚至从数据库中加载数据等功能。

下面我们将调用app.param()并传入我们希望映射到某个中间件的参数，可以看到我们接收了包含占位符（:userId）值的id参数。

在这里可以与平常一样进行用户数据加载以及错误处理，并能简单的通过调用next()将控制权转向下一个预处理或路由（路径控制）。

    app.param('userId', function(req, res, next, id){
      User.get(id, function(err, user){
        if (err) return next(err);
        if (!user) return next(new Error('failed to find user'));
        req.user = user;
        next();
      });
    });

这样做，不仅向上面提到的可以大幅提高路由的可读性，还能在整个应用中共享该部分的逻辑实现，达到复用目的。

    app.get('/user/:userId', function(req, res){
      res.send('justjavac用户为 ' + req.user.name);
    });

对于简单的情况如路由占位符验证和强迫改变值，只需要传入1个参数（支持1个参数），期间抛出的异常将自动传入next(err)。

    app.param('number', function(n){ return parseInt(n, 10); });

也可以同时将回调函数应用到多个占位符，比如路由/commits/:from-:to来说，:from和:to都是数值类型，我们可以将它们定义为数组：

    app.param(['from', 'to'], function(n){ return parseInt(n, 10); });

## 视图渲染

视图的文件名默认需遵循 `<name>.<engine>` 的形式，这里 `<engine>` 是要被加载的模块的名字。

比如视图layout.ejs就是在告诉视图系统要require("ejs")，被加载的模块必须输出exports.compile(str, options)方法，并要返回一个函数来遵守Express的模板接口约定。

我们也可以使用app.register()来映射模板引擎到其它文件扩展名，从而实现更灵活的模板引擎行为，如此一来就可以实现“justjavac.html”可以被ejs引擎所渲染。

下面我们将用Jade引擎来渲染index.html，因为我们没有设置layout:false，index.jade渲染后的内容将被作为body本地变量传入layout.jade。

    app.get('/', function(req, res){
        res.render('index.jade', { title: 'justjavac, 关注Web前端技术！' });
    });

新增的view engine设置可以指定默认模板引擎，如果我们想使用jade可以这样设置：

    app.set('view engine', 'jade');

于是我们就可以通过下面的方式：

    res.render('index');

代替如下方式:

    res.render('index.jade');

当view engine设置后，模板的扩展名就成了可选项，同时我们还可以混合匹配多模板引擎：

    res.render('another-page.ejs');

Express同时提供了视图选项(view options)设置，这些设置会在每次视图渲染后应用，比如你并不经常使用layouts，就可以这样设置：

    app.set('view options', {
        layout: false
    });

如果需要，这些设置可以在后续的res.render()调用中被覆盖：

res.render('justjavac-view.ejs', { layout: true });

可以通过指定一个路径的方式来实现用自己的layout来代替系统默认的，比如如果我们将“view engine”设置为jade并且自定义了一个名为“./views/mylayout.jade”的layout，我们可以这样使用它：

    res.render('page', { layout: 'mylayout' });

否则必须指定扩展名：

    res.render('page', { layout: 'mylayout.jade' });

这些路径也可以是绝对路径：

    res.render('page', { layout: __dirname + '/../../mylayout.jade' });

这方面较好的例子就是自定义ejs模板的开始和关闭的标记：

    app.set('view options', {
        open: '{{',
        close: '}}'
    });

## 局部视图

Express视图系统原生支持局部和集合视图，这称作微型视图，主要用于渲染一个文档片段。

比如与其在视图中循环显示评论，不如使用局部集合（partial collection）：

    partial('comment', { collection: comments });

如果不需要其它选项或本地变量，我们可以省略对象而简单的传入评论数组，这和上面的示例是一样的：

    partial('comment', comments);

当使用局部集合时，支持一些“魔术”本地变量：

    firstInCollection 当为第一个对象时该值为true
    indexInCollection 集合中对象的索引值
    lastInCollection 当为最后一个对象时为true
    collectionLength 集合的长度

传入（或生成）的本地变量优先，但传入父视图的本地变量在子视图仍有效。因此如果我们用partial(‘blog/post’, post)来渲染博客日志时，将生成post的本地变量，但调用本函数的视图拥有本地用户，它在blog/post视图依然有效。

性能提示：当使用局部集合渲染100长度的数组就意味着需要渲染100次视图，对于简单的集合你可以将循环内联，而不要使用局部集合，这样可以减少系统开销。


## 视图查找

视图查找是相对于父视图进行的，比如我们有一个名为“views/user/list.jade”的页面视图，如果在该视图中调用partial(‘edit’)，视图系统将会尝试查找并加载“views/user/edit.jade”，而partial(‘../messages’)将加载“views/messages.jade”。

视图系统还支持索引模板，这样你就可以使用一个同名的目录。比如，在一个路由中我们执行res.render(‘users’)，这将指向“views/users.jade”或者“views/users/index.jade”。

当使用上面的索引视图时，我们可以通过partial(‘users’)从同名目录下引用“views/users/index.jade”，同时视图系统会尝试“../users/index”，这能减少我们调用partial(‘index’)的需要。

## 模板引擎

Express支持许多模板引擎，常用的有：

* Haml haml 的实现
* Jade haml.js 接替者，同时也是Express的默认模板引擎
* EJS 嵌入JavaScript模板
* CoffeeKup 基于CoffeeScript的模板引擎
* jQuery Templates 的NodeJS版本

##  Session Support

可以在Express中通过增加Connect的session中间件来开启Session支持，当然前提是需要在这之前使用cookieParser中间件，用于分析和处理req.cookies的cookie数据(我们知道session会利用cookie进行通信保持的)。

    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));

默认session中间件使用Connect绑定的内存存储，但也有另外的实现方式。比如connect-redis就提供了一个Redis的session存储方案：

    var RedisStore = require('connect-redis');
    app.use(express.cookieParser());
    app.use(express.session({ secret: "justjavac加密字符串", store: new RedisStore }));

现在req.session和req.sessionStore属性就可以被所有路由及下级中间件所访问，req.session的属性会伴随着每一次响应发送给客户端，下面是一个购物车的例子：

    var RedisStore = require('connect-redis');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));

    app.post('/add-to-cart', function(req, res){
      // 利用bodyParser()中间件处理POST提交的表单数据
      var items = req.body.items;
      req.session.items = items;
      res.redirect('back');
    });

    app.get('/add-to-cart', function(req, res){
      // 当页面回到返回并通过GET请求/add-to-cart 时
      // 我们可以检查req.session.items && req.session.items.length，然后将信息打印到页面
      if (req.session.items && req.session.items.length) {
        req.flash('info', 'You have %s items in your cart', req.session.items.length);
      }
      res.render('shopping-cart');
    });

req.session对象还拥有许多其它方法，如Session#touch(), Session#destroy(), Session#regenerate()等用于session处理，更多信息请查看 [Connect Session文档](http://senchalabs.github.com/connect/middleware-session.html)。