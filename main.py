import os
import random
import logging
import webapp2
import jinja2
import json

from google.appengine.ext.webapp import util
from google.appengine.api import memcache

import models


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


def is_debug():
  if os.environ['SERVER_SOFTWARE'].startswith('Dev'):
    return True
  else:
    return False
    

class BasePageHandler(webapp2.RequestHandler):
  
  def get(self):
    page = memcache.get(self.get_filename())
    if is_debug(): 
      page = None
    if page is None:
      template = JINJA_ENVIRONMENT.get_template('templates/%s' % self.get_filename())
      page = template.render({})
      memcache.set(self.get_filename(), page, 60*1)
    self.response.out.write(page)
  
  def post(self):
    self.get()
          
class IndexHandler(BasePageHandler):
  def get_filename(self):
    return 'index.html'


class RecentHandler(BasePageHandler):
  def get_filename(self):
    return 'recent.html'


class PopularHandler(BasePageHandler):
  def get_filename(self):
    return 'popular.html'


class YoursHandler(BasePageHandler):
  def get_filename(self):
    return 'yours.html'


class RoundHandler(webapp2.RequestHandler):
  
  def get(self):
    id = int(self.request.get('id'))
    round = models.Round.get_by_id(id)
    models.Round.incr_views(id)
    self.response.out.write(round.translations)
    
  def post(self):
    round = models.Round()
    round.translations = self.request.get('translations')
    round.message = self.request.get('message')
    round.language = self.request.get('language')
    round.endmessage = self.request.get('endmessage')
    if self.request.get('usergen') == 'false':
      round.usergen = False
    round.put()
    self.response.out.write(round.key().id())
    

class RoundsHandler(webapp2.RequestHandler):
  
  def get(self):
    order = self.request.get('order')
    num = self.request.get('num')
    rounds_str = memcache.get(order + num)
    if is_debug():
      rounds_str = None
    if rounds_str is None:
      num = int(num)
      if order == '-views' and num < 5: #popular
        rounds = models.Round.all().filter('usergen = ', True).order(order).fetch(40)
        random.shuffle(rounds)
        rounds = rounds[0:num]
      else:
        rounds = models.Round.all().filter('usergen = ', True).order(order).fetch(num)
      rounds_str = json.dumps([r.to_dict() for r in rounds])
      memcache.set(order, rounds_str, 60)
    # Might change popular to just be last week/day/etc
    self.response.out.write(rounds_str)
    
    
app = webapp2.WSGIApplication([('/', IndexHandler),
                                          ('/recent', RecentHandler),
                                          ('/popular', PopularHandler),
                                          ('/yours', YoursHandler),
                                          ('/round', RoundHandler),
                                          ('/rounds', RoundsHandler)],
                                         debug=True)
