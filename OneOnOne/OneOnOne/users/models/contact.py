from django.db import models
from .user import User

# Create your models here.
class Contact:
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=120, unique = True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contact')
    
    def __str__(self):
        return (f"Contact's name is {self.first_name} {self.last_name} and their email is {self.email}")