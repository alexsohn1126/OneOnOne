from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=120, unique = True)
    
    def __str__(self):
        return (f"User's name is {self.first_name} {self.last_name} and their email is {self.email}")