from django.contrib import admin
from .models.calendar import Calendar
from .models.event import Event
from .models.timeslot import Timeslot
from .models.invitee import Invitee

# Register your models here.
admin.site.register(Calendar)
admin.site.register(Event)
admin.site.register(Timeslot)
admin.site.register(Invitee)