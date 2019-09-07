from os import path, remove
import logging
from django.conf import settings
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET
from django.http import Http404, HttpResponse
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import authentication_classes

from backend.models import Schedule
from backend.serializers import ScheduleSerializer
from .utils import run_backups


logger = logging.getLogger(__name__)

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
  try:
    schedule = Schedule.objects.get(pk=id)

    logger.info('Running an immediate backup for {}'.format(schedule))

    run_backups([schedule])

    return Response(schedule.list_backups())

  except Schedule.DoesNotExist:
    logger.info('Cannot run an immediate backup as schedule with id {} not found'.format(id))
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@login_required
@api_view(['DELETE'])
@authentication_classes((CsrfExemptSessionAuthentication, BasicAuthentication))
def delete_backup(request, id, file):
  remove(path.join(settings.FILES_ROOT, str(id), file))

  return Response(status=status.HTTP_204_NO_CONTENT)


@login_required
@require_GET
def download(request, id, file):
  file_path = path.join(settings.FILES_ROOT, str(id), file)
  if not path.exists(file_path):
    logger.info('Cannot download {} for id {}'.format(file, id))
    raise Http404
  else:
    with open(file_path, 'rb') as fh:
      response = HttpResponse(fh.read(), content_type='text/plain')
      response['Content-Disposition'] = 'attachment; filename={}'.format(path.basename(file_path))
      return response
