from rest_framework import generics 
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact
from .serializers import ContactSerializer

class PostList(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class PostDetail(generics.RetrieveDestroyAPIView):
    querset = Contact.objects.all()
    serializer_class = ContactSerializer

