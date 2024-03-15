from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=120, unique = True)
    username = models.CharField(max_length=150, unique=False, blank=True) # Make it so that username is not required 
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    def __str__(self):
        return (f"USER {self.id}: {self.first_name} {self.last_name}, {self.email}")