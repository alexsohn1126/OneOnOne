from django.core.mail import send_mail
from django.utils.formats import date_format
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
  
  def create(self, validated_data):
    instance = super().create(validated_data)
    # remove confirmed status on every other events in the timeslot
    # if created with confirmed == True
    if validated_data.get('confirmed'):
      instance.timeslot.events.exclude(pk=instance.pk).update(confirmed=False)
    return instance
  
  def update(self, instance, validated_data):
    instance.timeslot.events.all().update(confirmed=False)
    instance = super().update(instance, validated_data)
    if instance.confirmed:
      self.send_event_confirmed_email(instance.timeslot, instance.contact)
    return instance
  
  def send_event_confirmed_email(self, timeslot, contact):
    try:
      send_mail(
        f'{contact.first_name}, Your Meeting with {timeslot.calendar.owner.first_name} is Finalized!',
        f'Your meeting from {date_format(timeslot.start_time, "DATETIME_FORMAT")} to {date_format(timeslot.end_time, "DATETIME_FORMAT")} has been finalized.',
        from_email='OneToOne@test.com',
        recipient_list=[contact.email]
      )
      return
    except ConnectionRefusedError as error:
      raise ValidationError(f"Email did not send. Error:{error}")


  class Meta:
    model = Event
    fields = ('id', 'timeslot', 'contact', 'confirmed')