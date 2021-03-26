from datetime import timedelta
from timeloop import Timeloop
from django.urls import path
from .views import ScheduleView, backups, backup, delete_backup, download, databases
from .utils import remove_deleted_backups, run_eligible_backups

urlpatterns = [
    path('schedules/', ScheduleView.as_view()),
    path('schedules/<int:pk>', ScheduleView.as_view()),
    path('schedules/<int:id>/backups', backups),
    path('schedules/<int:id>/backups/create', backup),
    path('schedules/<int:id>/backups/<str:file>/delete', delete_backup),
    path('schedules/<int:id>/backups/<str:file>', download),
    path('schedules/databases', databases)
]

worker = Timeloop()

@worker.job(interval=timedelta(seconds=3600))
def scheduled_tasks():
  remove_deleted_backups()
  run_eligible_backups()

worker.start(block=False)
