from django.apps import AppConfig


class BackendConfig(AppConfig):
  name = 'backend'

  def ready(self):
    from .utils import start_schedule
    start_schedule()
