from django.shortcuts import render

from backend.models import Schedule
from backend.serializers import ScheduleSerializer
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, DestroyAPIView

class ScheduleView(ListCreateAPIView, UpdateAPIView, DestroyAPIView):
  queryset = Schedule.objects.all()
  serializer_class = ScheduleSerializer
