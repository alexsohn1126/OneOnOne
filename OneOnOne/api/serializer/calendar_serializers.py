from rest_framework import serializers
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('name', 'start_date', 'end_date', 'owner')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError({
                'start_date': 'The start date cannot be later than the end date.',
                'end_date': 'The end date cannot be earlier than the start date.'
            })
        return data
