from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from .views import index

urlpatterns = [
  path('', index)
] + staticfiles_urlpatterns()
