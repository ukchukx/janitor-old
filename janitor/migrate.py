import os
import sys
import logging

logger = logging.getLogger(__name__)

def run():
  from django.core.management import execute_from_command_line
  execute_from_command_line(['manage.py', 'migrate'])

def create_superuser():
  from django.contrib.auth import get_user_model
  from janitor import settings

  User = get_user_model()
  username = settings.SUPERUSER_USERNAME
  email = settings.SUPERUSER_EMAIL
  password = settings.SUPERUSER_PASSWORD

  logger.info('Checking if the superuser exists.')
  
  if not User.objects.filter(username=username).exists():
    logger.info('Superuser not found. Creating...')
    User.objects.create_superuser(username=username, email=email, password=password)
  else:
    logger.info('Superuser exists.')