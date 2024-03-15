from rest_framework import serializers
from meetings.models.event import Event

class EventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = ('id', 'timeslot', 'contact', 'confirmed')