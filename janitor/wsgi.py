"""
WSGI config for janitor project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from janitor import migrate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'janitor.settings')
try:
  from django.core.management import execute_from_command_line
except ImportError as exc:
  raise ImportError(
      "Couldn't import Django. Are you sure it's installed and "
      "available on your PYTHONPATH environment variable? Did you "
      "forget to activate a virtual environment?"
  ) from exc
migrate.run()

application = get_wsgi_application()
