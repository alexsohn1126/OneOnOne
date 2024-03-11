from django.contrib import admin
from .models.user import User
from .models.contact import Contact 

# Register your models here.
admin.site.register(User)
admin.site.register(Contact)
