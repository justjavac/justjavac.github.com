---
layout: post
title: Laravel 5.0 的新特性
description: Laravel 5.0 引入了一个新鲜的应用架构到默认的 Laravel 项目中，这个架构会提供更好的 Laravel 应用的服务。同时还加入了新的自动加载标准 (PSR-4) 。
keywords: php, Laravel
category: php
tags: [php, Laravel]
---

原文： http://laravel.com/docs/master/releases#laravel-5.0  
译文： http://discuss.flarum.org.cn/24-laravel-5  
译者： [flarum](http://discuss.flarum.org.cn)

Laravel 5.0 包括超过 [22 个新特性](https://laravel-news.com/2015/01/laravel-5/)。

Laravel 5.0 引入了一个新鲜的应用架构到默认的 Laravel 项目中，这个架构会提供更好的 Laravel 应用的服务。同时还加入了新的自动加载标准 (PSR-4) 。主要改进如下：

## 1. 新的文件夹结构

原有的 `app/models` 目录已全部删除。相反，你所有的代码，直接放在 `app` 文件夹中，并且，默认情况下使用 App 命名空间。这个默认命名空间可以很方便的使用 `app:name` Artisan 命令更换为其他名字。

控制器，中间件，和请求（Laravel 5.0 中新增的类型）现在放到了 `app/Http` 目录下，因为在你的应用程序中，这些都是负责 HTTP 传输层相关的类。所有的路由过滤器，所有的中间件，都放到了它们自己的类文件中，而不是像以前那样放在单独的一个文件里。

app/Providers 目录替换了Laravel 4.X 的 `app/start` 文件。这些服务提供者（Service Provider）为您的应用程序提供不同的引导功能，例如错误处理，日志，路由加载，等等。当然，你可以自行为应用程序创建其它的 Service Provider。

语言文件和视图被移到了 `resources` 目录。

## 2. Contracts

所有主要的 Laravel 组件实现接口都放在 `illuminate/contracts` 库，没有外部依赖。

关于 contracts 的更多信息，可以查看 [contracts 文档](http://laravel.com/docs/master/contracts)。

## 3. 路由缓存

如果你的应用程序使用的控制器路由，你可以使用 `route:cache Artisan` 命令加速你的路由表。如果你的应用程序使用了超过 100 个路由，那么这个性能提升是非常显著的。

## 4. 路由中间件

除了 Laravel 4 风格的路由 "filters"， Laravel 5 支持 HTTP 中间件，而且包含认证和 CSRF 功能的 "filters" 也已经转换为了中间件。中间件提供了单一的，一致的接口来取代所有类型的过滤器，在 Request 进入你的应用程序之前，允许您轻松地检查，甚至拒绝它们。

想了解中间件的更多信息，查看 [Middleware 文档](http://laravel.com/docs/master/middleware)。

## 5. 控制器方法注入

除了现有的构造函数注入，你现在可以使用[类型约束](http://php.net/manual/zh/language.oop5.typehinting.php)特性来指定控制器的依赖。[IOC 容器](http://laravel.com/docs/master/container)会自动注入依赖，即使路由包含了其他参数：

```php
public function createPost(Request $request, PostRepository $posts)
{
    //
}
```

## 6. Authentication 脚手架

在 `resources/views/auth` 中，为以下控制器，包括用户注册，认证，和密码重置，提供了开箱即用功能，而且包含了简单的视图。此外，框架还包括了 "users" 表的迁移。这样就可以快速开发出应用程序想要实现的功能，而不用将精力浪费在认证模块上。认证功能的视图可以通过 `auth/login` 和 `auth/register` 访问。`App\Services\Auth\Registrar` 负责用户验证和创建。

## 7. Event Objects

你现在可以将事件定义为对象，而不是简单地使用字符串。例如，看看下面的事件：

```php
class PodcastWasPurchased {

    public $podcast;

    public function __construct(Podcast $podcast)
    {
        $this->podcast = $podcast;
    }

}
```

事件 dispatched：

```php
Event::fire(new PodcastWasPurchased($podcast));
```

当然，事件处理程序接收到的是事件对象，而不是数据列表：

```php
class ReportPodcastPurchase {

    public function handle(PodcastWasPurchased $event)
    {
        //
    }

}
```

想了解更多关于事件处理的信息，查看 [Event 文档](http://laravel.com/docs/master/events)。

## 8. 命令 / 队列

除了 Laravel 4 支持的 job 格式的队列，Laravel 5 允许你把队列作为简单的 command 对象。这些命令在 `app/Commands` 目录里。以下的命令示例：

```php
class PurchasePodcast extends Command implements SelfHandling, ShouldBeQueued {

    use SerializesModels;

    protected $user, $podcast;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(User $user, Podcast $podcast)
    {
        $this->user = $user;
        $this->podcast = $podcast;
    }

    /**
     * Execute the command.
     *
     * @return void
     */
    public function handle()
    {
        // Handle the logic to purchase the podcast...

        event(new PodcastWasPurchased($this->user, $this->podcast));
    }

}
```

Laravel 控制器使用新的 `DispatchesCommands` 特性，让你轻松的执行命令调度：

```php
$this->dispatch(new PurchasePodcastCommand($user, $podcast));
```

当然，你也可以使用 command 方式（无队列）。事实上，对于负责的任务，使用 command 是非常好的方法。更多信息，查看 [command bus 文档](http://laravel.com/docs/master/bus)。

## 9. 数据库队列

现在 Laravel 新增了数据库队列驱动，提供一个简单的，本地队列驱动，不需要额外的安装包。

【其它新特性正在翻译中...】
