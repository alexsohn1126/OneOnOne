from django.db import models
from django.conf import settings

class Calendar(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateField(help_text="Select a start date for your calendar")
    end_date = models.DateField(help_text="Select an end date for your calendar")
    # Users to calendars is a one-to-many relation so foreign is on the many side
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calendars')

    def __str__(self):
        return(f"{self.name} owned by {self.owner}")