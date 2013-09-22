---
layout:     post
title:      Linux 计划任务 — crontab
keywords: linux, cron
category : other
tags : [linux, cron]
---

原文：[Linux 计划任务 — crontab](http://letcodefly.com/article/1)

作者：[singleseeker](http://weibo.com/singleseeker)

## cron 简介

`cron` 是 UNIX, SOLARIS，LINUX 下的一个十分有用的工具。通过 `cron` 脚本能使计划任务定期地在系统后台自动运行。

## cron 命令

- `crontab -e` – 编辑该用户的 crontab，当指定 crontab 不存在时新建。
- `crontab -l` – 列出该用户的 crontab。
- `crontab -r` – 删除该用户的 crontab。
- `crontab -u<用户名称>` – 指定要设定 crontab 的用户名称。

## Linux Crontab 格式

表格: Crontab 字段与允许的值 (Linux Crontab)

<table class="table table-bordered">
<thead>
<tr><th>字段</th><th>描述</th><th>允许的值</th></tr>
</thead>
<tbody>
<tr>
<td>分钟</td>
<td>一小时的第几分</td>
<td>0-59</td>
</tr>
<tr>
<td>小时</td>
<td>一天的第几小时</td>
<td>0-23</td>
</tr>
<tr>
<td>日期</td>
<td>一个月的的第几天</td>
<td>1-31</td>
</tr>
<tr>
<td>月份</td>
<td>一年的第几个月</td>
<td>1-12</td>
</tr>
<tr>
<td>周几</td>
<td>一周的第几天</td>
<td>0-6</td>
</tr>
<tr>
<td>命令</td>
<td>命令</td>
<td>可以被执行的任何命令</td>
</tr>
</tbody>
</table>

## cron 实例

### 1. 特定时间执行

cron 的基本用法是在特定的时间执行一项任务，如下是 6 月 10 上午 8:30 执行 Full backup shell script。
**要注意的是时间字段采用的是 24 小时制，如果是下午 8 点，则改写为 20 点**

	30 08 10 06 * /home/ramesh/full-backup

- `30` – 第 30 分钟
- `08` – 早上 8 点
- `10` – 10 号
- `06` – 第 6 个月 (6 月)
- `*` – 一周的任何一天

### 2. 安排多个实例（比如一天执行两次）

下面的增量备份脚本每天执行两次。

每天于 11:00, 16:00 执行，逗号两侧的时间都会执行。

	00 11,16 * * * /home/ramesh/bin/incremental-backup

- `00` – 第 0 分钟 (每小时开时)
- `11,16` – 早上 11 点与下午 4 点
- `*` – 每天
- `*` – 每个月
- `*` – 一周的任何一天

### 3. 让任务只在特定时间执行（比如仅当工作日时执行）

下面这个例子是每天 9:00-16:00 检查数据库状态（包括周六）

	00 09-18 * * * /home/ramesh/bin/check-db-status

- `00` – 第 0 分钟 (每小时开时)
- `09-18` – 9 点, 10 点, 11 点, 12 点, 下午 1 点, 下午 2 点, 下午 3 点, 下午 4 点, 下午 5 点, 下午 6 点
- `*` – 每天
- `*` – 每个月
- `*` – 一周的任何一天

如果只想工作日执行此操作

	00 09-18 * * 1-5 /home/ramesh/bin/check-db-status

- `00` – 第 0 分钟 (每小时开时)
- `09-18` – 9 点, 10 点, 11 点, 12 点, 下午 1 点, 下午 2 点, 下午 3 点, 下午 4 点, 下午 5 点, 下午 6 点
- `*` – 每天
- `*` – 每个月
- `1-5` – 周一, 周二, 周三, 周四和周五 (工作日)

### 4. 如何查看 cron 定时任务

查看当前用户定时任务

	ramesh@dev-db$ crontab -l

查看 ROOT 用户定时任务，用 root 登入 su-root，再执行 `crontab -l`

	root@dev-db# crontab -l
	no crontab for root

查看其它用户定时任务

	root@dev-db# crontab -u sathiya -l
	@monthly /home/sathiya/monthly-backup
	00 09-18 * * * /home/sathiya/check-db-status

### 5. 如何编辑 cron 定时任务

	ramesh@dev-db$ crontab -e

### 6. 安排每分钟都执行定时任务

理论情况下，没有每分钟都要执行的 shell，但下面这个例子，让我们更好的了解 crontab

	* * * * * 命令

`*` 代表着所有可能取到的值，除了直接用 `*` 外，下面的几个例子也较为常用

- 当指定 `*/5` 在分钟字段，代表每五分钟。
- 当指定 `0-10/2` 在分钟字段，代表在前十分钟的每两分钟

上面的例子对于其它四个字段同样试用

### 7. 安排后台每十分钟执行定时任务

	*/10 * * * * /home/ramesh/check-disk-space

有一些特殊的例子，可以用关键字替代上述五个字段– `reboot`, `midnight`, `yearly`, `hourly`

Table: Cron special keywords and its meaning

<table class="table table-bordered">
<thead>
<tr><th>Keyword</th><th>Equivalent</th></tr>
</thead>
<tbody>
<tr>
<td>@yearly</td>
<td>0 0 1 1 *</td>
</tr>
<tr>
<td>@daily</td>
<td>0 0 * * *</td>
</tr>
<tr>
<td>@hourly</td>
<td>0 * * * *</td>
</tr>
<tr>
<td>@reboot</td>
<td>重启时运行</td>
</tr>
</tbody>
</table>

### 8. 每一年的第一分钟执行定时任务（@yearly）

下面的例子将在每一年的 1 月 1 日 0:00 执行

	@yearly /home/ramesh/red-hat/bin/annual-maintenance

### 9. 每月执行定时任务（@mothly）

下面的例子将在每月 1 日 0:00 执行

	@monthly /home/ramesh/suse/bin/tape-backup

### 10. 每天执行定时任务（@daily）

下面的例子将在每天 0:00 执行

	@daily /home/ramesh/arch-linux/bin/cleanup-logs "day started"

### 11. 每次重启时执行定时任务（@reboot）

	@reboot CMD

### 12. 如何用 mail 关键字禁止/重定向 cron 的邮件

默认情况下，crontab 将向布置定时任务的管理员发送邮件，如果想重定向此用户，添加并更新 MAIL

	ramesh@dev-db$ crontab -l
	MAIL="ramesh"
	 
	@yearly /home/ramesh/annual-maintenance
	*/10 * * * * /home/ramesh/check-disk-space

如果不想任何人接收，则直接将 MAIL 置空

### 13. 如何系秒每执行一个定时任务

无法安排每秒执行，因为最小处理单元是分钟，另一方面，没有什么理由让我们每秒都执行一任务

### 14. cron 中的 PATH 变量

上面的例子都是用绝对的路径

如果你想用相对的路径，设置环境变量可以在 crontab 增加

	ramesh@dev-db$ crontab -l
	 
	PATH=/bin:/sbin:/usr/bin:/usr/sbin:/home/ramesh
	 
	@yearly annual-maintenance
	*/10 * * * * check-disk-space

### 15. 从 cron 文件中定义 cron 任务

除了直接编辑外，你也可以先在一个文件中编辑好任务，再导入

	ramesh@dev-db$ crontab -l
	no crontab for ramesh
	 
	$ cat cron-file.txt
	@yearly /home/ramesh/annual-maintenance
	*/10 * * * * /home/ramesh/check-disk-space
	 
	ramesh@dev-db$ crontab cron-file.txt
	 
	ramesh@dev-db$ crontab -l
	@yearly /home/ramesh/annual-maintenance
	 
	*/10 * * * * /home/ramesh/check-disk-space

**应用时要注意，此操作会删除原有的cron任务**