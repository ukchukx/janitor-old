from os import path, listdir
from time import gmtime, strftime
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
    backups = listdir(self.backup_path()) if path.exists(self.backup_path()) else []

    backups.sort(key=lambda b : path.getmtime(path.join(self.backup_path(), b)))
    return backups

  def new_file_path(self):
    return path.join(self.backup_path(), self.new_file_name())

  def new_file_name(self):
    return '{}_{}.sql'.format(self.name, strftime("%Y-%m-%d_%H:%M:%S", gmtime()))

  def backup_command(self):
    if self.db == 'mysql':
      return 'MYSQL_PWD="{}" mysqldump -h {} --port={} -u {} {} > {}'.format(
        self.password,
        '127.0.0.1' if self.host == 'localhost' else self.host,
        self.port,
        self.username,
        self.name,
        self.new_file_path())

    elif self.db == 'postgresql':
      return 'PGPASSWORD="{}" pg_dump -U {} -h {} --port={} {} > {}'.format(
        self.password,
        self.username,
        self.host,
        self.port,
        self.name,
        self.new_file_path())

    else:
      return 'echo 0'

  class Meta:
    db_table = 'schedules'
