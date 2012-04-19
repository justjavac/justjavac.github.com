---
layout: post
title: Web.py Cookbook 简体中文版 - 在PostgreSQL下实现用户认证
description: Web.py Cookbook 简体中文版 - 在PostgreSQL下实现用户认证
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

##问题
- 如何利用PostgreSQL数据库实现一个用户认证系统？

##解法
- 用户认证系统有很多功能。在这个例子中，将展示如何在PostgreSQL数据库环境下一步一步完成一个用户认证系统

##必需
- 因为要用到make模板和postgreSQL数据库，所以要:
	import web
	from web.contrib.template import render_mako
	import pg

## 第一步：创建数据库
首先，为创建一个用户表。虽然这个表结构非常简单，但对于大部分项目来说都足够用了。

##
	CREATE TABLE example_users
	(
	  id serial NOT NULL,
	  user character varying(80) NOT NULL,
	  pass character varying(80) NOT NULL,
	  email character varying(100) NOT NULL,
	  privilege integer NOT NULL DEFAULT 0,
	  CONSTRAINT utilisateur_pkey PRIMARY KEY (id)
	)

## 第二步：确定网址
登录和注销对应两个网址：

- "Login" 对应登录页

- "Reset" 对应注销页

##
	urls = (
	 	'/login', 'login',
		'/reset', 'reset',
		 )



## 第三步：判断用户是否登录
要判断用户是否已登录，是非常简单的，只要有个变量记录用户登录的状态即可。在login/reset类中使用这段代码:

##
	def logged():
		if session.login==1:
			return True
		else:
			return False

## 第四步：简单的权限管理
我把我的用户划为四类：管理员，用户，读者（已登录），访客（未登录）。根据example_users表中定义的不同权限，选择不同的模板路径。

##
	def create_render(privilege):
		if logged():
			if privilege==0:
				render = render_mako(
					directories=['templates/reader'],
					input_encoding='utf-8',
					output_encoding='utf-8',
					)
			elif privilege==1:
				render = render_mako(
					directories=['templates/user'],
					input_encoding='utf-8',
					output_encoding='utf-8',
					)
			elif privilege==2:
				render = render_mako(
					directories=['templates/admin'],
					input_encoding='utf-8',
					output_encoding='utf-8',
					)
		else:
			render = render_mako(
				directories=['templates/communs'],
				input_encoding='utf-8',
				output_encoding='utf-8',
				)
		return render
	
## 第五：登录(Login)和注销(Reset)的python类
现在，让我们用个轻松的方法来解决：
- 如果你已登录，就直接重定向到login_double.html模板文件
- 否则，还是到login.html。

##
	class login:
		def GET(self):
			if logged():
				render = create_render(session.privilege)
				return "%s" % (
					render.login_double()				)
			else:
				render = create_render(session.privilege)
				return "%s" % (
					render.login()
					)

- 好了。现在写POST()方法。从.html文件中，我们得到表单提交的变量值(见login.html)，并根据变量值得到example_users表中对应的user数据
- 如果登录通过了，就重定向到login_ok.html。
- 如果没通过，就重定向到login_error.html。

##	
		def POST(self):
			user, passwd = web.input().user, web.input().passwd
			ident = db.query("select * from example_users where user = '%s'" % (user)).getresult()
			try:
				if passwd==ident[0][2]:
					session.login=1
					session.privilege=ident[0][4]
					render = create_render(session.privilege)
					return "%s" % (
							render.login_ok()
							)
				else:
					session.login=0
					session.privilege=0
					render = create_render(session.privilege)
					return "%s" % (
						render.login_error()
						)
			except:
				session.login=0
				session.privilege=0
				render = create_render(session.privilege)
				return "%s" % (
					render.login_error()
					)

对于reset方法，只要清除用户session，再重定向到logout.html模板页即可。
##
	class reset:
		def GET(self):
			session.login=0
			session.kill()
			render = create_render(session.privilege)
			return "%s" % (
				render.logout()
			 	)

## 6th: 第六步：HTML模板帮助
嗯，我认为没有人想看这个，但我喜欢把所有的信息都提供出来。最重要的就是login.html。

##
	<FORM action=/login method=POST>
		<table id="login">
			<tr>
				<td>User: </td>
				<td><input type=text name='user'></td>
			</tr>
			<tr>
				<td>Password: </td>
				<td><input type="password" name=passwd></td>
			</tr>
			<tr>
				<td></td>
				<td><input type=submit value=LOGIN></td>
			</tr>
		</table>
	</form>

## 第七：问题或疑问？
- 邮件：您可以联想我，我的邮箱是guillaume(at)process-evolution(dot)fr
- IRC：#webpy on irc.freenode.net (pseudo: Ephedrax) 
- 翻译：我是法国人，我的英文不好...你可以修改我的文档(译注：哈哈，谦虚啥，你那是没见过wrongway的山东英文...)