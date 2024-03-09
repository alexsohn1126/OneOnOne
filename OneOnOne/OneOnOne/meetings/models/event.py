from django.db import models
from .calendar import Timeslot

class Event(models.Model):
    date = models.DateField()
    start_time = models.DateTimeField()
    duration = models.IntegerField(default=30)
    timeslot = models.ForeignKey(Timeslot, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return(f"Event in {self.timeslot} starting on {self.start_time}")