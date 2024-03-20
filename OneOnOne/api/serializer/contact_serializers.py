from rest_framework import serializers
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'first_name', 'last_name', 'email', 'user', 'image')
        read_only_fields = ('user',)  # Makes 'user' field read-only
