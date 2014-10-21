---
layout: post
title: HTTP API 设计指南
keywords: web, http
category : web
tags : [web, http]
---

英文原文： [HTTP API Design Guide][1]  
本文译者： [LeoXu][2], [Garfielt][3], [无若][4], [--zxp][5]

******

## 介绍

本指南描述了一套有关 HTTP+JSON API 的设计实践, 原始内容提取自 [Heroku 平台 API][6] 的工作.

本指南是对API的补充，也是Heroku新的内部API的指南. 我们希望引起Heroku之外的API设计者的兴趣.

这里我们的目标是一致的，专注于业务逻辑而避免脱节的设计. 我们就是要寻找一个良好的，一致的，文档优良的方式来设计API，而没必要是唯一理想的方式.

我们假定你熟悉HTTP+JSON API的一些基础，不会再指南中涵盖所有基础性的东西.

我们欢迎为这一指南 [做出贡献][7].

## 返回适当的状态码

对于每一种响应返回适当的HTTP状态码. 成功的响应应该根据下面的指南编码:

 - 200: GET调用请求成功, 以及DELETE 或者 PATCH 调用同步完成
 - 201: 同步完成的POST调用请求成功
 - 202: 请求接受一个将会被同步处理的POST，DELETE或者PATCH调用
 - 206: GET请求成功，但只有部分响应返回: 见 [上述有关范围的内容][8]

请阅读指导有关用户错误和服务器错误情况的[状态码的HTTP 响应码文档][9]

## 提供可用的完整资源

尽可能在响应中提供完整的资源描述 (例如，带有所有属性的对象). 总是在200和201响应中提供完整的资源, 包括 PUT/PATCH 和 DELETE 请求, 例如:

    $ curl -X DELETE \  
      https://service.com/apps/1f9b/domains/0fd4

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=utf-8
    ...
    {
      "created_at": "2012-01-01T12:00:00Z",
      "hostname": "subdomain.example.com",
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "updated_at": "2012-01-01T12:00:00Z"
    }

202 响应不会包含完整的资源描述，例如:

    $ curl -X DELETE \  
      https://service.com/apps/1f9b/dynos/05bd

    HTTP/1.1 202 Accepted
    Content-Type: application/json;charset=utf-8
    ...
    {}

## 接受请求中序列化的JSON

接受PUT/PATCH/POST请求中的序列化JSON, 作为表单编码数据的替代或者补充. 这样就可以创建对称的JSON序列化响应，例如:


    $ curl -X POST https://service.com/apps \
        -H "Content-Type: application/json" \
        -d '{"name": "demoapp"}'

    {
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "name": "demoapp",
      "owner": {
        "email": "username@example.com",
        "id": "01234567-89ab-cdef-0123-456789abcdef"
      },
      ...
    }


## 提供资源 (UU)ID

默认给每一个资源都指定一个id. 除非你有更好的理由，不然就使用UUID. 不要使用在整个服务或者服务中其它资源那里不是全局唯一的ID, 特别是自增长的ID.

用小写 8-4-4-4-12 格式生成UUID，例如:

    "id": "01234567-89ab-cdef-0123-456789abcdef"


## 提供标准的时间戳

默认为资源提供创建和更新的时间戳，例如:

{% highlight json %}
{
  ...
  "created_at": "2012-01-01T12:00:00Z",
  "updated_at": "2012-01-01T13:00:00Z",
  ...}
{% endhighlight %}

这些时间戳可能对一些资源没啥用，如此则可以省去.

## 使用ISO8601中的UTC时间格式

只使用UTC接收和返回时间. 使用 ISO8601 格式来生成时间，例如:

    "finished_at": "2012-01-01T12:00:00Z"

## 使用一致的路径格式

### 资源名称

使用资源名称的复数形式，除非系统中相关的资源是唯一的(例如，在大多数系统，用户的账户永远都只能有一个). 这就能在你引用特定的资源时保持一致的方式.

### 操作

首选端点布局，因为它不需要对单独的资源有任何特殊的操作. 有些情况下是需要特殊操作的，那就把它们放在一个标准的前缀下，以清楚的界定它们:

    /resources/:resource/actions/:action

例如.

    /runs/{run_id}/actions/stop

### 小写的路径和属性

使用小写和用虚线符号分隔的路径名，便于同主机名对齐, 例如:

    service-api.com/users
    service-api.com/app-setups

属性同样也使用小写，但是使用下划线做分隔，那就属性名在Javascript中就可以不用引号了, 例如:

    service_class: "first"

### 内联外键关系

使用一个内联的对象来序列化外键引用，例如:


{% highlight json %}
{
  "name": "service-production",
  "owner": {
    "id": "5d8201b0..."
  },
  ...}
{% endhighlight %}


而不是如下例:


{% highlight json %}
{
  "name": "service-production",
  "owner_id": "5d8201b0...",
  ...}
{% endhighlight %}


这种方式使得在不必改变响应结构或者引入更多顶级响应域的前提下内联如更多相关资源的信息，例如:


{% highlight json %}
{
  "name": "service-production",
  "owner": {
    "id": "5d8201b0...",
    "name": "Alice",
    "email": "alice@heroku.com"
  },
  ...}
{% endhighlight %}


## 支持为方便起见的非id间接引用

在某些情况下对于端用户而言提供一个ID标志一个资源可能会方便些。例如，一个用户会需要一个Heroku应用名称，但那个应用时用UUID标识的。在这些情况下你可能想要同时接受名称和ID，例如:

    $ curl https://service.com/apps/{app_id_or_name}
    $ curl https://service.com/apps/97addcf0-c182
    $ curl https://service.com/apps/www-prod

不要只接受名称而排斥ID.

## 生成结构性的错误

使用一致的，结构化的错误响应. 包括一个依赖于机器的错误id，一个人类可读的错误消息，以及可选的一个指出有关该错误及如何解决的信息的url，例如:

    HTTP/1.1 429 Too Many Requests

    {
      "id":      "rate_limit",
      "message": "Account reached its API rate limit.",
      "url":     "https://docs.service.com/rate-limits"}


为你的错误格式，以及客户端可能会遇到的错误id编写文档.

## 支持使用Etag的缓存

在所有的响应中包含一个ETag头，以标识返回资源的特定版本. 用户就能够从If-None-Match头获取的值中检查出他们的后续请求的是否已经过时.

## 使用Request-Id跟踪请求

在每一个API响应中包含一个Request-Id头，填充一个UUID值。如果服务器和客户端都记录了这个值的话，它就能在跟踪和调试请求方面起到作用.

## 使用范围进行分页

对容易产生大量数据的响应进行分页. 使用 Content-Range 头来传送分页请求. 详细的可以看看 [Heroku 平台有关范围的API][10] 中的请求和响应头, 状态码, 限制，排序和分页浏览的示例.

## 展示速率限制状态

来自客户端的速率限制请求用以保护服务的健康，并为其它的客户端保持较高的服务质量. 你可以使用一种 [令牌桶算法][11] 来量化请求限制.

可以在RateLimit-Remaining响应头中返回每个请求的剩余请求令牌数量.

## 带有版本的接收头

从一开始就要对API进行版本话。使用接收头，以及一个自定义内容类型来同版本进行交互，例如:

    Accept: application/vnd.heroku+json; version=3

不去指定一个默认的版本，而不是要求客户端明确指定它们要使用一个特定的版本.

## 最小化路径内联

在带有内联父/子资源关系的数据模型中，路径可能会内联得很深，例如:

    /orgs/{org_id}/apps/{app_id}/dynos/{dyno_id}

可以通过在根路径定位资源来限制内联深度. 使用内联来指定范围集合.例如，上述情况中一个dyno就属于一个属于org的app:

    /orgs/{org_id}
    /orgs/{org_id}/apps
    /apps/{app_id}
    /apps/{app_id}/dynos
    /dynos/{dyno_id}

## 提供机器可读的JSON模式

提供一个机器可读的模式可以精确的指定你的API。使用 prmd 来管理你的模式，并确保它能被prmd verify验证.

## 提供人类可读的文档

提供客户端开发者可以用来理解你的API的人类可读文档.

如果你使用prmd创建了一个如上所述的模式，那么你就可以很容易的使用prmd doc来为所有的端点生成Markdown文档.

除了端点的详细信息之外，还要提供API概述的一些信息:

 - 认证，包括获取和使用认证令牌.
 - API 稳定性和版本，包括如何选择理想的API版本.
 - 通用的请求和响应头.
 - 错误的序列化格式.
 - 用不同的语言使用API的客户端的示例.

## 提供可执行的示例

提供可执行的示例，用户可以直接在终端中敲入命令来查看API的调用如何运行. 为了尽可能的扩展，这些示例应该要可以照字面意义使用，以最小化用户尝试这些API所需要做的事情，例如:

    $ export TOKEN=... # acquire from dashboard
    $ curl -is https://$TOKEN@service.com/users

如果你使用 [prmd][12] 生成了Markdown文档，你就将可以不费力的获得每一个端点的示例.

## 稳定性描述

描述API的稳定性或者依据其成熟性和稳定性的各个点，例如：以原型/开发/成品作为标志节点。

查看[Heroku API兼容性策略][13]为稳定性和变更管理方法提供一种可能。

一旦你的API被定义为是为生产所准备的和坚固的，那当API版本改变的时候，要使得这些API能有向后的兼容性。在创建一个新的API时，如果你需要做向后不兼容的变更，应增加版本号。

## SSL需求

无一例外，要SSL去访问API时，无论用不用SSL，都不必找出以及解释其原因，它们就是需要SSL。

## 良好打印的默认json

用户第一次查看你的api很可能是在使用curl的命令行里。如果API的响应有良好的打印格式，那在命令行里它们会很容易理解。为了给这些开发者提供方便，良好打印格式的JSON如下：


    {
      "beta": false,
      "email": "alice@heroku.com",
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "last_login": "2012-01-01T12:00:00Z",
      "created_at": "2012-01-01T12:00:00Z",
      "updated_at": "2012-01-01T12:00:00Z"}


而不是：


    {"beta":false,"email":"alice@heroku.com","id":"01234567-89ab-cdef-0123-456789abcdef","last_login":"2012-01-01T12:00:00Z", "created_at":"2012-01-01T12:00:00Z","updated_at":"2012-01-01T12:00:00Z"}


要确保在JSON结尾有换行，以防止阻塞用户的终端界面。

对于大部分API的响应，性能考滤要优先于良好打印。在某些结点（例如高流量结点）或为某些特定用户（例如无GUI界面的程序）使用时，你可能会考滤使用高性能而非良好打印的API。

注：headless program译为“无显示界面的程序”，参考自[这篇文章][14].


  [1]: https://github.com/interagent/http-api-design
  [2]: http://my.oschina.net/xuleo
  [3]: http://my.oschina.net/Garfielt
  [4]: http://my.oschina.net/crooner
  [5]: http://my.oschina.net/u/578360
  [6]: https://devcenter.heroku.com/articles/platform-api-reference
  [7]: https://github.com/interagent/http-api-design/blob/master/CONTRIBUTING.md
  [8]: https://github.com/interagent/http-api-design#paginate-with-ranges
  [9]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
  [10]: https://devcenter.heroku.com/articles/platform-api-reference#ranges
  [11]: http://en.wikipedia.org/wiki/Token_bucket
  [12]: https://github.com/interagent/prmd
  [13]: https://devcenter.heroku.com/articles/api-compatibility-policy
  [14]: http://www.developertesting.com/archives/month200508/20050823-HeadlessHelloWorldInEclipse.html
