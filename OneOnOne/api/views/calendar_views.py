from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User, Contact
from meetings.models import Calendar, Timeslot, Event, Invitee
from ..serializer.calendar_serializers import CalendarSerializer
from ..serializer.timeslot_serializers import TimeslotSerializer
from ..serializer.invitee_serializers import InviteeSerializer
from rest_framework.permissions import IsAuthenticated

class CalendarList(generics.ListCreateAPIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]

    serializer_class = CalendarSerializer

    def get_queryset(self):
        return Calendar.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        # Assign the currently authenticated user as the owner of the calendar
        serializer.save(owner=self.request.user)


class CalendarDetail(APIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id, format=None):
        calendar = get_object_or_404(Calendar, id=calendar_id)

        if request.user != calendar.owner:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        serializer = CalendarSerializer(calendar)
        return Response(serializer.data)

    def post(self, request, calendar_id, format=None):
        # Fetch calendar, return 404 if calendar id is not found
        calendar = get_object_or_404(Calendar, id=calendar_id)

        if request.user != calendar.owner:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        # Serialize timeslot with the calendar_id and create the timeslot
        serializer = TimeslotSerializer(data=request.data, context={'calendar': calendar})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, calendar_id, format=None):
        calendar = get_object_or_404(Calendar, id=calendar_id)

        if request.user != calendar.owner:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        calendar.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TimeslotUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]
    serializer_class = TimeslotSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Timeslot.objects.filter(calendar__owner=self.request.user)


class CreateInvitee(APIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]

    def post(self, request, calendar_id, contact_id, format=None):
        # Fetch calendar and contact, return 404 if calendar id is not found
        calendar = get_object_or_404(Calendar, id=calendar_id)
        contact = get_object_or_404(Contact, id=contact_id)

        # Serialize invitee with the calendar_id and return the timeslot
        invitee = Invitee(contact=contact, calendar=calendar)
        serializer = InviteeSerializer(invitee, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SuggestedSchedules(APIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id, format=None):
        lookup_field = 'id'

        queryset = Timeslot.objects.filter(calendar=calendar_id, high_priority=True)
        high_priortity_events = []

        for ts in queryset:
            queryset2 = Event.objects.filter()

class TimeslotListView(generics.ListCreateAPIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]

    serializer_class = TimeslotSerializer

    def get_queryset(self):
        calendar_id = self.kwargs['calendar_id']
        try:
            calendar = Calendar.objects.get(pk=calendar_id)
        except Calendar.DoesNotExist:
            raise Http404("Calendar not found")

        if calendar.owner != self.request.user:
            raise Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        return Timeslot.objects.filter(calendar=calendar)