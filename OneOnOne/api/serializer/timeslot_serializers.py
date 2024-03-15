from rest_framework import serializers
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact

class TimeslotSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(queryset=Calendar.objects.all(), required=False)

    class Meta:
        model = Timeslot
        fields = ('id', 'start_time', 'end_time', 'calendar', 'high_priority')

    def create(self, validated_data):
        # 'calendar' is provided in the context when initializing the serializer.
        calendar = self.context['calendar']
        return Timeslot.objects.create(calendar=calendar, **validated_data)
