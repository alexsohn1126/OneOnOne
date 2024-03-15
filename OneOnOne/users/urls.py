# the code below would generate a simple homepage that we see when we first visit the website. The template 
# for that would be the log in page from p1. Will configure that view in p3

from django.urls import path 
from django.views.generic import TemplateView

app_name = 'users'


urlpatterns = [
    
]

# path('', TemplateView.as_view(template_name="blog/index.html")),