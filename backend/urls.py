from django.urls import path
from .views import ScheduleView

urlpatterns = [
    path('schedules/', ScheduleView.as_view()),
    path('schedules/<int:pk>', ScheduleView.as_view())
]