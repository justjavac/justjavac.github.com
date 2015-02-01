---
layout: post
title: 基于 DHT 网络的磁力链接和BT种子的搜索引擎架构
categories: [other]
tags: [magnet, DHT, BitTorrent, torrent]
---

做了一个磁力链接和 BT 种子的搜索引擎 [{Magnet & Torrent}](http://magnet-torrent.com)，本文简单介绍一下主要的系统功能和用到的技术。

系统包括几个独立的部分：

- 使用 Python 的 [Scrapy](http://scrapy.org/) 框架开发的网络爬虫，用来爬取磁力链接和种子；

- 使用 PHP CI 框架开发的简易网站；

- 搜索引擎目前直接使用的 MySQL，将来可以考虑使用 sphinx；

- 中文分词。

  用 PHP 写了一个简陋版的基于逆向最大匹配算法的小类，词库呢，哈哈，直接使用了 [Chrome 的分词表](http://src.chromium.org/viewvc/chrome/trunk/deps/third_party/icu38/source/data/brkitr/cc_cedict.txt)，分词表可以在这个地址下载：<http://www.mdbg.net/chindict/chindict.php?page=cedict>。

- 新词发现机制

  基于搜索关键词的新词发现机制。
  
  目前词库方面还有一个很大的问题，比如最新的电影无法分词，例如[星际穿越](http://magnet-torrent.com/search/%E6%98%9F%E9%99%85%E7%A9%BF%E8%B6%8A) 会被分词为“星际”和“穿越”，因此“被偷走的那五年，**穿越**火线，极速蜗牛，了不起的盖茨比，摩登年代，**星际**迷航，乔布斯传。”也出现在了搜索结果中。
  
  当然这也不算事大问题，但是[霍比特人](http://magnet-torrent.com/search/%E9%9C%8D%E6%AF%94%E7%89%B9%E4%BA%BA)却被分词为了“霍”、“比特”、“人”了，好在搜索结果里面没有啥东西乱入。这些属于过度分词，通过增加词库内容可以解决，因此准备些一个豆瓣爬虫，将豆瓣的所有电影都加入词库，用来辅助分词。

- 资源别名

  这会使我们的系统更加智能，更加人性化。我们在百度搜索时，经常会遇到这样的情况，当我们搜索“开核桃利器”，百度提示我们“您要找的是不是诺基亚？”。当我们搜索“世界上最好的语言”，百度提示我们“您要找的是不是PHP？”。同样，当用户搜索“星际穿越”时，应该为用户提供Interstellar的匹配结果。
  
  我们不用实现复杂的在线翻译，只需要继续爬取豆瓣，将电影的中英文都做成对照表就可以了。而且，为了考虑到某些宅男的特殊需求，我们还需要做一个日语的对照表。

- 英文分词

  英文还需要分词？空格不就是词语边界吗？你有这样的译文很正常，我最初也是这么想的，因此英文只是简单的使用了 PHP 的 `explode(' ', $query)` 函数。
  
  但是我刚才（2015-02-01 21:59:35）看搜索日志时发现了一些问题，今天 [xart](http://magnet-torrent.com/search/xart) 关键词被搜索了 169 次，而 [x-art](http://magnet-torrent.com/search/x-art) 关键词仅仅被搜索了 54 次，但是 x-art 才是它的官方名词啊（不要问我为什么知道的这么多）。因此我刚刚调整了一下代码，将 xart 和 x-art 统一定向到了 x-art。

- BitTorrent 低版本最初使用 Python 开发，而且是开源的，因此很多类库都是直接使用的 BitTorrent 的，也有一些类库和辅助函数直接移植到了 PHP 平台上；（Petru Paler 写的 [bencode](https://github.com/bittorrent/bencode) 太赞了，老婆问我：你为什么跪着写代码？）

了解 P2P 原理的人都知道，BT 不需要中心服务器，因为每个节点既是客户端，同时也是服务器，因此基于 0x0d 大神的 [dhtfck](https://github.com/0x0d/dhtfck) 写了一个 DHT 爬虫，它伪装为 DHT 网络中的一个节点，这样当其他客户端想下载某个 torrent 时，就会在 DHT 网络发起广播，当它询问到我的节点时，我就知道了：哦，原来有人要下载这个种子啊，那么在 DHT 网络中肯定有这个种子。于是我把这个种子的信息保存到 MySQL 中。

以上 DHT 的整个过程可以具体看看 [DHT 协议](http://justjavac.com/other/2015/02/01/bittorrent-dht-protocol.html)。

注意：我只是保存了 torrent 的 infohash 信息，用这个信息，可以构建一个磁力链接，但是却还没有得到种子文件，我们还得通过其它方式取得种子文件。

Python 的爬虫程序是主动出击，盲目寻找。在互联网的海量网页中寻找种子和磁力链接。而 DHT 爬虫则变成了被动等待，当别人来询问时，就把它的询问结果记录下来，如果一个种子被询问了很多次，则说明这个种子是一个热门种子，这是 Python 爬虫无法做到的。

由于 BitTorrent 开源版本使用的 Python，因此我的 DHT 爬虫也使用了 Python。作为一个服务器，肯定要使用 twisted 框架，熟悉 nodejs 的同学一定知道这个框架的特性：异步网络 IO，虽然大部分开发者都是通过 nodejs 才了解了异步 IO，但是 twisted 要比 nodejs 早了 N 年。

当前运行的爬虫是一个非常简陋的版本，是我一周前写的一个多线程的基于 Socket 的 DHT 服务器。截至到写这篇文章时，已经运行了 6 天了，总共收集到了 45,234,859 个磁力链接。
