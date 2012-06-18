from datetime import datetime
import time
import re
import logging

from google.appengine.ext import db
from google.appengine.api import memcache
from google.appengine.api.labs import taskqueue
from google.appengine.ext import deferred
from google.appengine.api import users
from google.appengine.ext.db import Key


class Round(db.Model):
  message = db.StringProperty(multiline=True)
  endmessage = db.StringProperty(multiline=True)
  language = db.StringProperty(default='ENGLISH')
  translations = db.TextProperty()
  date = db.DateTimeProperty(auto_now_add=True)
  views = db.IntegerProperty(default=1)
  usergen = db.BooleanProperty(default=True)

  def to_dict(self):
    return {'id': self.key().id(),
            'message': self.message,
            'views': self.views}
            
  def get_views(self):
    views = self.views
    cached_views = memcache.get('views-' + str(self.key().id()), self.key().kind())
    if cached_views:
      views += cached_views
    return views

  @classmethod
  def flush_views(cls, id):
    round = cls.get_by_id(id)
    if not round:
      round = cls()

    # Get the current value
    value = memcache.get('views-' + str(id), cls.kind())
    # Subtract it from the memcached value
    if not value:
      return

    memcache.decr('views-' + str(id), int(value), cls.kind())

    # Store it to the counter
    round.views += int(value)
    round.put()

  @classmethod
  def incr_views(cls, id, interval=5, value=1):
    """Increments the named counter.

    Args:
      name: The name of the counter.
      interval: How frequently to flush the counter to disk.
      value: The value to increment by.
    """
    memcache.incr('views-' + str(id), delta=value, namespace=cls.kind(), initial_value=0)
    interval_num = get_interval_number(datetime.now(), interval)
    task_name = '-'.join([cls.kind(), re.sub('[^a-zA-Z0-9-]*', '', str(id)), 'views', str(interval), str(interval_num)])
    try:
      deferred.defer(cls.flush_views, id, _name=task_name)
    except (taskqueue.TaskAlreadyExistsError, taskqueue.TombstonedTaskError, taskqueue.TransientError):
      pass

def get_interval_number(ts, duration):
  """Returns the number of the current interval.

  Args:
    ts: The timestamp to convert
    duration: The length of the interval
  Returns:
    int: Interval number.
  """
  return int(time.mktime(ts.timetuple()) / duration)
            
