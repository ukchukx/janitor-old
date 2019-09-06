from os import path, listdir
from django.db import models
from django.conf import settings

class Schedule(models.Model):
  db = models.CharField(max_length=15) # mysql, postgresql
  name = models.CharField(max_length=200, unique=True)
  host = models.CharField(max_length=50, default='127.0.0.1')
  port = models.IntegerField()
  username = models.CharField(max_length=200)
  password = models.CharField(max_length=200, blank=True)
  schedule = models.CharField(max_length=10) # daily, weekly
  day = models.CharField(max_length=10) # day
  time = models.CharField(max_length=5) # 12:00
  keep = models.IntegerField(default=5)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return '{}://{}:{}/{}'.format(self.db, self.host, self.port, self.name)

  def backup_path(self):
    return path.join(settings.FILES_ROOT, str(self.id))
  
  def list_backups(self):
    return listdir(self.backup_path())

  class Meta:
    db_table = 'schedules'
