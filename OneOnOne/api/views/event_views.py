from rest_framework import generics, status
from rest_framework.response import Response
from ..serializer.event_serializers import EventSerializer
from meetings.models.event import Event
from meetings.models.timeslot import Timeslot

class EventListCreate(generics.ListCreateAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer

  def list(self, request, timeslot_id, *args, **kwargs):
    timeslot = Timeslot.objects.get(pk=timeslot_id)
    self.queryset = Event.objects.filter(timeslot=timeslot)
    return super().list(request, *args, **kwargs)

  def get(self, request, timeslot_id, *args, **kwargs):
    if not request.user.is_authenticated:
      return Response('UNAUTHORIZED', status=status.HTTP_401_UNAUTHORIZED)
    timeslot = Timeslot.objects.filter(pk=timeslot_id)
    if not timeslot.exists():
      return Response('NOT FOUND', status=status.HTTP_404_NOT_FOUND)
    if request.user != timeslot.first().calendar.owner:
      return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)
    return super().get(request, timeslot_id=timeslot_id, *args, **kwargs)
