---
layout:     post
title:      GitHub API v2 笔记
description:    我喜欢折腾，这几天折腾 GitHub API，用的挺爽，且记下 v2 版本中一些常用的东西。
keywords: GitHub, GitHub API
category : github
tags : [github, api]
---

###基本

1.所有的 API 链接采用 http 协议而且开始于下面的格式:


    http://github.com/api/v2/:format

注：":format" 是指 "json","xml" 或者 "yaml" 中的一个。但现在基本是 json。

2.使用 GitHub 的 API 是有所限制的，使用 v2 版本，是每分钟 60 次请求。如果你在一分钟内访问了 60 次，它会提示您“拒绝访问”的错误。

###分支相关

1.一个分支提交的信息列表

    commits/list/:user_id/:repository/:branch

2.一个文件提交的信息列表

    commits/list/:user_id/:repository/:branch/*path

3.一个特殊的提交信息

    commits/list/:user_id/:repository/:sha

###Repositories 相关

1.搜索

    repos/search/:q

2.Repo 信息

    repos/show/:user/:repo

3.列出所有的 Repo

    repos/show/:user

注：这个 API 每一页只列出 30 个结果
