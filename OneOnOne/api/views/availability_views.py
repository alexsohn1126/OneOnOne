from rest_framework import generics
from rest_framework.response import Response
from ..serializer.availability_serializer import AvailabilitySerializer
from meetings.models.event import Event
from users.models.contact import Contact
from rest_framework.permissions import IsAuthenticated


class AvailabilityUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvailabilitySerializer
    lookup_url_kwarg = 'event_id'
        
