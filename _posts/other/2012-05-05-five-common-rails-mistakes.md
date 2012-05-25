---
layout: post
title: 5 个常见的 Rails 开发误区
description: 本文作者是一名Rails开发者，他总结了在Rails开发过程中的一些常见误区。我使用Rails已经有一段时间了，在这期间我看了大量的Rails项目，下面的这五个常见的误区，我几乎在每一个Rails代码中都看到过。
keywords: Rails, ruby, 开发误区
category : other
tags : [Rails, ruby]
---

本文作者是一名Rails开发者，他总结了在Rails开发过程中的一些常见误区。

文章内容如下： 

我使用Rails已经有一段时间了，在这期间我看了大量的Rails项目，下面的这五个常见的误区，我几乎在每一个Rails代码中都看到过。 

## 1. 没有 schema 规范的迁移 

**数据模型是应用程序的核心**。没有schema的约束，你的数据会因为项目代码上的bugs而慢慢变得糟糕，直到你无法相信库中的任何字段。这里有一个 Concact Schema： 

    create_table "contacts" do |t|
        t.integer  "user_id"
        t.string   "name"
        t.string   "phone"
        t.string   "email"
    end

上面哪些需要更改呢？通常一个Contact必须依附于User，并且会有一个name 属性，这可以使用数据库约束来确保。
可以添加 `:null => false`，这样即使验证代码存在bugs，我们依然可以确保模型一致性，因为如果违反了null约束，数据库并不会允许模型保存这些数据。 

    create_table "contacts" do |t|
        t.integer  "user_id", :null => false
        t.string   "name", :null => false
        t.string   "phone"
        t.string   "email"
    end

**TIPS**：使用 `:limit => N` 规范你的string类型字段的大小。Strings 默认255个字符，而phone字段应该不需要这么长吧！ 

## 2. 面向对象编程 

大多数Rails开发人员并不写面向对象的代码。
他们通常会在项目中写面向MVC的Ruby代码（把模型和控制器分开写在合适的位置）。
通常是在lib目录下添加带有类方法的工具模块，仅此而已。
但开发人员往往需要花费2-3年才能认识到“Rails就是Ruby。我完全可以创建一些简单的对象，并且不一定按照Rails建议的方式去封装它们。” 

**TIPS**：对你调用的第三方服务使用facade（外观模式）。
通过在测试中提供mock facade，你就不用在你的测试集中真的去调用这些第三方服务了。 

## 3. 在 helpers中连接HTML 

如果你正在创建helper，恭喜，至少说明你正在试图让你的视图层更整洁。
但是开发人员经常不知道一些使用helpers创建标签的常见方式，这就导致了槽糕的字符串连接或者糟糕的插值形式。 

    str = "<li class='vehicle_list'> "
    str += link_to("#{vehicle.title.upcase} Sale", show_all_styles_path(vehicle.id, vehicle.url_title))
    str += " </li>"
    str.html_safe

看吧，相当糟糕，而且容易导致XSS安全漏洞！让 content_tag 来拯救这些代码吧。 

    content_tag :li, :class => 'vehicle_list' do
        link_to("#{vehicle.title.upcase} Sale", show_all_styles_path(vehicle.id, vehicle.url_title))
    end

**TIPS**：现在就开始在helper中使用blocks（代码块）吧。当产生内嵌的HTML时，嵌入的blocks更自然、更贴切。 

## 4. Giant Queries（大查询，比如载入整张表的查询）会把一切都加载到内存 

如果你需要修正数据，你只需要遍历并且修正它，对吗？ 

    User.has_purchased(true).each do |customer|
        customer.grant_role(:customer)
    end

假设你有个百万级别客户的电商网站，假设每个用户对象需要500字节，上面的代码会在运行的时候消耗500M内存。 

下面是更好的方式： 

    User.has_purchased(true).find_each do |customer|
        customer.grant_role(:customer)
    end

find_each使用 find_in_batches 每次取出1000条记录，非常有效的降低了对内存的需求。 

**TIPS**：使用 update_all 或者原始 SQL 语句执行大的更新操作。学习SQL可能需要花费点时间，不过带来的好处是明显的：你会看到100x的性能改善。 

## 5. 代码审查 

我猜你会使用 [GitHub][1]，并且我进一步猜测你不会去pull requests（GitHub上的申请代码合并操作）。
如果你需要花费一到两天去构建一个新特性，那么到一个分支上去做吧，然后发送一个 pull request。
团队会审查你的代码，并且给出一些你没有考虑到的改进或者最新特性的建议。
我保证这样会提高你的代码质量。我们在 [TheClymb][2]项目中90%的改动都是通过这种方式完成的，并且这是100%值得去做的一个经验。 

**TIPS**：不要没有经过任何测试就合并你的pull request。测试对保证应用的稳定性非常有价值，并且可以让你踏实地睡一个好觉。 

英文原文：[Five Common Rails Mistakes][3]

[1]: http://github.com
[2]: http://www.theclymb.com/invite-from/mperham
[3]: http://www.mikeperham.com/2012/05/05/five-common-rails-mistakes
