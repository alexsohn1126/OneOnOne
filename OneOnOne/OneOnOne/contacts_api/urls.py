from django.urls import path 
from .views import PostList, PostDetail

app_name = "contacts_api"

urlpatterns = [
    path('contacts/<int:pk>', PostDetail.as_view(), name="detailcreate"),
    path('contacts/', PostList.as_view(), name='listcreate'),
]