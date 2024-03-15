from rest_framework import serializers
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = '__all__'
