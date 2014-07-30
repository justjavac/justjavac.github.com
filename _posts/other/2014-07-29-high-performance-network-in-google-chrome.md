---
layout: post
title: Google Chrome 中的高性能网络
categories: [other]
tags: [Chrome, 性能]
---

## 一、Google Chrome 的历史和指导原则

【译注】这部分不再详细翻译，只列出核心意思。

驱动 Chrome 继续前进的核心原则包括:

* Speed: 做最快的(fastest)的浏览器。
* Security: 为用户提供最为安全的(most secure)的上网环境。
* Stability: 提供一个健壮且稳定的(resilient and stable)的 Web 应用平台。
* Simplicity: 以简练的用户体验(simple user experience)封装精益求精的技术(sophisticated technology)。

本文关将注于第一点，速度。

### 1.1 关于性能的方方面面

一个现代浏览器就是一个和操作系统一样的平台。
在 Chrome 之前的浏览器都是单进程的应用，所有页面共享相同的地址空间和资源。
引入多进程架构这是 Chrome 最为著名的改进【译注:省略一些反复谈论的细节】。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_1c3ce373.png" alt="">

一个进程内，Web 应用主要需要执行三个任务：获取资源，页面 排版及渲染，和运行 JavaScript。
渲染和脚本都是在运行中交替以单线程的方式运行的，其原因是为了保持 DOM 的一致性，而 JavaScript 本 身也是一个单线程的语言。
所以优化渲染和脚本运行无论对于页面开发者还是浏览器开发者都是极为重要的。

Chrome 的渲染引擎是 WebKit, JavaScript Engine 则使用深入优论的 V8 (<a href="http://en.wikipedia.org/wiki/V8_(JavaScript_engine)">“V8″ JavaScript runtime</a>)。
<strong>但是，如果网络不畅，无论优化 V8 的 JavaScript 执行，还是优化 WebKit 的解析和渲染，作用其实很有限。
巧妇难为无米之炊，数据没来就得等着!</strong>

相对于用户体验，作用最为明显的就是如何优化网络资源的加载顺序、优先级及每一个资源的延迟时间(latency)。
也许你察觉不到，Chrome 网络模块每天都在进步，逐步降低每个资源的加载成本：向 DNS lookups 学习，记住页面拓扑结构(topology of the web), 预先连接可能的目标网址，等等，还有很多。
从外面来看就是一个简单的资源加载的机制，但在内部却是一个精彩的世界。

### 1.2 关于 Web 应用

开始正题前，还是先来了解一下现在网页或者 Web 应用在网络上的需求。

HTTP Archive 项目一直在追踪网页构建。
除了页面内容外，它还会分析流行页面使用的资源数量，类型，头信息以及不同目标地址的元数据(metadata)。
下面是 2013 年 1 月的统计资料，由 300,000 目标页面得出的平均数据:

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m52ecc48a.png" alt="">

* 1280 KB
* 包含 88 个资源(Images,JavaScript,CSS …)
* 连接 15 个以上的不同主机(distinct hosts)

这些数字在过去几年中一直持续增长(<a href="http://httparchive.org/trends.php">steadily increasing</a>)，没有停下的迹象。
这说明我们正不断地建构一个更加庞大的、野心勃勃的网络应用。
还要注意，平均来看每个资源不过 12KB, 表明绝大多数的网络传输都是短促(short and bursty)的。
这和 TCP 针对大数据、流式(streaming)下载的方向不一致，正因为如此，而引入了一些并发症。

下面就用一个例子来抽丝剥茧，一窥究竟……

### 1.3 一个 Resource Request 的一生

W3C 的<a href="http://www.w3.org/TR/navigation-timing/">Navigation Timing specification</a>定义了一组 API，可以观察到浏览器的每一个请求(request)的时序和性能数据。
下面了解一些细节:

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m69436d46.png" alt="">

给定一个网页资源地址后，浏览器就会检查本地缓存和应用缓存。
如果之前获取过并且有相应的缓存信息(<a href="https://developers.google.com/speed/docs/best-practices/caching">appropriate cache headers</a>)(如 Expires, Cache-Control, etc.), 就会用缓存数据填充这个请求，毕竟最快的请求就是没有请求(<strong>the fastest request is a request not made</strong>)。
否则，我们重新验证资源，如果已经失效(expired)，或者根本就没见过，一个耗费网络的请求就无法避免地发送了。

给定了一个主机名和资源路径后，Chrome 先是检查现有已建立的连接(existing open connections)是否可以复用, 即 sockets 指定了以(scheme、host 和 port)定义的连接池(pool)。
但如果配置了一个代理，或者指定了<a href="http://en.wikipedia.org/wiki/Proxy_auto-config">proxy auto-config</a>(PAC)脚本，Chrome 就会检查与 proxy 的连接。
PAC 脚本基于 URL 提供不同的代理，或者为此指定了特定的规则。
与每一个代理间都可以有自己的 socket pool。
最后，上述情况都不存在，这个请求就会从 DNS 查询(DNS lookup)开始了，以便获得它的 IP 地址。

幸运的话，这个主机名已经被缓存过。
否则，必须先发起一个 DNS Query。
这个过程所需的时间和 ISP，页面的知名度，主机名在中间缓存(intermediate caches)的可能性，以及 authoritative servers 的响应时间这些因素有关。
也就是说这里变量很多，不过一般还不致于到几百毫秒那么夸张。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_15238f79.png" alt="">

拿到解析出的 IP 后，Chrome 就会在目标地址间打开一个新 TCP 连接，我们就要执行一个 3 度握手(<a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol#Connection_establishment">“three-way handshake”</a>): SYN &gt; SYN-ACK &gt; ACK。
这个操作每个新的 TCP 连接都必须完成，没有捷径。
根据远近，路由路径的选择，这个过程可能要耗时几百毫秒，甚至几秒。
而到现在，我们连一个有效的字节都还没收到。

当 TCP 握手完成了，如果我们连接的是一个 HTTPS 地址，还有一个 SSL 握手过程，同时又要增加最多两轮的延迟等待。
如果 SSL 会话被缓存了，就只需一次。

最后，Chrome 终于要发送 HTTP 请求了 (如上面图示中的 requestStart)。
服务器收到请求后，就会传送响应数据(response data)回到客户端。
这里包含最少的往返延迟和服务的处理时间。
然后一个请求就完成了。
但是，如果是一个 HTTP 重定向(redirect)的话？
我们又要从头开始这个过程。
如果你的页面里有些冗余的重定向，最好三思一下！

你得出所有的延迟时间了吗? 
我们假设一个典型的宽带环境：没有本地缓存，相对较快的 DNS lookup(50ms), TCP 握手，SSL 协商，以及一个较快服务器响应时间(100ms)和一次延迟(80ms,在美国国内的平均值):

* 50ms for DNS
* 80ms for TCP handshake (one RTT)
* 160ms for SSL handshake (two RTT’s)
* 40ms （发送请求到服务器）
* 100ms (服务器处理)
* 40ms (服务器回传响应数据)

一个请求花了 470 毫秒, 其中 80% 的时间被网络延迟占去了。
看到了吧，我们真得有很多事情要做！
事实上，470 毫秒已经很乐观了:

* 如果服务器没有达到到初始 TCP 的拥塞窗口(<a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol#Congestion_control">congestion window</a>)，即 4-15KB，就会引入更多的往返延迟。
* SSL 延迟也可能变得更糟。如果需要获取一个没有的认证(certificate)或者执行<a href="http://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol">online certificate status check</a>(OCSP), 都会让我们需要一个新的 TCP 连接，又增加了数百至上千毫秒的延迟。

### 1.4 怎样才算”够快”?

前面可以看到服务器响应时间仅是总延迟时间的 20%，其它都被 DNS，握手等操作占用了。
过去用户体验研究(<a href="http://www.useit.com/papers/responsetime.html">user experience research</a>)表明用户对延迟时间的不同反应：

* 0 – 100ms 迅速
* 100 – 300ms 有点慢
* 300 – 1000ms 机器还在运行
* 1s+ 想想别的事……
* 10s+ 我一会再来看看吧……

上表同样适用于页面的性能表现: 渲染页面，至少要在 250ms 内给个回应来吸引住用户。
这就是简单地针对速度。
从 Google, Amazon, Microsoft 以及其它数千个站点来看，额外的延迟直接影响页面表现：流畅的页面会吸引更多的浏览、以及更强的用户吸引力(engagement) 和页面转换率(conversion rates).

现在我们知道了理想的延迟时间是 250ms，而前面的示例告诉我们，DNS Lookup, TCP 和 SSL 握手，以及 request 的准备时间花去了 370ms, 即便不考虑服务器处理时间，我们也超出了 50%。

对于绝大多数的用户和网页开发者来说，DNS，TCP，以及 SSL 延迟都是透明，很少有人会想到它。
这也就是为什么 Chrome 的网络模块那么的复杂。

**我们已经识别出了问题，下面让我们深入一下实现的细节**…

---------------------------------------------

## 二、深入Chrome的网络模块

### 2.1 多进程架构

Chrome 的多进程架构为浏览器的网络请求处理带来了重要意义，它目前支持四种不同的执行模式(<a href="http://www.chromium.org/developers/design-documents/process-models">four different execution models</a>)。

默认情况下，桌面的 Chrome 浏览器使用 process-per-site 模式, 将不同的网站页面隔离起来, 相同网站的页面组织在一起。
举个简单的例子: 每个 tab 独立一个进程。
从网络性能的角度上说,并没什么本质上的不同，只是 process-per-tab 模式更易于理解。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_2a26bf4c.png" alt="">

每一个 tab 有一个渲染进程(render process)，其中包括了用于解析页面(interpreting)和排版(layout out)的 WebKit 的排版引擎(layout engine), 即上图中的 HTML Render。
还有 V8 引擎和两者之间的 DOM Bindings，如果你对这部分很好奇，可以看这里(<a href="http://www.chromium.org/developers/design-documents/multi-process-architecture">great introduction to the plumbing</a>)。

每一个这样的渲染进程被运行在一个沙箱环境中，只会对用户的电 脑环境做极有限的访问–包括网络。
而使用这些资源，每一个渲染进程必须和浏览内核进程(browser[kernel] process)沟通，以管理每个渲染进程的安全性和访问策略(access policies)。

### 2.2 进程间通讯(IPC)和多进程资源加载

渲染进程和内核进程之间的通讯是通过 IPC 完成的。
在 Linux 和 Mac OS 上，使用了一个提供异步命名管道通讯方式的 socketpair()。
每一个渲染进程的消息会被序列化地到一个专用的 I/O 线程中，然后再由它发到内核进程。
在接收端，内核进程提供一个过滤接口(filter interface)用于解析资源相关的 IPC 请求(<a href="http://code.google.com/p/chromium/source/search?q=resourcemessagefilter&amp;origq=resourcemessagefilter&amp;btnG=Search+Trunk">ResourceMessageFilter</a>), 这部分就是网络模块负责的。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_20604ec0.png" alt="">

这样做其中一个好处是所有的资源请求都由 I/O 进程处理，无论是 UI 产生的活动，或者网络事件触发的交互。
在内核进程(browser/kernel process)的 I/O 线程解析资源请求消息，将转发到一个 <a href="http://code.google.com/searchframe#OAMlx_jo-ck/src/content/public/browser/resource_dispatcher_host.h&amp;exact_package=chromium&amp;q=ResourceDispatcherHost">ResourceDispatcherHost</a> 的单例(singleton)对象中处理。

这个单例接口允许浏览器控制每个渲染进程对网络的访问，也能达到有效和一致的资源共享：

* <strong>Socket pool 和 connection limits</strong>: 浏览器可以限定每一个 profile 打开 256 个 sockets, 每个 proxy 打开 32 个 sockets, 而每一组{scheme, host, port}可以打开 6 个。注意同时针对一组{host,port}最多允计打开 6 个 HTTP 和 6 个 HTTPS 连接。
* <strong>Socket reuse</strong>: 在 Socket Pool 中提供持久可用的 TCP connections，以供复用。这样可以为新的连接避免额外建立 DNS、TCP 和 SSL (如果需要的话)所花费的时间。
* <strong>Socket late-binding(延迟绑定)</strong>: 网络请求总是当 Scoket 准备好发送数据时才与一个 TCP 连接关连起来，所以首先有机会做到对请求有效分级(prioritization)，比如，在 socket 连接过程中可能会到达到一个更高优先级的请求。同时也可以有更好的吞吐率(throughput),比如，在连接打开过程中，去复用一个刚好 可用的 socket, 就可以使用到一个完全可用的 TCP 连接。其实传统的 TCP pre-connect(预连接)及其它大量的优化方法也是这个效果。
* <strong>Consistent session state(一致的会话状态)</strong>: 授权、cookies 及缓存数据会在所有渲染进程间共享。
* <strong>Global resource and network optimizations(全局资源和网络优化)</strong>: 浏览器能够在所有渲染进程和未处理的请求间做更优的决策。比如给当前 tab 对应的请求以更好的优先级。
* <strong>Predictive optimizations（预测优化）</strong>: 通过监控网络活动，Chrome 会建立并持续改善预测模型来提升性能。
* … 项目还在增加中。

单就一个渲染进程而言, 透过 IPC 发送资源请求很容易，只要告诉浏览器内核进程一个唯一 ID, 后面就交给内核进程处理了。

### 2.3 跨平台的资源加载

跨平台也是 Chrome 网络模块的一个主要考量，包括 Linux, Windows, OS X, Chrome OS, Android 和 iOS。 为此，网络模块尽量实现成了单进程模式（只分出了独立的cache和proxy进程）的跨平台函数库, 这样就可以在平台间共用基础组件(infrastructure)并分享相同的性能优化，更有机会做到同时为所有平台进行优化。

相关的代码可以在这里找到<a href="https://code.google.com/p/chromium/codesearch#chromium/src/net/&amp;ct=rc&amp;cd=1&amp;q=src.net&amp;sq=package:chromium">the “src/net” subdirectory</a>)。本文不会详细展开每个组件，不过了解一下代码结构可以帮助我们理解它的能力结构。 比如:

* net/android 绑定到 Android 运行时(runtime) [译注(Horky)：运行时真是一个很烂的术语，翻和没翻一样。]
* net/base 公共的网络工具函数。比如主机解析， cookies，网络转换侦测(network change detection)，以及 SSL 认证管理
* net/cookies 实现了 Cookie 的存储、管理及获取
* net/disk_cache 磁盘和内存缓存的实现
* net/dns 实现了一个异步的 DNS 解析器(DNS resolver)
* net/http 实现了 HTTP 协议
* net/proxy 代理(SOCKS 和 HTTP)配置、解析(resolution) 、脚本抓取(script fetching), …
* net/socket TCP sockets，SSL streams 和 socket pools 的跨平台实现
* net/spdy 实现了 SPDY 协议
* net/url_request URLRequest, URLRequestContext 和 URLRequestJob 的实现
* net/websockets 实现了 WebSockets 协议

上面每一项都值得好好读读，代码组织的很好，你还会发现大量的单元测试。

### 2.4 Mobile 平台上的架构和性能

移动浏览器正在大发展，Chrome 团队也视优化移动端的体验为最高优先级。
先要说明的是移动版的 Chrome 的并不是其桌面版本的直接移植，因为那样根本不会带来好的用户体验。
移动端的先天特性就决定了它是一个资源严重受限的环境，在运行参数有一些基本的不同:

* 桌面用户使用鼠标操作，可以有重叠的窗口，大的屏幕，也不用担心电池。网络也非常稳定，有大量的存储空间和内存。
* 移动端的用户则是触摸和手势操作，屏幕小，电池电量有限，通过只能用龟速且昂贵的网络，存储空间和内存也是相当受限。

再者，不但没有典型的样板移动设备，反而是有一大批各色硬件的设备。
Chrome 要做的，只能是设法兼容这些设备。
好在 Chrome 有不同的运行模式(execution models)，面对这些问题，游刃有余！

<strong>在 Android 版本上，Chrome 同样运用了桌面版本的多进程架构</strong>。
一个浏览器内核进程，以及一个或多个渲染进程。
但因为内存的限制，移动版的 Chrome 无法为每一个 tabl 运行一个特定的渲染进程，而是根据内存情况等条件决定一个最佳的渲染进程个数，然后就会在多个 tab 间共享这些渲染进程。

如果内存实在不足，或其它原因导致 Chrome 无法运行多进程，它就会切到单进程、多线程的模式。
比如在 iOS 设备上，因为其沙箱机制的限制，Chrome 只能运行在这种模式下。

关于网络性能，首先 Chrome 在 Android 和 iOS 使用的是 各其它平台相同的网络模块。
这可以做到跨平台的网络优化，这也是 Chrome 明显领先的优势之一。
所不同的是需要经常根据网络情况和设备能力进行些调整， 包括推测优化(speculative optimization)的优先级、socket 的超时设置和管理逻辑、缓存大小等。

比如，为了延长电池寿命，移动端的 Chrome 会倾向于延迟关闭空闲的 sockets (lazy closing of idle sockets), 通常是为了减少信号(radio)的使用而在打开新的 socket 时关闭旧的。
另外因为预渲染(pre-rendering，稍后会介绍)会使用一定的网络和处理资源，它通常只在 WiFi 才会使用。

关于移动浏览体验会独立一章，也许就在 POSA 系列的下一期。

### 2.5 Chrome Predictor 的预测功能优化

<strong>Chrome会随着使用变得更快</strong>。
它这个特性是通过一个单例对象 Predictor 来实现的。
这个对象在浏览器内核进程(Browser Kernel Process)中实例化，它唯一的职责就是观察和学习当前网络活动方式，提前预估用户下一步的操作。

下面是一个示例：

* 用户将鼠标停留在一个链接上，就预示着一个用户的偏好以及下一步的浏览行为。这时 Chrome 就可以提前进行 DNS Lookup 及 TCP 握手。用户的点击操作平均需要将近 200ms，在这个时间就可能处理完 DNS 和 TCP 相关的操作, 也就是省去几百毫秒的延迟时间。
* 当在地址栏(Omnibox/URL bar) 触发高可能性选项时，就同样会触发一个 DNS lookup 和 TCP 预连接(pre-connect)，甚至在一个不可见的页签中进行预渲染(pre-render)!
* 我们每个人都一串天天会访问的网站, Chrome 会研究在这些页面上的子资源, 并且尝试进行预解析(pre-resolve), 甚至可能会进行预加载(pre-fetch)以优化浏览体验。

除了上面三项，还有很多..

Chrome 会在你使用过程中学习 Web 的拓扑结构，而不单单是你的浏览模式。
理想的话，它将为你省去数百毫秒的延迟，更接近于即时页面加载的状态。
正是为了这个目标，Chrome 投入了以下的核心优化技术:

* DNS 预解析(pre-resolve)：提前解析主机地址，以减少 DNS 延迟
* TCP 预连接(pre-connect)：提前连接到目标服务器，以减少 TCP 握手延迟
* 资源预加载(prefetching)：提前加载页面的核心资源，以加载页面显示
* 页面预渲染(prerendering)：提前获取整个页面和相关子资源，这样可以做到及时显示

每一个决策都包含着一个或多个的优化，用来克服大量的限制因素。
不过毕竟都只是预测性的优化策略，如果效果不理想，就会引入多余的处理和网络传输。
甚至可能会带来一些加载时间上的负体验。

Chrome 如何处理这些问题呢? 
Predictor 会尽量收集各种信息，诸如用户操作，历史浏览数据，以及来自渲染引擎(render)和网络模块自身的信息。

和 Chrome 中负责网络事务调度的 ResourceDispatcherHost 不同，Predictor 对象会针对用户和网络事务创建一组过滤器(filter):

* IPC channel filter 用来监控来自 render 进程的事务。
* 每个请求上都会加一个 ConnectInterceptor 对象，这样就可以跟踪网络传输的模式以及每一个请求的度量数据。

渲染进程(render process)会在一系列的事件下发送消息到浏览器进程(browser process), 这些事件被定义在一个枚举(ResolutionMotivation)中以便于使用 (<a href="https://src.chromium.org/chrome/trunk/src/chrome/browser/net/url_info.h">url_info.h</a>):

    enum ResolutionMotivation {
        MOUSE_OVER_MOTIVATED,     // 鼠标悬停.
        OMNIBOX_MOTIVATED,        // Omni-box建议进行解析.
        STARTUP_LIST_MOTIVATED,   // 这是在前10个启动项中的资源.
        EARLY_LOAD_MOTIVATED,     // 有时需要使用prefetched来提前建立连接.

        // 下面定义了预加载评估的方式，会由一个navigation变量指定.
        // referring_url_也需要同时指定.
        STATIC_REFERAL_MOTIVATED,  // 外部数据库(External Database)建议进行解析。
        LEARNED_REFERAL_MOTIVATED, // 前一次浏览(prior navigation建议进行解析.
        SELF_REFERAL_MOTIVATED,    // 猜测下一个连接是不是需要进行解析.

        // <略> ...
    };

通过这些给定的事件，Predictor 的目标就可以评估它成功的可能性, 然后再适时触发操作。
每一项事件都有其成功的机率、优先级以及时间戳，这些可以在内部维护一个用优先级管理的队列，也是优化的一个手段。
最终，对于这个队 列中发出的每一个请求的成功率，都可以被 Predictor 追踪到。
基于这些数据，Predictor 就可以进一步优化它的决策。

### 2.6 Chrome网络架构小结

* Chrome 使用多进程架构，将渲染进程同浏览器进程隔离开来。
* Chrome 维护着一个资源分发器的实例(a single instance of the resource dispatcher), 它运行在浏览器内核进程，并在各个渲染进程间共享。
* 网络层是跨平台的，大部分情况下以单进程库存在。
* 网络层使用非阻塞式(no-blocking)操作来管理所有网络任务。
* 共享的网络层支持有效的资源排序、复用、并为浏览器提供在多进程间进行全局优化的能力。
* 每一个渲染进程通过IPC和资源分发器(resource dispatcher)通讯。
* 资源分发器(Resource dispatcher)通过自定义的 IPC Filter 解析资源请求。
* Predictor 在解析资源请求和响应网络事务中学习，并对后续的网络请求进行优化。
* Predictor 会根据学习到的网络事务模式预测性的进行 DNS 解析, TCP 握手，甚至是资源请求，为用户实际操作时节省数百毫秒的时间。

了解晦涩的内部细节后，让我们来看一下用户可以感受到的优化。
一切从全新的 Chrome 开始。

---------------------------------------

## 三、优化冷启动(Cold-Boot)体验

第一次启动浏览器，它当然不可能了解你的使用习惯和喜欢的页面。
但事实上，我们大多数会在浏览器的冷启动后做些类似的事情，比如到电子邮箱查看邮件，加一些新闻页面、社交页面及内部 页面到我的最爱，诸如此类。
这些页面各有不同，但它们仍然具有一些相似性，所以 Predictor 仍然可以对这个过程提速。

<strong>Chrome 记下了用户在全新启动浏览器时最常用的 10 个域名</strong>。
当浏览器启动时，Chrome 会提前对这些域名进行 DNS 预解析。
你可以在 Chrome 中使用 `chrome://dns` 查看到这个列表。
在打开页面的最上面的表格中会列出启动时的备选域名列表。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m279ce803.png" alt="">

### 3.1 通过Omnibox优化与用户的交互

引入 Omnibox 是 Chrome 的一项创新, 并不是简单地处理目标的 URL。
除了记录之前访问过的页面 URL，它还与搜索引擎的整合，并且支持在历史记录中进行全文搜索(比如，直接输入页面名称)。

当用户输入时，Omnibox 自动发起一个行为，要么查找浏览记录中的 URL, 要么进行一次搜索。
每一次发起的操作都会被加以评分，以统计它的性能。
你可以在 Chrome 输入 `chrome://predictors` 来观察这些数据。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_3b2cf205.png" alt="">

<strong>Chrome 维护着一个历史记录，内容包括用户输入的前置文字，采用的行为，以命中的资数。</strong>在上面的列表，你可以看到，当输入 `g` 时，有 76% 的机会尝试打开 Gmail. 如果再补充一个 `m` (就是 `gm`), 打开 Gmail 的可能性增加到 99.8%。

那么网络模块会做什么呢？
上表中的黄色和绿色对于 ResourceDispatcher 非常重要。
如果有一个一般可能性的页面(黄色), Chrome 就是发起 DNS 预解析。
如果有一个高可能性的页面(绿色)，Chrome 还会在 DNS 解析后发起 TCP 预连接。
如果这两项都完成了，用户仍然继续录入，Chrome 就会在一个隐藏的页签进行预渲染(pre-render)。

相对的，如果输入的前置文字找不到合适的匹配项目，Chrome 会向搜索引擎服务者发起 DNS 预解析和 TCP 预连，以获取相似的搜索结果。

<strong>平均而言用户从填写查询内容到评估给出的建议需要花费数百毫秒。</strong>此时 Chrome 可以在后台进行预解析，预连接，甚至进行预渲染。
再当用户准备按下回车键时，大量的网络延迟已经被提前处理掉了。

### 3.2 优化缓存性能

最快的请求就是没有请求。
无论何时讨论性能，都不能不谈缓存。
相信你已经为页面上所有资源的都提供了 Expires, ETag, Last-Modified 和 Cache-Control 这些响应头信息(<a href="https://developers.google.com/speed/docs/best-practices/caching">response headers</a>)。
什么? 还没有？那你还是先处理好再来看吧!

Chrome 有两种不同的内部缓存的实现：一种备份于本地磁盘(local disk)，另一种则存储于内存(in-memory)中。
内存模式(in-memory)主要应用于无痕浏览模式(<a href="http://support.google.com/chrome/bin/answer.py?hl=en&amp;answer=95464"><strong>Incognito browsing mode</strong></a>)，并在关闭窗口清除掉。
两种方式使用了相同的内部接口(`disk_cache::Backend` 和 `disk_cache::Entry`)，大大简化了系统架构。
如果你想实现一个自己的缓存算法，可以很容易地实现进去。

在内部，磁盘缓存(disk cache)实现了它自己的一组数据结构, 它们被存储在一个单独的缓存目录里。
其中有索引文件(在浏览器启动时加载到内存中)，数据文件(存储着实际数据，以及 HTTP 头以及其它信息)。
比较有趣的是，16KB 以下的文件存储于共同的数据块文件中(data block-files，即小文件集中存储于一个大文件中)，其它较大的文件才会存储到自己专属的文件中。
最后，磁盘缓存的淘汰策略是维护一个 LRU，通过比如访问频率和资源的使用时间(age)的度量进行管理。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m48163918.png" alt="">

在 Chrome 开个页签，输入 `chrome://net-internals/#httpCache`。 
如果你要看到实际的 HTTP 数据和缓存的响应处理，可以打开 `chrome://cache`， 里面会列出所有缓存中可用的资源。
打开每一项，还可以看到详细的数据头等信息。

### 3.3 优化DNS预连接

前面已经多次提到了 DNS 预解析，在深入实现之前，先汇总一下 DNS 预解析的场景和理由:

* 运行在渲染进程中的 WebKit 文档解析器(document parser), 会为当前页面上所有的链接提供一个主机名(hostname)列表，Chrome 可以选择是否提前解析。
* 当用户要打开页面时，渲染进程先会触发一个鼠标悬停(hover)或按键(button down)事件。
* Omnibox 可能会针对一个高可能性的建议页面发起解析请求。
* Chrome Predictor 会基于过往浏览记录和资源请求数据发起主机解析请求。(下面会详细解释。)
* 页面本身会显式地要求 Chrome 对某些主机名称进行预解析。

<strong>上述各项对于 Chrome 都只是一个线索。</strong>
Chrome 并不保证预解析一定会被执行，所有的线索会由 Predictor 进行评估，以决定后续的操作。
最坏的情况下，可能无法及时解析主机名，用户就必须等待一个 DNS 解析时间，然后是 TCP 连接时间，最后是资源加载时间。
Predictor 会记下这个场景，在未来决策时相应地加以参考。
总之，一定是越用越快。

之前提过到 Chrome 可以 记住每个页面的拓扑(topology),并可以基于这个信息进行加速。
还记得吧，平均每个页面带有 88 个资源，分别来自于 30 多个独立的主机。
每打开这 个页面，Chrome 会记下资源中比较常用的主机名，在后续的浏览过程中，Chrome 就会发起针对某些主机或者全部主机的 DNS 解析，甚至是 TCP 预连接!

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_7f53ba93.png" alt="">

使用 `chrome://dns` 就可以观察到上面的数据(Google+ 页面), 其中有 6 个子资源对应的主机名，并记录了 DNS 预解析发生的次数，TCP 预连接发生的次数，以及到每个主机的请求次数。
这些数据就可以让 Chrome Predictor 执行相应的优化决策。

除了内部事件通知外，页面设计者可以在页面中嵌入如下的语句请求浏览器进行预解析：

    <link rel="dns-prefetch" href="//host_name_to_prefetch.com">

之所以有这个需求，一个典型的例子是重定向(redirects)。
Chrome 本身没办法判断出这种模式，通过这种方式则可以让浏览器提前进行解析。

具体的实现也是因版本而有所差异，总体而言，Chrome 中的 DNS 处理有两个主要的实现：

1. 基于历史数据(historically), 通过调用平台无关的 `getaddrinfo()` 系统函数实现。
2. 代理操作系统的 DNS 处理方法，这种方法正在被 Chrome 自行实现的一套异步 DNS 解析机制(asynchronous DNS resolver)所取代。

依赖于系统的实现，代码少而且简单，但是 `getaddrInfo()` 是一个阻塞式的系统调用，无法有效地并行多个查询操作。
经验数据还显示，并行请求过多甚至会超出路由器的负额。 
Chrome 为此设计了一个复杂的机制。
对于其中带有 worker-pool 的预解析, Chrome 只是简单的发送 `getaddrinfo()` 调用, 同时阻塞 worker thread 直到收到响应数据。
因为系统有 `DNS` 缓存的原因，针对解析过的主机，解析操作会立即返回。这个过程简单，有效。

<strong>但还不够！</strong> 
`getaddrinfo()` 隐藏了太多有用的信息，比如 Time-to-live(TTL) 时间戳, DNS 缓存的状态等。
于是 Chrome 决定自己实现一套跨平台的异步 DNS 解析器。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m5dcab129.png" alt="">

这个新技术可以支持以下优化:

* 更好地控制重转的时机，有能力并行执行多个查询操作。 清晰地记录TTLs。
* 更好地处理 IPv4 和 IPv6 的兼容。
* 基于 RTT 和其它事件，针对不同服务器进行错误处理(failover)

Chrome 仍然进行着持续的优化。通过 `chrome://histograms/DNS` 可以观察到 DNS 度量数据：

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_413d9f1.png" alt="">

上面的柱状图展示了 DNS 预解析延迟时间的分布：比如将近 50% (最右侧)的查询在 20ms 内完成。
这些数据基于最近的浏览操作(采样 9869 次)，用户可以选择是否报告这些使用数据，然后这些数据会以匿名的形式交由工程团队加以分析，这样就可以了解到功能的性能，以及未来如何进一步调整。
周而复始，不断优化。

### 3.4 使用预连接优化了 TCP 连接管理

已经预解析到了主机名，也有了由 OmniBox 和 Chrome Predictor 提供信号，预示着用户未来的操作。
为什么再进一步连接到目标主机，在用户真正发起请求前完成 TCP 握手呢？
这样就可省掉了另一个往返的延迟，轻易地就能为用户节省到上百毫秒。
其实，这就是 TCP 预连接的工作。
通过访问 `chrome://dns` 就可以看到 TCP 预连接的使用情况。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m480578a.png" alt="">

首先，Chrome 检查它的 socket pool 里有没有目标主机可以复用的 socket， 这些 sockets 会在 socket pool 里保留一段时间，以节省 TCP 握手时间及启动延时(slow-start penalty)。
如果没有可用的 socket，就需要发起 TCP 握手，然后放到 socket pool 中。
这样当用户发起请求时，就可以用这个 socket 立即发起 HTTP 请求。

打开 `chrome://net-internals#sockets` 就可以看到当前的 sockets 的状态:

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_e83e1c7.png" alt="">

你可以看到每一个 socket 的时间轴：连接和代理的时间，每个封包到达的时间，以及其它一些信息。
你也可以把这些数据导出，以方便进一步分析或者报告问题。
<strong>有好的测试数据是优化的基础, `chrome://net-internals` 就是 Chrome 网络的信息中心</strong>。

<h3>使用预加载优化资源加载</h3>

Chrome 支持在页面的 HTML 标签中加入的两个线索来优化资源加载:

    <link rel="subresource" href="/javascript/myapp.js">
    <link rel="prefetch"    href="/images/big.jpeg">

在 `rel` 中指定的 subresource(子资源)和 prefetch(预加载)非常相似。
不同的是，如果一个 link 指定 rel(relation) 为 prefetch 后，就是告诉浏览器这个资源是稍后的页面中要用到的。
而指定为 subresource 则表示在本页中就会用到，期望能在使用前加载。
两者不同的语义让 resource loader 有不同的行为。
prefetch 的优先级较低，一般只会在页面加载完成后才会开始。
而 subresource 则会在解析出来时就被尝试优先执行。

还要注意，prefetch 是 HTML5 的一部分，Firefox 和 Chrome 都可以支持。
但 subresource 还只能用在 <a href="http://www.chromium.org/spdy/link-headers-and-server-hint/link-rel-subresource">Chrome</a> 中。

### 3.5 应用 Browser Prefreshing 优化资源加载

不过，并不是所有的 Web 开发者会愿意加入上面所述的 subresource relation，就算加了，也要等收到主文档并解析出这些内容才行，这段时间开销依赖于服务器的响应时间和客户端与服务器间的延迟时间，甚至要耗去上千毫秒。

和前面的预解析，预连接一样，这里还有一个 prefreshing::

* 用户初始化一个目标页面的请求。
* Chrome 查询 Predictor 之前针对目标页面的子资源加载，初始化一组 DNS 预解析，TCP 预连接及资源 prefreshing。
* 如是在缓存中发现之前记录的子资源，由从磁盘中加载到内存中。
* 如果没有或者已经过期了，就是发送网络请求。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_771182c1.png" alt="">

直到在 2013 年初, prefreshing 还是处于早期的讨论阶段。
如果通过数据结果分析，这个功能最终上线了，我们就可以稍晚些时候使用到它了。

### 3.6 使用预渲染优化页面浏览

前面讨论的每个优化都用来帮助减少用户发起请求到看到页面内容的延迟时间。
多快才能带来即时呈现的体验呢？
基于用户体验数据，这个时间是 100 毫秒，根本没给网络延迟留什么空间。
而在 100 毫秒内，又怎样渲染页面呢？

大家可能都有这样的体验: 同时开多个页签时会明显快于在一个页签中等待。
浏览器为此提供了一个实现方式:

    <link rel="prerender" href="http://example.org/index.html">

这就是 Chrome 的预渲染(<a href="https://developers.google.com/chrome/whitepapers/prerender">prerendering in Chrome</a>)! 相对于只下载一个资源的“prefetch”, “prerender”会让 Chrome 在一个不可见的页签中渲染一个页面,包含了它所有的子资源。
当用户要浏览它时，这个页签被切到前台，做到了即时的体验。

可以浏览 <a href="http://prerender-test.appspot.com/">prerender-test.appspot.com</a> 来体验一下效果，再通过 `chrome://net-internals/#prerender` 查看下历史记录和预连接页面的状态。

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_m7eb124e3.png" alt="">

因为预渲染会同时消耗 CPU 和网络资源，因些一定要在确信预渲染页面会被使用到情况下才用。
Google Search 就在它的搜索结果里加入 prerender, 因为第一个搜索结果很可能就是下一个页面(也叫作<a href="http://www.theguardian.com/technology/2011/jun/14/google-instant-pages-web-search">Google Instant Pages</a>)

你可以使用预渲染特性，但以下限制项一定要牢记:

* 所有的进程中最多只能有一个预渲染页。
* HTTPS 和带有 HTTP 认证的页面不可以预渲染。
* 如果请求资源需要发起非幂等（non-idempotent,idempotent request 的意义为发起多次，不会带来服务的负面响应的请求)的请求(只有GET请求)时，预渲染也不可用。
* 所有的资源的优先级都很低。
* 页面渲染进程的使用最低的 CPU 优先级。
* 如果需要超过 100MB 的内存，将无法使用预渲染。
* 不支持 HTML5 多媒体元素。

预渲染只能应用于确信安全的页面。
另外 JavaScript 也最好在运行时使用<a href="https://developers.google.com/chrome/whitepapers/pagevisibility">Page Visibility API</a>来判断一下当前页是否可见(参考 <a href="http://www.html5rocks.com/en/tutorials/pagevisibility/intro/">you should be doing anyway</a>) !

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_5953ce6b.png" alt="">

最后，总之，Chrome 正逐步优化网络延迟和用户体验，让它随着用户的使用越来越快！

------------------------

<img src="http://tech.uc.cn/wp-content/uploads/2013/09/Google-Chrome%E4%B8%AD%E7%9A%84%E9%AB%98%E6%80%A7%E8%83%BD%E7%BD%91%E7%BB%9C_html_16cef13a.jpg" alt="">

<a href="http://www.igvita.com/">Ilya Grigorik</a> is a web performance engineer and developer advocate on the Make The Web Fast team at Google, where he spends his days and nights on making the web fast and driving adoption of performance best practices.<br>
<a href="https://twitter.com/igrigorik">Follow @igrigorik</a>

文章来源：[UC技术博客](http://tech.uc.cn/?p=2092)
