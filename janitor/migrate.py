import os
import sys

def run():
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'janitor.settings')
  from django.core.management import execute_from_command_line
  execute_from_command_line(['manage.py', 'migrate'])