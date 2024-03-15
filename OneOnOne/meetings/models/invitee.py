from .calendar import Calendar
from django.db import models
from users.models.contact import Contact

class Invitee(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='invitee_contact')
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='invitee')
    
    def __str__(self):
        return (f"INVITEE {self.id}: Contact={self.contact.id} Calendar={self.calendar}")
    