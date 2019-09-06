from django.urls import path
from .views import ScheduleView, backups, backup

urlpatterns = [
    path('schedules/', ScheduleView.as_view()),
    path('schedules/<int:pk>', ScheduleView.as_view()),
    path('schedules/<int:id>/backups', backups),
    path('schedules/<int:id>/backups/create', backup)
]