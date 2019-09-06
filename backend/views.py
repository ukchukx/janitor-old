from os import path
import logging
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import authentication_classes

from backend.models import Schedule
from backend.serializers import ScheduleSerializer
from .utils import run_backups, removed_deleted_backups


class CsrfExemptSessionAuthentication(SessionAuthentication):
  def enforce_csrf(self, request):
    return

class ScheduleView(ListCreateAPIView, UpdateAPIView, DestroyAPIView):
  authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
  queryset = Schedule.objects.all()
  serializer_class = ScheduleSerializer


@login_required
@api_view(['GET'])
@authentication_classes((CsrfExemptSessionAuthentication, BasicAuthentication))
def backups(request, id):
  try:
    schedule = Schedule.objects.get(pk=id)
  except Schedule.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

  return Response([] if not path.exists(schedule.backup_path()) else schedule.list_backups())

@login_required
@api_view(['POST'])
@authentication_classes((CsrfExemptSessionAuthentication, BasicAuthentication))
def backup(request, id):
  logger = logging.getLogger(__name__)

  try:
    schedule = Schedule.objects.get(pk=id)

    existing_backups = schedule.list_backups()
    
    from threading import Thread
    thread = Thread(target=run_backups, args=([schedule],), daemon=True)
    thread.start()
    logger.info('Running an immediate backup for {}'.format(schedule))
    thread.join()

    updated_backups = schedule.list_backups()

    if len(existing_backups) is 0:
      file_name = 'ERR' if len(updated_backups) is 0 else updated_backups[-1]
    else:
      file_name = 'ERR' if existing_backups[-1] == updated_backups[-1] else updated_backups[-1]

  except Schedule.DoesNotExist:
    file_name = 'ERR'

  if file_name is not 'ERR':
    return Response({ 'backup': file_name }) 
  else:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
