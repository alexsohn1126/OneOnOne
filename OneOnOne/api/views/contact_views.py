from rest_framework import generics 
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact
from ..serializer.contact_serializers import ContactSerializer

class ContactListCreate(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(methods=['post'], detail=False)
    def upload_docs(request):
        try:
            file = request.data['file']
        except KeyError:
            raise ParseError('Request has no resource file attached')
        product = Contact.objects.create(image=file)

class ContactDetail(generics.RetrieveDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
