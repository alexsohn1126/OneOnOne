from django.db import models
from .timeslot import Timeslot
from users.models.contact import Contact

class Event(models.Model):
    # timeslot to events relation: One time slot can be in many events so foreign key on the many side
    timeslot = models.ForeignKey(Timeslot, on_delete=models.CASCADE, related_name='events')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='contact')
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return(f"EVENT: {self.contact}, {self.start_time}")