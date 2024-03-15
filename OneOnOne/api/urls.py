from django.urls import path 
from .views.post_views import PostList, PostDetail
from .views.calendar_views import CalendarList, CalendarDetail

app_name = "api"

urlpatterns = [
    path('contacts/<int:pk>', PostDetail.as_view(), name="detailcreate"),
    path('contacts/', PostList.as_view(), name='listcreate'),
    path('calendars/<int:pk>', CalendarDetail.as_view(), name="detailcreate"),
    path('calendars', CalendarList.as_view(), name='listcreate'),
]