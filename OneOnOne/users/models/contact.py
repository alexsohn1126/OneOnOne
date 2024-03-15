from django.db import models
from .user import User

# Create your models here.

# We could add a custom model manager

# the function below specifies the directory where the image file should be placed
def upload_to(instance, filename):
    return '/'.join(['images', str(instance.first_name), filename])

class Contact(models.Model):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=120, unique = True)
    # foreign key on the many side of the relationship. One user has access to many contacts and they can 
    # edit those contacts 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contact')
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    
    def __str__(self):
        return (f"CONTACT {self.id}:{self.first_name} {self.last_name}, {self.email}")