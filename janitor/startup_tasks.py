import os
import sys
import logging

logger = logging.getLogger(__name__)

def run_migrations():
  from django.core.management import execute_from_command_line
  execute_from_command_line(['manage.py', 'migrate'])

def create_superuser():
  from django.contrib.auth import get_user_model
  from sqlite3 import IntegrityError
  from janitor import settings

  User = get_user_model()
  username = settings.SUPERUSER_USERNAME
  email = settings.SUPERUSER_EMAIL
  password = settings.SUPERUSER_PASSWORD

  if username is None and email is None and password is None:
    logger.info('Environment variables not set. Skip superuser creation.')
    return

  superuser_exists = User.objects.filter(username=username).exists()

  logger.info('Does superuser exists? {}'.format(superuser_exists))
  
  if not superuser_exists:
    logger.info('Creating superuser.')

    try:
      User.objects.create_superuser(username=username, email=email, password=password)
    except IntegrityError:
      logger.error('Username taken.')
