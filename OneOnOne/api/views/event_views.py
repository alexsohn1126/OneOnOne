from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..serializer.event_serializers import EventSerializer
from meetings.models.event import Event
from meetings.models.timeslot import Timeslot
from users.models.contact import Contact

class EventList(generics.ListAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer
  permission_classes = [IsAuthenticated]

  def list(self, request, timeslot_id, *args, **kwargs):
    timeslot = Timeslot.objects.get(pk=timeslot_id)
    self.queryset = Event.objects.filter(timeslot=timeslot)
    return super().list(request, *args, **kwargs)

  def get(self, request, timeslot_id, *args, **kwargs):
    timeslot = Timeslot.objects.filter(pk=timeslot_id)
    # Make sure timeslot exists
    if not timeslot.exists():
      return Response('NOT FOUND', status=status.HTTP_404_NOT_FOUND)
    # User must be the owner of the calendar to view events
    if request.user != timeslot.first().calendar.owner:
      return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)
    return super().get(request, timeslot_id=timeslot_id, *args, **kwargs)


class EventCreate(generics.CreateAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer
  permission_classes = [AllowAny]

  def post(self, request, *args, **kwargs):
    timeslot = Timeslot.objects.filter(pk=request.data.get('timeslot'))
    contact = Contact.objects.filter(pk=request.data.get('contact'))
    # Make sure timeslot and contact exists
    if not timeslot.exists() or not contact.exists():
      return Response('NOT FOUND', status=status.HTTP_404_NOT_FOUND)
    # Make sure contact is in the calenader as an invitee
    if not (set(contact.first().invitee_contact.all()).intersection(timeslot.first().calendar.invitee.all())):
      return Response('NOT FOUND', status=status.HTTP_404_NOT_FOUND)
    # Check whether there already is an event with timeslot and contact
    if Event.objects.filter(timeslot = timeslot.first(), contact = contact.first()).exists():
      return Response('Event Already Exists', status=status.HTTP_208_ALREADY_REPORTED)
    return super().post(request, *args, **kwargs)
  
class EventReadUpdate(generics.RetrieveUpdateAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer
  permission_classes = [IsAuthenticated]
  lookup_url_kwarg = 'event_id'

  def get(self, request, *args, **kwargs):
    error_res = self._check_req(request, *args, **kwargs)
    if error_res:
      return error_res
    return super().get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    error_res = self._check_req(request, *args, **kwargs)
    if error_res:
      return error_res
    return super().put(request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    error_res = self._check_req(request, *args, **kwargs)
    if error_res:
      return error_res
    return super().patch(request, *args, **kwargs)

  def _check_req(self, request, *args, **kwargs):
    event = Event.objects.filter(pk=kwargs['event_id'])
    if not event.exists():
      return Response('NOT FOUND', status=status.HTTP_404_NOT_FOUND)
    timeslot = event.first().timeslot
    contact = event.first().contact
    # User must be the owner of the calendar AND the contact to access event
    if (request.user != timeslot.calendar.owner or 
        request.user != contact.user):
      return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)
    
