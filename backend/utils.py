import errno
import logging
from os import path, makedirs, remove, rmdir, listdir
import sched, time, datetime
from django.conf import settings
from .models import Schedule

logger = logging.getLogger(__name__)

def create_dir(dirname):
  if not path.exists(dirname):
    try:
      makedirs(dirname)
    except OSError as e:
      if e.errno != errno.EEXIST:
        raise

def run_backup(schedule):
  from subprocess import run

  logger.info('Running scheduled backup for {}'.format(schedule))

  create_dir(schedule.backup_path())
  run(schedule.backup_command(), shell=True)
  remove_expired_backups(schedule)

def run_backups(schedules):
  from multiprocessing import Process

  logger.info('Running  backups for {} schedules'.format(len(schedules)))

  processes = []

  for schedule in schedules:
    process = Process(target=run_backup, args=(schedule,))
    processes.append(process)
    process.start()

  for process in processes:
    process.join()


def run_eligible_backups():
  import calendar
  from pytz import timezone

  now = datetime.datetime.now(timezone('Africa/Lagos'))
  day_string = calendar.day_name[now.weekday()]
  time_string = '{}:{}'.format(now.hour, now.minute if now.minute > 9 else '0{}'.format(now.minute))

  logger.info('Look for and run eligible backups at {}'.format(now))

  # Filter out weekly schedules that aren't due today
  schedules = filter(lambda s : True if s.schedule == 'daily' else s.day == day_string, Schedule.objects.all())
  # Remove schedules that are not due this minute
  schedules = filter(lambda s : s.time == time_string, schedules)
  run_backups(list(schedules))


def remove_deleted_backups():
  logger.info('Remove folders for non-existent schedules')

  ids = list(map(lambda s: s.id, Schedule.objects.all()))

  for backup_dir in listdir(settings.FILES_ROOT):
    if int(backup_dir) not in ids:
      rmdir(path.join(settings.FILES_ROOT, backup_dir))


def remove_expired_backups(schedule):
  backups = schedule.list_backups()

  if len(backups) == 0:
    return

  backups.sort(key=lambda b : path.getmtime(path.join(schedule.backup_path(), b)))

  num_to_delete = len(backups) - schedule.keep

  if num_to_delete > 0:
    for b in backups[:num_to_delete]:
      try:
        remove(path.join(schedule.backup_path(), b))
      except OSError:
        pass


def get_available_databases(host=None, port=None, username=None, password='', db='mysql'):
  from subprocess import run, PIPE

  if db == 'mysql':
    host = '127.0.0.1' if host == 'localhost' else host
    command = 'MYSQL_PWD="{}" mysql -h {} --port={} -u {} -e "show databases;"'.format(
      password,
      host,
      port,
      username
    )

    shell_output = run(command, shell=True, stdout=PIPE).stdout.decode('utf-8').split('\n')
    return list(filter(lambda s: s != 'Database' and len(s), shell_output))

  elif db == 'postgresql':
    command = 'PGPASSWORD="{}" psql -U {} -h {} --port={} -c "select datname from pg_database;"'.format(
      password,
      username,
      host,
      port
    )

    shell_output = run(command, shell=True, stdout=PIPE).stdout.decode('utf-8').split('\n')
    del shell_output[0] # Remove datname
    del shell_output[0] # Remove all dashes
    shell_output = map(lambda s: s.strip(), shell_output) # Remove paddings
    shell_output = list(filter(lambda s: len(s), shell_output)) # Remove empty strings
    del shell_output[-1] # Remove (x rows)

    return shell_output

  else:
    return []
