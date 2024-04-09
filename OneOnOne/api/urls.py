from django.urls import path
from .views.event_views import EventList, EventCreate, EventReadUpdate
from .views.contact_views import ContactListCreate, ContactDetail
from .views.calendar_views import CalendarList, CalendarDetail, CreateInvitee, TimeslotListView, TimeslotUpdateDestroy, TimeslotsInCalendar, SuggestedSchedules
from .views.accounts_views import SignUpView, SignInView, ProfileUpdate, DeleteProfile


app_name = "api"

urlpatterns = [
    path('accounts/signup/', SignUpView.as_view(), name="signup"),
    path('accounts/signin/', SignInView.as_view(), name="signin"),
    path('accounts/profile/', ProfileUpdate.as_view(), name="profileedit"),
    path('accounts/delete/', DeleteProfile.as_view(), name="profiledelete"),
    path('contacts/<int:pk>/', ContactDetail.as_view(), name="detailcreate"),
    path('contacts/', ContactListCreate.as_view(), name='listcreate'),
    path('timeslots/<int:timeslot_id>/events/', EventList.as_view(), name='list_events'),
    path('events/', EventCreate.as_view(), name='create_events'),
    path('events/<int:event_id>/', EventReadUpdate.as_view(), name='read_update_event'),
    path('calendars/<int:calendar_id>/', CalendarDetail.as_view(), name="calendardetail"),
    path('calendars/<int:calendar_id>/suggested/', SuggestedSchedules.as_view(), name="suggested"),
    path('calendars/', CalendarList.as_view(), name='calendars_list'),
    path('calendars/<int:calendar_id>/timeslots/', TimeslotsInCalendar.as_view(), name='timeslots_calendar'),
    path('calendars/<int:calendar_id>/timeslots/<int:id>/', TimeslotUpdateDestroy.as_view(), name='timeslot_update_destroy'),
    path('calendars/<int:calendar_id>/contacts/<int:contact_id>/', CreateInvitee.as_view(), name='create_invitee'),
    path('calendars/<int:calendar_id>/timeslots', TimeslotListView.as_view(), name='timeslot_list'),
]