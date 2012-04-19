---
layout: post
title: Web.py Cookbook 简体中文版 - 用soaplib实现webservice
description: Web.py Cookbook 简体中文版 - 用soaplib实现webservice
keywords: python, web.py, cookbook
category : python
tags : [python, web.py, cookbook]
---

## 问题

如何用soaplib实现webservice?

## 解法

Optio的[soaplib](http://trac.optio.webfactional.com/)通过用装饰器指定类型，从而直接编写SOAP web service。而且它也是到目前为止，唯一为web service提供WSDL文档的Python类库。



    import web 
    from soaplib.wsgi_soap import SimpleWSGISoapApp
    from soaplib.service import soapmethod
    from soaplib.serializers import primitive as soap_types

    urls = ("/hello", "HelloService",
            "/hello.wsdl", "HelloService",
            )
    render = web.template.Template("$def with (var)\n$:var")


    
    class SoapService(SimpleWSGISoapApp):
        """Class for webservice """

        #__tns__ = 'http://test.com'
    
        @soapmethod(soap_types.String,_returns=soap_types.String)
        def hello(self,message):
            """ Method for webservice"""
            return "Hello world "+message
     


    class HelloService(SoapService):
        """Class for web.py """
        def start_response(self,status, headers):
            web.ctx.status = status
            for header, value in headers:
                web.header(header, value)
    
    
        def GET(self):
            response = super(SimpleWSGISoapApp, self).__call__(web.ctx.environ, self.start_response)
            return render("\n".join(response))
    
    
        def POST(self):
            response = super(SimpleWSGISoapApp, self).__call__(web.ctx.environ, self.start_response)
            return render("\n".join(response))
     
    app=web.application(urls, globals())
    
    if __name__ == "__main__":
        app.run()




可以用soaplib客户端测试一下：

    >>> from soaplib.client import make_service_client
    >>> from test import HelloService
    >>> client = make_service_client('http://localhost:8080/hello', HelloService())
    >>> client.hello('John')
    'Hello world John'

可以在[http://localhost:8080/hello.wsdl](http://localhost:8080/hello.wsdl)查看WSDL。

欲了解更多，请查看 [soaplib](http://trac.optio.webfactional.com/),