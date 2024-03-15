from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from meetings.models.timeslot import Timeslot
from users.models.contact import Contact
from meetings.models.event import Event

class EventSerializer(serializers.ModelSerializer):
  timeslot = serializers.PrimaryKeyRelatedField(queryset=Timeslot.objects.all(), many=False)
  contact = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all(), many=False)
  
  def validate_timeslot(self, value):
    if self.instance and self.instance.timeslot != value:
      raise ValidationError("You may not edit timeslot")
    return value
  def validate_contact(self, value):
    if self.instance and self.instance.contact != value:
      raise ValidationError("You may not edit contact")
    return value
  class Meta:
    model = Event
    fields = ('id', 'timeslot', 'contact', 'confirmed')