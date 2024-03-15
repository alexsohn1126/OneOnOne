from rest_framework import serializers
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('id', 'name', 'start_date', 'end_date', 'owner')
