from os import path
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from backend.models import Schedule
from backend.serializers import ScheduleSerializer

class ScheduleView(ListCreateAPIView, UpdateAPIView, DestroyAPIView):
  queryset = Schedule.objects.all()
  serializer_class = ScheduleSerializer


@login_required
@api_view(['GET'])
def backups(request, id):
  try:
    schedule = Schedule.objects.get(pk=id)
  except Schedule.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

  return Response([] if not path.exists(schedule.backup_path()) else schedule.list_backups())