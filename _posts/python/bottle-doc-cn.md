---
layout: post
title: Bottle 中文文档
keywords: python,文档
category : python
tags : [python, 文档]
---

译者: smallfish <smallfish.xy@gmail.com>

更新日期: 2009-09-25

原文地址: <http://bottle.paws.de/page/docs>

译文地址: <http://pynotes.appspot.com/static/bottle/docs.htm>

**********************

这份文档会不断更新。
如果在文档里没有找到答案，请在版本跟踪中提出 [issue](http://github.com/defnull/bottle/issues)。

## 基本映射

映射使用在根据不同 URLs 请求来产生相对应的返回内容。
Bottle 使用 `route()` 修饰器来实现映射。

	from bottle import route, run
	@route('/hello')
	def hello():
	    return "Hello World!"
	run() # This starts the HTTP server

运行这个程序，访问 `http://localhost:8080/hello` 将会在浏览器里看到 `"Hello World!"`。

### GET, POST, HEAD, ...

这个映射装饰器有可选的关键字 `method` 默认是 `method='GET'`。
还有可能是 POST，PUT，DELETE，HEAD 或者监听其他的 HTTP 请求方法。

	from bottle import route, request
	@route('/form/submit', method='POST')
	def form_submit():
	    form_data = request.POST
	    do_something(form_data)
	    return "Done"

## 动态映射

你可以提取 URL 的部分来建立动态变量名的映射。

	@route('/hello/:name')
	def hello(name):
	    return "Hello %s!" % name

默认情况下，一个 `:placeholder` 会一直匹配到下一个斜线。
需要修改的话，可以把正则字符加入到 `#s` 之间：

	@route('/get_object/:id#[0-9]+#')
	def get(id):
	    return "Object ID: %d" % int(id)

或者使用完整的正则匹配组来实现：

	@route('/get_object/(?P<id>[0-9]+)')
	def get(id):
	    return "Object ID: %d" % int(id)

正如你看到的，URL 参数仍然是字符串，即使你正则里面是数字。
你必须显式的进行类型强制转换。

### `@validate()` 装饰器

Bottle 提供一个方便的装饰器 `validate()` 来校验多个参数。
它可以通过关键字和过滤器来对每一个 URL 参数进行处理然后返回请求。

	from bottle import route, validate
	# /test/validate/1/2.3/4,5,6,7
	@route('/test/validate/:i/:f/:csv')
	@validate(i=int, f=float, csv=lambda x: map(int, x.split(',')))
	def validate_test(i, f, csv):
	    return "Int: %d, Float:%f, List:%s" % (i, f, repr(csv))

你可能需要在校验参数失败时抛出 `ValueError`。

## 返回文件流和 JSON

WSGI 规范不能处理文件对象或字符串。
Bottle 自动转换字符串类型为 `iter` 对象。
下面的例子可以在 Bottle 下运行，但是不能运行在纯 WSGI 环境下。

	@route('/get_string')
	def get_string():
	    return "This is not a list of strings, but a single string"
	@route('/file')
	def get_file():
	    return open('some/file.txt','r')

字典类型也是允许的。
会转换成 json 格式，自动返回 `Content-Type: application/json`。

	@route('/api/status')
	def api_status():
	    return {'status':'online', 'servertime':time.time()}

你可以关闭这个特性 `:bottle.default_app().autojson = False`

## Cookies

Bottle 是把 cookie 存储在 `request.COOKIES` 变量中。
新建 cookie 的方法是 `response.set_cookie(name, value[, **params])`。
它可以接受额外的参数，属于 SimpleCookie 的有有效参数。

	from bottle import response
	response.set_cookie('key','value', path='/', domain='example.com', secure=True, expires=+500, ...)

设置 `max-age` 属性(它不是个有效的 Python 参数名) 你可以在实例中修改 `cookie.SimpleCookie in response.COOKIES`。

	from bottle import response
	response.COOKIES['key'] = 'value'
	response.COOKIES['key']['max-age'] = 500

## 模板

Bottle 使用自带的小巧的模板。
你可以使用调用 `template(template_name, **template_arguments)` 并返回结果。

	@route('/hello/:name')
	def hello(name):
	    return template('hello_template', username=name)

这样就会加载 hello_template.tpl，并提取 `URL:name` 到变量 `username`，返回请求。

hello_template.tpl 大致这样:

	<h1>Hello {{username}}</h1>
	<p>How are you?</p>

### 模板搜索路径

模板是根据 `bottle.TEMPLATE_PATH` 列表变量去搜索。
默认路径包含 `['./%s.tpl', './views/%s.tpl']`。

### 模板缓存

模板在编译后在内存中缓存。
修改模板不会更新缓存，直到你清除缓存。
调用 `bottle.TEMPLATES.clear()`。

## 模板语法

模板语法是围绕 Python 很薄的一层。
主要目的就是确保正确的缩进块。
下面是一些模板语法的列子:

* `%...Python` 代码开始。不必处理缩进问题。Bottle 会为你做这些。
* %end 关闭一些语句 `%if` ...，`%for` ... 或者其他。关闭块是必须的。
* `{{...}}` 打印出 Python 语句的结果。
* `%include template_name optional_arguments` 包括其他模板。
* 每一行返回为文本。

Example:

	%header = 'Test Template'
	%items = [1,2,3,'fly']
	%include http_header title=header, use_js=['jquery.js', 'default.js']
	<h1>{{header.title()}}</h1>
	<ul>
	%for item in items:
	  <li>
	    %if isinstance(item, int):
	      Zahl: {{item}}
	    %else:
	      %try:
	        Other type: ({{type(item).__name__}}) {{repr(item)}}
	      %except:
	        Error: Item has no string representation.
	      %end try-block (yes, you may add comments here)
	    %end
	    </li>
	  %end
	</ul>
	%include http_footer

## Key/Value数据库

Bottle(>0.4.6) 通过 `bottle.db` 模块变量提供一个 key/value 数据库。
你可以使用 `key` 或者属性来来存取一个数据库对象。
调用 `bottle.db.bucket_name.key_name` 和 `bottle.db[bucket_name][key_name]`。

只要确保使用正确的名字就可以使用，而不管他们是否已经存在。

存储的对象类似 dict 字典，keys 和 values 必须是字符串。
不支持 `items()` 和 `values()` 这些方法。
找不到将会抛出 `KeyError`。

### 持久化

对于请求，所有变化都是缓存在本地内存池中。
在请求结束时，自动保存已修改部分，以便下一次请求返回更新的值。
数据存储在 `bottle.DB_PATH` 文件里。要确保文件能访问此文件。

### Race conditions

一般来说不需要考虑锁问题，但是在多线程或者交叉环境里仍是个问题。
你可以调用 `bottle.db.save()` 或者 `botle.db.bucket_name.save()` 去刷新缓存，
但是没有办法检测到其他环境对数据库的操作，直到调用 `bottle.db.save()` 或者离开当前请求。

Example

	from bottle import route, db
	@route('/db/counter')
	def db_counter():
	    if 'hits' not in db.counter:
	        db.counter.hits = 0
	    db['counter']['hits'] += 1
	    return "Total hits: %d!" % db.counter.hits

## 使用 WSGI 和中间件

`bottle.default_app()` 返回一个 WSGI 应用。
如果喜欢 WSGI 中间件模块的话，你只需要声明 `bottle.run()` 去包装应用，而不是使用默认的。

	from bottle import default_app, run
	app = default_app()
	newapp = YourMiddleware(app)
	run(app=newapp)

### 默认 default_app() 工作

Bottle 创建一个 `bottle.Bottle()` 对象和装饰器，调用 `bottle.run()` 运行。
`bottle.default_app()` 是默认。当然你可以创建自己的 `bottle.Bottle()` 实例。

	from bottle import Bottle, run
	mybottle = Bottle()
	@mybottle.route('/')
	def index():
	  return 'default_app'
	run(app=mybottle)

## 发布

Bottle 默认使用 `wsgiref.SimpleServer` 发布。
这个默认单线程服务器是用来早期开发和测试，但是后期可能会成为性能瓶颈。

有三种方法可以去修改:

* 使用多线程的适配器
* 负载多个 Bottle 实例应用
* 或者两者

### 多线程服务器

最简单的方法是安装一个多线程和 WSGI 规范的 HTTP 服务器比如 Paste, flup, cherrypy or fapws3 并使用相应的适配器。

	from bottle import PasteServer, FlupServer, FapwsServer, CherryPyServer
	bottle.run(server=PasteServer) # Example

如果缺少你喜欢的服务器和适配器，你可以手动修改 HTTP 服务器并设置 `bottle.default_app()` 来访问你的 WSGI 应用。

	def run_custom_paste_server(self, host, port):
	    myapp = bottle.default_app()
	    from paste import httpserver
	    httpserver.serve(myapp, host=host, port=port)

### 多服务器进程

一个 Python 程序只能使用一次一个 CPU，即使有更多的 CPU。
关键是要利用 CPU 资源来负载平衡多个独立的 Python 程序。

单实例 Bottle 应用，你可以通过不同的端口来启动(localhost:8080, 8081, 8082, ...)。
高性能负载作为反向代理和远期每一个随机瓶进程的新要求，平衡器的行为，传播所有可用的支持与服务器实例的负载。
这样，您就可以使用所有的 CPU 核心，甚至分散在不同的物理服务器之间的负载。

但也有点缺点:

* 多个 Python 进程里不能共享数据。
* 同一时间可能需要大量内存来运行 Python 和 Bottle 应用和副本。
* 最快的一个负载是 pound 当然其他一些 HTTP 服务器同样可以做的很好。

不久我会加入 lighttpd 和 Apache 使用。

### Apache mod_wsgi

发布你的应用当然不是用 Bottle 自带的方法，你可以再 Apache server 使用 mod_wsgi 模板和 Bottles WSGI 接口。

你需要建立 app.wsgi 文件并提供 application 对象。这个对象是用使用 mod_wsgi 启动你的程序并遵循 WSGI 规范可调用。

	# /var/www/yourapp/app.wsgi
	import bottle
	# ... add or import your bottle app code here ...
	# import myapp
	application = bottle.default_app()
	# Do NOT use bottle.run() with mod_wsgi

Apache 配置可能如下:

	<VirtualHost *>
	    ServerName example.com

	    WSGIDaemonProcess yourapp user=www-data group=www-data processes=1 threads=5
	    WSGIScriptAlias / /var/www/yourapp/app.wsgi

	    <Directory /var/www/yourapp>
	        WSGIProcessGroup yourapp
	        WSGIApplicationGroup %{GLOBAL}
	        Order deny,allow
	        Allow from all
	    </Directory>
	</VirtualHost>

### Google AppEngine

	import bottle
	from google.appengine.ext.webapp import util 
	# ... add or import your bottle app code here ...
	# import myapp
	# Do NOT use bottle.run() with AppEngine
	util.run_wsgi_app(bottle.default_app())

### CGI模式

运行缓缓，但可以正常工作。

	import bottle
	# ... add or import your bottle app code here ...
	bottle.run(server=bottle.CGIServer)

