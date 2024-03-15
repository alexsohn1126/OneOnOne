from rest_framework import generics 
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact
from ..serializer.calendar_serializers import CalendarSerializer

class CalendarList(generics.ListCreateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer

class CalendarDetail(generics.RetrieveDestroyAPIView):
    querset = Calendar.objects.all()
    serializer_class = CalendarSerializer

