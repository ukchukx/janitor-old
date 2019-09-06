from django.urls import path
from .views import ScheduleView, backups, backup, delete_backup, download

urlpatterns = [
    path('schedules/', ScheduleView.as_view()),
    path('schedules/<int:pk>', ScheduleView.as_view()),
    path('schedules/<int:id>/backups', backups),
    path('schedules/<int:id>/backups/create', backup),
    path('schedules/<int:id>/backups/<str:file>/delete', delete_backup),
    path('schedules/<int:id>/backups/<str:file>', download)
]