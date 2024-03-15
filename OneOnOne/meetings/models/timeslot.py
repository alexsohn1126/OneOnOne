from django.db import models
from .calendar import Calendar

class Timeslot(models.Model):
    name = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # foreign key on the many side
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='timeslots')

    def __str__(self):
        return(f"{self.name} in {self.calendar} starting on {self.start_time} and ending on {self.start_time}")