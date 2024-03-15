from rest_framework import serializers
from meetings.models import Invitee

class InviteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = ('id', 'calendar_id', 'contact_id')
