from rest_framework import generics 
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from meetings.models import Calendar, Timeslot, Event
from users.models import User, Contact
from ..serializer.contact_serializers import ContactSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import Http404


class ContactListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)
    
    # used to enforce the fact that only the logged in user is associated with a contact
    def perform_create(self, serializer):
        # Automatically associate the new contact with the logged-in user
        serializer.save(user=self.request.user)

    @action(methods=['post'], detail=False)
    def upload_docs(request):
        try:
            file = request.data['file']
        except KeyError:
            raise ParseError('Request has no resource file attached')
        product = Contact.objects.create(image=file)


# class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = Contact.objects.all()
#     serializer_class = ContactSerializer


class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer

    def get_object(self):
        """
        Ensures that users can only access their own contact details.
        """
        # fetches the particular contact only if the user is logged in
        obj = Contact.objects.filter(
            id=self.kwargs.get('pk'), 
            user=self.request.user
        ).first()
        
        if obj is None:
            raise Http404("No Contact matches the given query.")
        
        return obj