from django.db import models
from .calendar import Calendar

class Timeslot(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # foreign key on the many side
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='timeslots')
    high_priority = models.BooleanField(default=False)

    def __str__(self):
        return(f"TIMESLOT {self.id} in {self.calendar}")