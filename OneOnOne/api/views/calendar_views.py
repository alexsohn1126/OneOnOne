from rest_framework import generics 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User, Contact
from meetings.models import Calendar, Timeslot, Event
from ..serializer.calendar_serializers import CalendarSerializer
from ..serializer.timeslot_serializers import TimeslotSerializer

class CalendarList(generics.ListCreateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer

class CalendarDetail(generics.RetrieveDestroyAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer

class GetCalendarAddTimeslotView(APIView):
    def get(self, request, calendar_id, format=None):
        calendar = Calendar.objects.filter(id=calendar_id).first()
        if calendar is not None:
            serializer = CalendarSerializer(calendar)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, calendar_id, format=None):
        calendar = Calendar.objects.filter(id=calendar_id).first()
        if calendar is not None:
            # serialize using the associated calendar
            serializer = TimeslotSerializer(data=request.data, context={'calendar': calendar})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)