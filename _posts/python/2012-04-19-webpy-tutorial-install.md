---
layout: post
title: web.py 0.3 新手指南 - 安装
description: web.py 0.3 新手指南 - 安装
keywords: python, web.py, 新手指南, 安装
category : python
tags : [python, web.py]
---

<h2>Summary</h2>

<ul>
<li><a href="#install">安装</a></li>
<li><a href="#dev">开发</a></li>
<li><a href="#prod">产品</a>

<ul>
<li><a href="#lighttpd">LightTPD</a>

<ul>
<li><a href="#lighttpdfastcgi">.. 使用 FastCGI</a></li>
</ul>
</li>
<li><a href="#apache">Apache</a>

<ul>
<li><a href="#apachecgi">.. 使用 CGI</a></li>
<li><a href="#apachecgihtaccess"> .. 使用 CGI using .htaccess</a></li>
<li><a href="#apachefastcgi">.. 使用 FastCGI</a></li>
<li><a href="#apachescgi">.. 使用 SCGI</a></li>
<li><a href="#apachemodpython">.. 使用 mod_python</a></li>
<li><a href="#apachemodwsgi">.. 使用 mod_wsgi</a></li>
<li><a href="#apachemodrewrite">.. 使用 mod_rewrite</a></li>
</ul>
</li>
</ul>
</li>
</ul>


<h2 name="install">安装</h2>

<p>安装web.py, 请先下载：</p>

<pre><code>http://webpy.org/static/web.py-0.33.tar.gz
</code></pre>

<p>解压并拷贝 <em>web</em> 文件夹到你的应用程序目录下。 或者，为了让所有的应用程序都可以使用，运行：</p>

<pre><code>python setup.py install
</code></pre>

<p>注意: 在某些类unix系统上你可能需要切换到root用户或者运行：</p>

<pre><code>sudo python setup.py install
</code></pre>

<p>查看 <a href="http://justjavac.com/python/2012/04/19/webpy-tutorial-recommended_setup/">推荐设置</a>.</p>

<p>另外一个选择是使用<a href="http://peak.telecommunity.com/DevCenter/EasyInstall">Easy Install</a>. Easy Install 使用如下：</p>

<pre><code>easy_install web.py
</code></pre>

<h2 name="dev">开发</h2>

<p>web.py 内置了web服务器。可以按照 <a href="http://justjavac.com/python/2012/04/19/webpy-tutorial/">tutorial</a> 学习如何写一个Web应用。 写完后，将你的代码放到 <code>code.py</code> 并如下面的方法来启动服务器：</p>

<pre><code> python code.py
</code></pre>

<p>打开你的浏览器输入 <a href="http://localhost:8080/">http://localhost:8080/</a> 查看页面。 若要制定另外的端口，使用 <code>python code.py 1234</code>。</p>

<h2 name="prod">产品</h2>

<p>现在所运行 web.py 程序的web服务器是挺不错的， 但绝大多数网站还是需要更加专业一些的web服务器。web.py 实现了 <a href="http://www.python.org/dev/peps/pep-0333/">WSGI</a> 并能在任何兼容它的服务器上运行。 WSGI 是一个web服务器与应用程序之间的通用API, 就如Java 的 Servlet 接口。 你需要安装 <a href="http://trac.saddi.com/flup">flup</a> (<a href="http://www.saddi.com/software/flup/dist/">download here</a>) 使web.py 支持with CGI， FastCGI 或 SCGI， flup提供了这些API的WSGI接口。</p>

<p>对于所有的CGI变量， 添加以下到你的 <code>code.py</code>:</p>

<pre><code>#!/usr/bin/env python
</code></pre>

<p>并运行 <code>chmod +x code.py</code> 添加可执行属性。</p>

<h3 name="lighttpd">LightTPD</h3>

<h4 name="lighttpdfastcgi">.. 使用 FastCGI</h4>

<p>在产品中通过FastCGI结合lighttpd是web.py使用的一种推荐方法。 <a href="http://reddit.com/">reddit.com</a> 通过该方法来处理百万次的点击。</p>

<p>lighttpd config设置参考如下：</p>

<pre><code> server.modules = ("mod_fastcgi", "mod_rewrite")
 server.document-root = "/path/to/root/"     
 fastcgi.server = ( "/code.py" =&gt;     
 (( "socket" =&gt; "/tmp/fastcgi.socket",
    "bin-path" =&gt; "/path/to/root/code.py",
    "max-procs" =&gt; 1
 ))
 )

 url.rewrite-once = (
   "^/favicon.ico$" =&gt; "/static/favicon.ico",
   "^/static/(.*)$" =&gt; "/static/$1",
   "^/(.*)$" =&gt; "/code.py/$1"
 )
</code></pre>

<p>在某些版本的lighttpd中， 需要保证fastcgi.server选项下的"check-local"属性设置为"false", 特别是当你的 <code>code.py</code> 不在文档根目录下。</p>

<p>如果你得到错误显示不能够导入flup， 请在命令行下输入 "easy_install flup" 来安装。</p>

<p>从修订版本 145开始， 如果你的代码使用了重定向，还需要在fastcgi选项下设置bin-environment变量。 如果你的代码重定向到http://domain.com/ 而在url栏中你会看到 http://domain.com/code.py/， 你可以通过设置这个环境变量来阻止。 这样你的fastcgi.server设置将会如下：</p>

<pre><code>fastcgi.server = ( "/code.py" =&gt;
((
   "socket" =&gt; "/tmp/fastcgi.socket",
   "bin-path" =&gt; "/path/to/root/code.py",
   "max-procs" =&gt; 1,
   "bin-environment" =&gt; (
     "REAL_SCRIPT_NAME" =&gt; ""
   ),
   "check-local" =&gt; "disable"
))
)
</code></pre>

<h3 name="apache">Apache</h3>

<h4 name="apachecgi">.. 使用 CGI</h4>

<p>添加以下到 <code>httpd.conf</code> 或 <code>apache2.conf</code>。</p>

<pre><code>Alias /foo/static/ /path/to/static
ScriptAlias /foo/ /path/to/code.py
</code></pre>

<h4 name="apachecgihtaccess">.. 使用 CGI .htaccess</h4>

<p>CGI很容易配置， 但不适合高性能网站。
添加以下到你的 <code>.htaccess</code>：</p>

<pre><code>Options +ExecCGI
AddHandler cgi-script .py
</code></pre>

<p>将你的浏览器指向 <code>http://example.com/code.py/</code>。 不要忘记最后的斜杠，否则你将会看到 <code>not found</code> 消息 (因为在 <code>urls</code> 列表中你输入的没有被匹配到). 为了让其运行的时候不需要添加 <code>code.py</code>， 启用mod_rewrite 法则 (查看如下)。</p>

<p>注意: <code>web.py</code> 的实现破坏了 <code>cgitb</code> 模块，因为它截取了 <code>stdout</code>。 可以通过以下的方法来解决该问题：</p>

<pre><code>import cgitb; cgitb.enable()
import sys

# ... import web etc here...

def cgidebugerror():
    """                                                                         
    """        _wrappedstdout = sys.stdout

    sys.stdout = web._oldstdout
    cgitb.handler()

    sys.stdout = _wrappedstdout

web.internalerror = cgidebugerror
</code></pre>

<h4 name="apachefastcgi">.. 使用 FastCGI</h4>

<p>FastCGI很容易配置，运行方式如同mod_python。</p>

<p>添加以下到 <code>.htaccess</code>：</p>

<pre><code>&lt;Files code.py&gt;      SetHandler fastcgi-script
&lt;/Files&gt;
</code></pre>

<p>不幸的是, 不像lighttpd, Apache不能够暗示你的web.py脚本以FastCGI 服务器的形式工作，因此你需要明确的告诉web.py。 添加以下到 <code>code.py</code>的  <code>if __name__ == "__main__":</code> 行前：</p>

<pre><code>web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
</code></pre>

<p>将你的浏览器指向 <code>http://example.com/code.py/</code>。 不要忘记最后的斜杠，否则你将会看到 <code>not found</code> 消息 (因为在 <code>urls</code> 列表中你输入的没有被匹配到). 为了让其运行的时候不需要添加 <code>code.py</code>， 启用mod_rewrite 法则 (查看如下)。</p>

<p><a href="http://lemurware.blogspot.com/2006/05/webpy-apache-configuration-and-you.html">Walter 还有一些额外建议</a>.</p>

<h4 name="apachescgi">.. 使用 SCGI</h4>

<p>https://www.mems-exchange.org/software/scgi/
从 http://www.mems-exchange.org/software/files/mod_scgi/ 下载 <code>mod_scgi</code> 代码
windows apache 用户：
编辑 httpd.conf：</p>

<pre><code>LoadModule scgi_module Modules/mod_scgi.so
SCGIMount / 127.0.0.1:8080
</code></pre>

<p>重启apache，并在命令行中如下方式启动code.py：</p>

<pre><code>python code.py 127.0.0.1:8080 scgi
</code></pre>

<p>打开你的浏览器，访问127.0.0.1
It's ok!</p>

<h4 name="apachemodpython">.. 使用 mod_python</h4>

<p>mod_python 运行方式如同FastCGI， 但不是那么方便配置。</p>

<p>对于 Python 2.5 按照如下：</p>

<pre><code>cd /usr/lib/python2.5/wsgiref
# or in windows: cd /python2.5/lib/wsgiref
wget -O modpython_gateway.py http://projects.amor.org/misc/browser/modpython_gateway.py?format=raw
# or fetch the file from that address using your browser
</code></pre>

<p>对于 Python &lt;2.5 按照如下：</p>

<pre><code>cd /usr/lib/python2.4/site-packages
# or in windows: cd /python2.4/lib/site-packages
svn co svn://svn.eby-sarna.com/svnroot/wsgiref/wsgiref
cd wsgiref
wget -O modpython_gateway.py http://projects.amor.org/misc/browser/modpython_gateway.py?format=raw
# or fetch the file from that address using your browser  
</code></pre>

<p>重命名 <code>code.py</code> 为 <code>codep.py</code> 或别的名字， 添加：</p>

<pre><code>main = web.wsgifunc(web.webpyfunc(urls, globals()))
</code></pre>

<p>在 <code>.htaccess</code> 中， 添加：</p>

<pre><code>AddHandler python-program .py
PythonHandler wsgiref.modpython_gateway::handler
PythonOption wsgi.application codep::main
</code></pre>

<p>你应该希望添加  <code>RewriteRule</code> 将 <code>/</code> 指向 <code>/codep.py/</code></p>

<p>确保访问 <code>/codep.py/</code> 的时候有添加最后的 <code>/</code>。  否则，你将会看到一条错误信息，比如 <code>A server error occurred. Please contact the administrator.</code></p>

<h4 name="apachemodwsgi">.. 使用 mod_wsgi</h4>

<p>mod_wsgi 是一个新的Apache模块 <a href="http://code.google.com/p/modwsgi/wiki/PerformanceEstimates">通常优于mod_python</a> 用于架设WSGI应用，它非常容易配置。</p>

<p>在 <code>code.py</code> 的最后添加：</p>

<pre><code>application = web.wsgifunc(web.webpyfunc(urls, globals()))
</code></pre>

<p>mod_wsgi 提供 <a href="http://code.google.com/p/modwsgi/wiki/ConfigurationDirectives">许多可行方法</a> 来实现WSGI应用, 但一种简单的方法是添加以下到 .htaccess：</p>

<pre><code>&lt;Files code.py&gt;
    SetHandler wsgi-script
    Options ExecCGI FollowSymLinks
&lt;/Files&gt;
</code></pre>

<p>如果在apache的 error.log 文件中出现 "ImportError: No module named web"， 在导入web之前，你可能需要在code.py中尝试设置绝对路径：</p>

<pre><code>import sys, os
abspath = os.path.dirname(__file__)
sys.path.append(abspath)
os.chdir(abspath)
import web
</code></pre>

<p>同时， 你可能需要查看 <a href="http://code.google.com/p/modwsgi/wiki/ApplicationIssues">WSGI应用的常见问题</a>的 "Application Working Directory" 部分。</p>

<p>最终应该可以访问 <code>http://example.com/code.py/</code>。</p>

<h4 name="apachemodrewrite">mod_rewrite 法则，Apache</h4>

<p>如果希望 web.py 能够通过 'http://example.com' 访问，代替使用 'http://example.com/code.py/'， 添加以下法则到 <code>.htaccess</code> 文件：</p>

<pre><code>&lt;IfModule mod_rewrite.c&gt;      
  RewriteEngine on
  RewriteBase /
  RewriteCond %{REQUEST_URI} !^/icons
  RewriteCond %{REQUEST_URI} !^/favicon.ico$
  RewriteCond %{REQUEST_URI} !^(/.*)+code.py/
  RewriteRule ^(.*)$ code.py/$1 [PT]
&lt;/IfModule&gt;
</code></pre>

<p>如果 <code>code.py</code> 在子目录 <code>myapp/</code>中， 调整 RewriteBase 为 <code>RewriteBase /myapp/</code>。 如果还有一些静态文件如CSS文件和图片文件, 复制这些并改成你需要的地址。</p>
