from django.urls import path 
from .views.post_views import PostList, PostDetail
from .views.calendar_views import CalendarList, CalendarDetail, GetCalendarAddTimeslotView, TimeslotUpdateDestroy

app_name = "api"

urlpatterns = [
    path('contacts/<int:pk>', PostDetail.as_view(), name="detailcreate"),
    path('contacts/', PostList.as_view(), name='listcreate'),
    path('calendars/<int:calendar_id>/', GetCalendarAddTimeslotView.as_view(), name="GetCalendarAddTimeslot"),
    path('calendars/', CalendarList.as_view(), name='calendars_list'),
    path('calendars/<int:calendar_id>/timeslots/<int:id>/', TimeslotUpdateDestroy.as_view(), name='timeslot_update_destroy'),
]