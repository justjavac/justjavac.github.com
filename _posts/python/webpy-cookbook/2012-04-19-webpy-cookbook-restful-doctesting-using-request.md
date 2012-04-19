---
layout: post
title: web.py 0.3 新手指南 - RESTful doctesting using app.request
description: web.py 0.3 新手指南 - RESTful doctesting using app.request
keywords: python, web.py, 新手指南
category : python
tags : [python, web.py]
---

#!/usr/bin/env python
    
    """
    RESTful web.py testing
    
    usage: python webapp.py 8080 [--test]
    
    >>> req = app.request('/mathematicians', method='POST')
    >>> req.status
    '400 Bad Request'
    
    >>> name = {'first': 'Beno\xc3\xaet', 'last': 'Mandelbrot'}
    >>> data = urllib.urlencode(name)
    >>> req = app.request('/mathematicians', method='POST', data=data)
    >>> req.status
    '201 Created'
    >>> created_path = req.headers['Location']
    >>> created_path
    '/mathematicians/b-mandelbrot'
    >>> fn = '<h1 class=fn>{0} {1}</h1>'.format(name['first'], name['last'])
    >>> assert fn in app.request(created_path).data
    
    """
    
    import doctest
    import urllib
    import sys
    
    import web
    
    
    paths = (
      '/mathematicians(/)?', 'Mathematicians',
      '/mathematicians/([a-z])-([a-z]{2,})', 'Mathematician'
    )
    app = web.application(paths, globals())
    
    dbname = {True: 'test', False: 'production'}[sys.argv[-1] == '--test']
    db = {} # db = web.database(..., db='math_{0}'.format(dbname))
    
    
    class Mathematicians:
    
      def GET(self, slash=False):
        """list all mathematicians and form to create new one"""
        if slash:
            raise web.seeother('/mathematicians')
        mathematicians = db.items() # db.select(...)
        return web.template.Template("""$def with (mathematicians)
          <!doctype html>
          <html>
          <head>
            <meta charset=utf-8>
            <title>Mathematicians</title>
          </head>
          <body>
            <h1>Mathematicians</h1>
            $if mathematicians:
              <ul class=blogroll>
                $for path, name in mathematicians:
                  <li class=vcard><a class="fn url"
                  href=/mathematicians/$path>$name.first $name.last</a></li>
              </ul>
            <form action=/mathematicians method=post>
              <label>First <input name=first type=text></label>
              <label>Last <input name=last type=text></label>
              <input type=submit value=Add>
            </form>
          </body>
          </html>""")(mathematicians)
    
      def POST(self, _):
        """create new mathematician"""
        name = web.input('first', 'last')
        key = '{0}-{1}'.format(name.first[0].lower(), name.last.lower())
        name.first, name.last = name.first.capitalize(), name.last.capitalize()
        db[key] = name # db.insert(...)
        path = '/mathematicians/{0}'.format(key)
        web.ctx.status = '201 Created'
        web.header('Location', path)
        return web.template.Template("""$def with (path, name)
          <!doctype html>
          <html>
          <head>
            <meta charset=utf-8>
            <title>Profile Created</title>
          </head>
          <body>
            <p>Profile created for <a href=$path>$name.first $name.last</a>.</p>
          </body>
          </html>""")(path, name)
    
    
    class Mathematician:
    
      def GET(self, first_initial, last_name):
        """display mathematician"""
        key = '{0}-{1}'.format(first_initial, last_name)
        try:
            mathematician = db[key] # db.select(...)
        except KeyError:
            raise web.notfound()
        return web.template.Template("""$def with (name)
          <!doctype html>
          <html>
          <head>
            <meta charset=utf-8>
            <title>$name.first $name.last</title>
          </head>
          <body class=vcard>
            <p><a href=/mathematicians rel=up>Mathematicians</a> &#x25B8;</p>
            <h1 class=fn>$name.first $name.last</h1>
          </body>
          </html>""")(mathematician)
    
    
    if __name__ == "__main__":
      if sys.argv[-1] == '--test':
        doctest.testmod()
      else:
        app.run()