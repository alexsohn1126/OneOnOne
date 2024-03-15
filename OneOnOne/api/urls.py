from django.urls import path
from .views.event_views import EventList, EventCreate, EventReadUpdate
from .views.post_views import PostList, PostDetail
from .views.calendar_views import CalendarList, CalendarDetail, GetCalendarAddTimeslotView, TimeslotUpdateDestroy

app_name = "api"

urlpatterns = [
    path('contacts/<int:pk>', PostDetail.as_view(), name="detailcreate"),
    path('contacts/', PostList.as_view(), name='listcreate'),
    path('timeslots/<int:timeslot_id>/events/', EventList.as_view(), name='list_events'),
    path('events/', EventCreate.as_view(), name='create_events'),
    path('events/<int:event_id>/', EventReadUpdate.as_view(), name='read_update_event'),
    path('calendars/<int:calendar_id>/', GetCalendarAddTimeslotView.as_view(), name="GetCalendarAddTimeslot"),
    path('calendars/', CalendarList.as_view(), name='calendars_list'),
    path('calendars/<int:calendar_id>/timeslots/<int:id>/', TimeslotUpdateDestroy.as_view(), name='timeslot_update_destroy'),
]