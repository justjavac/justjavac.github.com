---
layout: post
title: DHT Protocol：BitTorrent DHT 协议中文翻译
categories: [other]
tags: [Protocol, DHT, BitTorrent]
---

原文：[DHT Protocol](http://www.bittorrent.org/beps/bep_0005.html)  

> **BEP**: 5  
> **Title**: DHT Protocol   
> **Version**: 3dec52cb3ae103ce22358e3894b31cad47a6f22b  
> **Last-Modified**: Tue Apr 2 16:51:45 2013 -0700  
> **Author**: Andrew Loewenstern <drue@bittorrent.com>, Arvid Norberg <arvid@bittorrent.com>  
> **Status**: Draft  
> **Type**: Standards Track  
> **Created**: 31\-Jan\-2008  
> **Post-History**: 22-March-2013: Add "implied\_port" to announce\_peer message, to improve NAT support

BitTorrent 使用"分布式哈希表"(DHT)来为无 tracker 的种子(torrents)存储 peer 之间的联系信息。这样每个 peer 都成了 tracker。这个协议基于 Kademila[1] 网络并且在 UDP 上实现。

请注意本文档中使用的术语，以免混乱。

- "peer" 是在一个 TCP 端口上监听的客户端/服务器，它实现了 BitTorrent 协议。
- "节点" 是在一个 UDP 端口上监听的客户端/服务器，它实现了 DHT(分布式哈希表) 协议。

DHT 由节点组成，它存储了 peer 的位置。BitTorrent 客户端包含一个 DHT 节点，这个节点用来联系 DHT 中其他节点，从而得到 peer 的位置，进而通过 BitTorrent 协议下载。

## 概述 Overview

每个节点有一个全局唯一的标识符，作为 "node ID"。节点 ID 是一个随机选择的 160bit 空间，BitTorrent infohash[2] 也使用这样的 160bit 空间。
"距离"用来比较两个节点 ID 之间或者节点 ID 和 infohash 之间的"远近"。节点必须维护一个路由表，路由表中含有一部分其它节点的联系信息。其它节点距离自己越近时，路由表信息越详细。因此每个节点都知道 DHT 中离自己很"近"的节点的联系信息，而离自己非常远的 ID 的联系信息却知道的很少。

在 Kademlia 网络中，距离是通过异或(XOR)计算的，结果为无符号整数。`distance(A, B) = |A xor B|`，值越小表示越近。

当节点要为 torrent 寻找 peer 时，它将自己路由表中的节点 ID 和 torrent 的 infohash 进行"距离对比"。然后向路由表中离 infohash 最近的节点发送请求，问它们正在下载这个 torrent 的 peer 的联系信息。如果一个被联系的节点知道下载这个 torrent 的 peer 信息，那个 peer 的联系信息将被回复给当前节点。否则，那个被联系的节点则必须回复在它的路由表中离该 torrent 的 infohash 最近的节点的联系信息。最初的节点重复地请求比目标 infohash 更近的节点，直到不能再找到更近的节点为止。查询完了之后，客户端把自己作为一个 peer 插入到所有回复节点中离种子最近的那个节点中。

请求 peer 的返回值包含一个不透明的值，称之为"令牌(token)"。如果一个节点宣布它所控制的 peer 正在下载一个种子，它必须在回复请求节点的同时，附加上对方向我们发送的最近的"令牌(token)"。这样当一个节点试图"宣布"正在下载一个种子时，被请求的节点核对令牌和发出请求的节点的 IP 地址。这是为了防止恶意的主机登记其它主机的种子。由于令牌仅仅由请求节点返回给收到令牌的同一个节点，所以没有规定他的具体实现。但是令牌必须在一个规定的时间内被接受，超时后令牌则失效。在 BitTorrent 的实现中，token 是在 IP 地址后面连接一个 secret(可以视为一个随机数)，这个 secret 每五分钟改变一次，其中 token 在十分钟以内是可接受的。

## 路由表 Routing Table

每一个节点维护一个路由表保存已知的好节点。路由表中的节点是用来作为在 DHT 中请求的起始点。路由表中的节点是在不断的向其他节点请求过程中，对方节点回复的。

并不是我们在请求过程中收到得节点都是平等的，有的节点是好的，而另一些则不是。许多使用 DHT 协议的节点都可以发送请求并接收回复，但是不能主动回复其他节点的请求。节点的路由表只包含已知的好节点，这很重要。好节点是指在过去的 15 分钟以内，曾经对我们的某一个请求给出过回复的节点，或者曾经对我们的请求给出过一个回复(不用在15分钟以内)，并且在过去的 15 分钟给我们发送过请求。上述两种情况都可将节点视为好节点。在 15 分钟之后，对方没有上述 2 种情况发生，这个节点将变为可疑的。当节点不能给我们的一系列请求给出回复时，这个节点将变为坏的。相比那些未知状态的节点，已知的好节点会被给于更高的优先级。

路由表覆盖从 0 到 2^160 全部的节点 ID 空间。路由表又被划分为桶(桶s)，每个桶包含一部分的 ID 空间。空的路由表只有一个桶，它的 ID 范围从 min=0 到 max=2^160。当 ID 为 `N` 的节点插入到表中时，它将被放到 ID 范围在 `min <= N < max` 的 桶 中。空的路由表只有一个桶所以所有的节点都将被放到这个桶中。每一个桶最多只能保存 K 个节点，当前 K=8。当一个桶放满了好节点之后，将不再允许新的节点加入，除非我们自身的节点ID在这个桶的范围内。在这样的情况下，这个桶将被分裂为 2 个新的桶，每一个新桶的范围都是原来旧桶的一半。原来旧桶中的节点将被重新分配到这两个新的桶中。如果一个新表只有一个桶，这个包含整个范围的桶将总被分裂为 2 个新的桶，第一个的覆盖范围从 0..2^159 和 2^159..2^160。

当桶装满了好节点，新的节点会被丢弃。一旦桶中的某一个节点变为了坏的节点，那么我们就用新的节点来替换这个坏的节点。如果桶中有在 15 分钟内都没有活跃过的节点，我们将这样的节点视为可疑的节点，这时我们向最久没有联系的节点发送 ping。如果被 ping 的节点给出了回复，那么我们向下一个可疑的节点发送 ping，不断这样循环下去，直到有某一个节点没有给出 ping 的回复，或者当前桶中的所有节点都是好的(也就是所有节点都不是可疑节点，他们在过去 15 分钟内都有活动)。如果桶中的某个节点没有对我们的 ping 给出回复，我们最好再试一次(再发送一次 ping，因为这个节点也许仍然是活跃的，但由于网络拥塞，所以发生了丢包现象，注意 DHT 的包都是 UDP 的)，而不是立即丢弃这个节点或者直接用新节点来替代它。这样，我们得路由表将充满稳定的长时间在线的节点。

每一个桶都应该维持一个 `lastchange` 字段来表明桶中节点的"新鲜"度。当桶中的节点被 ping 并给出了回复，或者一个节点被加入到了桶，或者一个节点被一个新的节点所替代，桶的 `lastchange` 字段都应当被更新。如果一个桶的 `lastchange` 在过去的 15 分钟内都没有变化，那么我们将更新它。这个更新桶操作是这样完成的：从这个桶所覆盖的范围中随机选择一个 ID，并对这个 ID 执行 `find_nodes` 查找操作。常常收到请求的节点通常不需要常常更新自己的桶，反之，不常常收到请求的节点常常需要周期性的执行更新所有桶的操作，这样才能保证当我们用到 DHT 的时候，里面有足够多的好的节点。

在插入第一个节点到路由表并启动服务后，这个节点应试着查找 DHT 中离自己更近的节点，这个查找工作是通过不断的发出 `find_node` 消息给越来越近的节点来完成的，当不能找到更近的节点时，这个扩散工作就结束了。路由表应当被启动工作和客户端软件保存（也就是启动的时候从客户端中读取路由表信息，结束的时候客户端软件记录到文件中）。

## BitTorrent 协议扩展 BitTorrent Protocol Extension

BitTorrent 协议已经被扩展为可以在通过 tracker 得到的 peer 之间互相交换节点的 UDP 端口号(也就是告诉对方我们的 DHT 服务端口号)，在这样的方式下，客户端可以通过下载普通的种子文件来自动扩展 DHT 路由表。新安装的客户端第一次试着下载一个无 tracker 的种子时，它的路由表中将没有任何节点，这是它需要在 torrent 文件中找到联系信息。

peers 如果支持 DHT 协议就将 BitTorrent 协议握手消息的保留位的第 8 字节的最后一位置为 `1`。这时如果 peer 收到一个 `handshake` 表明对方支持 DHT 协议，就应该发送 PORT 消息。它由字节 `0x09` 开始，`payload` 的长度是 2 个字节，包含了这个 peer 的 DHT 服务使用的网络字节序的 UDP 端口号。当 peer 收到这样的消息是应当向对方的 IP 和消息中指定的端口号的节点发送 ping。如果收到了 ping 的回复，那么应当使用上述的方法将新节点的联系信息加入到路由表中。

## Torrent 文件扩展 Torrent File Extensions

一个无 tracker 的 torrent 文件字典不包含 `announce` 关键字，而使用一个 `nodes` 关键字来替代。这个关键字对应的内容应该设置为 torrent 创建者的路由表中 K 个最接近的节点。可供选择的，这个关键字也可以设置为一个已知的可用节点，比如这个 torrent 文件的创建者。请不要自动加入 `router.bittorrent.com` 到 torrent 文件中或者自动加入这个节点到客户端路由表中。

```
nodes = [["<host>", <port>], ["<host>", <port>], ...]
nodes = [["127.0.0.1", 6881], ["your.router.node", 4804]]
```

## KRPC协议 KRPC Protocol

KRPC 协议是由 bencode 编码组成的一个简单的 RPC 结构，他使用 UDP 报文发送。一个独立的请求包被发出去然后一个独立的包被回复。这个协议没有重发。它包含 3 种消息：请求，回复和错误。对DHT协议而言，这里有 4 种请求：`ping`，`find_node`，`get_peers` 和 `announce_peer`。

一条 KRPC 消息由一个独立的字典组成，其中有 2 个关键字是所有的消息都包含的，其余的附加关键字取决于消息类型。每一个消息都包含 `t` 关键字，它是一个代表了 transaction ID 的字符串类型。transaction ID 由请求节点产生，并且回复中要包含回显该字段，所以回复可能对应一个节点的多个请求。transaction ID 应当被编码为一个短的二进制字符串，比如 2 个字节，这样就可以对应 2^16 个请求。另一个每个 KRPC 消息都包含的关键字是 `y`，它由一个字节组成，表明这个消息的类型。`y` 对应的值有三种情况：`q` 表示请求，`r` 表示回复，`e` 表示错误。

### 联系信息编码 Contact Encoding

Peers 的联系信息被编码为 6 字节的字符串。又被称为 "CompactIP-address/port info"，其中前 4 个字节是网络字节序的 IP 地址，后 2 个字节是网络字节序的端口。

节点的联系信息被编码为 26 字节的字符串。又被称为 "Compactnode info"，其中前 20 字节是网络字节序的节点 ID，后面 6 个字节是 peers 的 "CompactIP-address/port info"。

### 请求 Queries

请求，对应于 KPRC 消息字典中的 `y` 关键字的值是 `q`，它包含 2 个附加的关键字 `q` 和 `a`。关键字 `q` 是一个字符串类型，包含了请求的方法名字。关键字 `a` 一个字典类型包含了请求所附加的参数。

### 回复 Responses

回复，对应于 KPRC 消息字典中的 `y` 关键字的值是 `r`，包含了一个附加的关键字 `r`。关键字 `r` 是一个字典类型，包含了返回的值。发送回复消息是在正确解析了请求消息的基础上完成的。

### 错误 Errors

错误，对应于 KPRC 消息字典中的 `y` 关键字的值是 `e`，包含一个附加的关键字 e`。关键字 `e` 是一个列表类型。第一个元素是一个数字类型，表明了错误码。第二个元素是一个字符串类型，表明了错误信息。当一个请求不能解析或出错时，错误包将被发送。下表描述了可能出现的错误码：

<table class="table">
<tbody>
<tr>
<th>错误码</th>
<th>描述</th>
</tr>
<tr>
<td>201</td>
<td>一般错误</td>
</tr>
<tr>
<td>202</td>
<td>服务错误</td>
</tr>
<tr>
<td>203</td>
<td>协议错误，比如不规范的包，无效的参数，或者错误的 token</td>
</tr>
<tr>
<td>204</td>
<td>未知方法</td>
</tr>
</tbody>
</table>

### 错误包例子 Example Error Packets:

```
generic error = {"t":"aa", "y":"e", "e":[201, "A Generic Error Ocurred"]}
bencoded = d1:eli201e23:A Generic Error Ocurrede1:t2:aa1:y1:ee
```

## DHT 请求 DHT Queries

所有的请求都包含一个关键字 `id`，它包含了请求节点的节点 ID。所有的回复也包含关键字` id`，它包含了回复节点的节点 ID。

### ping

最基础的请求是一个ping。"q" = "ping",一个ping请求有一个参数，"id"，它的值是一个20字节的字符串，包含网络字节排序的发送者的节点ID。一个ping的适当回复有一个关键字"id"，包含发出回复的节点的节点ID。

最基础的请求就是 ping。这时 KPRC 协议中的 `"q" = "ping"`。Ping 请求包含一个参数 `id`，它是一个 20 字节的字符串包含了发送者网络字节序的节点 ID。对应的 ping 回复也包含一个参数 `id`，包含了回复者的节点 ID。

- 参数: `{"id" : "<querying nodes id>"}`
- 回复: `{"id" : "<queried nodes id>"}`

### 报文包例子 Example Packets

```
ping Query = {"t":"aa", "y":"q", "q":"ping", "a":{"id":"abcdefghij0123456789"}}
bencoded = d1:ad2:id20:abcdefghij0123456789e1:q4:ping1:t2:aa1:y1:qe
Response = {"t":"aa", "y":"r", "r": {"id":"mnopqrstuvwxyz123456"}}
bencoded = d1:rd2:id20:mnopqrstuvwxyz123456e1:t2:aa1:y1:re
```

### find_node

`find_node` 被用来查找给定 ID 的节点的联系信息。这时 KPRC 协议中的 `"q" == "find_node"`。`find_node` 请求包含 2 个参数，第一个参数是 `id`，包含了请求节点的ID。第二个参数是 `target`，包含了请求者正在查找的节点的 ID。当一个节点接收到了 `find_node` 的请求，他应该给出对应的回复，回复中包含 2 个关键字 `id` 和 `nodes`，`nodes` 是一个字符串类型，包含了被请求节点的路由表中最接近目标节点的 K(8) 个最接近的节点的联系信息。

- 参数: `{"id" : "<querying nodes id>", "target" : "<id of target node>"}`
- 回复: `{"id" : "<queried nodes id>", "nodes" : "<compact node info>"}`

### 报文包例子 Example Packets

```
find_node Query = {"t":"aa", "y":"q", "q":"find_node", "a": {"id":"abcdefghij0123456789", "target":"mnopqrstuvwxyz123456"}}
bencoded = d1:ad2:id20:abcdefghij01234567896:target20:mnopqrstuvwxyz123456e1:q9:find_node1:t2:aa1:y1:qe
Response = {"t":"aa", "y":"r", "r": {"id":"0123456789abcdefghij", "nodes": "def456..."}}
bencoded = d1:rd2:id20:0123456789abcdefghij5:nodes9:def456...e1:t2:aa1:y1:re
```

### get_peers

`get_peers` 与 torrent 文件的 infohash 有关。这时 KPRC 协议中的 `"q" = "get_peers"`。`get_peers` 请求包含 2 个参数。第一个参数是 `id`，包含了请求节点的 ID。第二个参数是 `info_hash`，它代表 torrent 文件的 infohash。如果被请求的节点有对应 `info_hash` 的 peers，他将返回一个关键字 `values`,这是一个列表类型的字符串。每一个字符串包含了 `"CompactIP-address/portinfo"` 格式的 peers 信息。如果被请求的节点没有这个 infohash 的 peers，那么他将返回关键字 `nodes`，这个关键字包含了被请求节点的路由表中离 `info_hash` 最近的 K 个节点，使用 `"Compactnodeinfo"` 格式回复。在这两种情况下，关键字 `token` 都将被返回。`token` 关键字在今后的 `annouce_peer` 请求中必须要携带。`token` 是一个短的二进制字符串。

- 参数: `{"id" : "<querying nodes id>", "info_hash" : "<20-byte infohash of target torrent>"}`
- 回复: `{"id" : "<queried nodes id>", "token" :"<opaque write token>", "values" : ["<peer 1 info string>", "<peer 2 info string>"]}`
- 或: `{"id" : "<queried nodes id>", "token" :"<opaque write token>", "nodes" : "<compact node info>"}`

### 报文包例子 Example Packets:

```
get_peers Query = {"t":"aa", "y":"q", "q":"get_peers", "a": {"id":"abcdefghij0123456789", "info_hash":"mnopqrstuvwxyz123456"}}
bencoded = d1:ad2:id20:abcdefghij01234567899:info_hash20:mnopqrstuvwxyz123456e1:q9:get_peers1:t2:aa1:y1:qe
Response with peers = {"t":"aa", "y":"r", "r": {"id":"abcdefghij0123456789", "token":"aoeusnth", "values": ["axje.u", "idhtnm"]}}
bencoded = d1:rd2:id20:abcdefghij01234567895:token8:aoeusnth6:valuesl6:axje.u6:idhtnmee1:t2:aa1:y1:re
Response with closest nodes = {"t":"aa", "y":"r", "r": {"id":"abcdefghij0123456789", "token":"aoeusnth", "nodes": "def456..."}}
bencoded = d1:rd2:id20:abcdefghij01234567895:nodes9:def456...5:token8:aoeusnthe1:t2:aa1:y1:re
```

### announce_peer

这个请求用来表明发出 `announce_peer` 请求的节点，正在某个端口下载 torrent 文件。`announce_peer` 包含 4 个参数。第一个参数是 `id`，包含了请求节点的 ID；第二个参数是 `info_hash`，包含了 torrent 文件的 infohash；第三个参数是 `port` 包含了整型的端口号，表明 peer 在哪个端口下载；第四个参数数是 `token`，这是在之前的 `get_peers` 请求中收到的回复中包含的。收到 `announce_peer` 请求的节点必须检查这个 `token` 与之前我们回复给这个节点 `get_peers` 的 `token` 是否相同。如果相同，那么被请求的节点将记录发送 `announce_peer` 节点的 IP 和请求中包含的 port 端口号在 peer 联系信息中对应的 infohash 下。

参数:  

```
{
  "id" : "<querying nodes id>",
  "implied_port": <0 or 1>,
  "info_hash" : "<20-byte infohash of target torrent>",
  "port" : <port number>,
  "token" : "<opaque token>"
}
```

回复: `{"id" : "<queried nodes id>"}`

### 报文包例子 Example Packets:

```
announce_peers Query = {"t":"aa", "y":"q", "q":"announce_peer", "a": {"id":"abcdefghij0123456789", "implied_port": 1, "info_hash":"mnopqrstuvwxyz123456", "port": 6881, "token": "aoeusnth"}}
bencoded = d1:ad2:id20:abcdefghij01234567899:info_hash20:<br />
mnopqrstuvwxyz1234564:porti6881e5:token8:aoeusnthe1:q13:announce_peer1:t2:aa1:y1:qe
Response = {"t":"aa", "y":"r", "r": {"id":"mnopqrstuvwxyz123456"}}
bencoded = d1:rd2:id20:mnopqrstuvwxyz123456e1:t2:aa1:y1:re
```

## References

- [1] Peter Maymounkov, David Mazieres, "Kademlia: A Peer-to-peer Information System Based on the XOR Metric", IPTPS 2002. <http://www.cs.rice.edu/Conferences/IPTPS02/109.pdf>
- [2] Use SHA1 and plenty of entropy to ensure a unique ID.

## Copyright

This document has been placed in the public domain.
