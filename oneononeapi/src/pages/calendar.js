import React, { useState, useEffect } from 'react';
import './Overlay.css';
import './calendar_styling.css';
import Overlay from '../index';
import ReactCalendar from 'react-calendar';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from "react-datepicker";
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-clock/dist/Clock.css';

function Calendar() {
    const [calendarsList, setCalendars] = useState([]);

    const apiUrl = 'http://localhost:8000/api/calendars/';
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Use Bearer scheme for JWT
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length === 0) {
                console.log("There are no calendars to show");
            } else {
                setCalendars(data);
            }
        })
        .catch((error) => {
            alert('Login failed');
            console.error('Error during login:', error);
        });
    }, [apiUrl, accessToken])

    return (
        <div>
            {calendarsList ? (
                <ListCalendars data={calendarsList} setCalendars={setCalendars} /> // Render child with fetched data
            ) : (
                <p>Loading...</p> 
            )}
            
        </div>
    )
}

function ListCalendars({ data, setCalendars }) {
    ////////////////////////// SW 
    const [showCalendar, setShowCalendar] = useState(true);
    const [showInvitees,setShowInvitees] = useState(false);

    const [currCalendarID, setCalendarID] = useState(null);

    // contactsList, InvitedList, ConfirmedList should all add up to the intial length of contactsList
    // contactsList will only decrease in size so be sure to call setTableColumns right after setContactsList
    const [contactsList, setContactsList] = useState([]);
    const [inviteesList, setInviteesList] = useState([]);

    // these table column headings will tell you which column to add the elements in
    const [tableColumns, setTableColumns] = useState({
        'Invite Contacts': contactsList,
        'Invited Contacts': [],
        'Confirmed Contacts': [], 
    })


    var max_length = 0;


    const showManageContacts = (calendar) => {
        // at this point the button to manage contacts has been pressed. The only thing we can do to filter and get the contacts associated 
        // with this calendar is to go through the list of invitees and get the ones that has invitations to calendar one
        // for a new calendar: no invitees so all the contacts go in the "Invite Contacts column"
        setShowCalendar(false);
        setShowInvitees(true);
        setCalendarID(calendar.id);

        fetch_all_invitees()
        .then((data) => setInviteesList(data));

        const invitees_id = inviteesList.map(invitee => invitee.contact_id);
        // console.log(invitees_id);


        const apiUrl = 'http://localhost:8000/api/contacts/';
        const accessToken = localStorage.getItem('accessToken');
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Use Bearer scheme for JWT
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setContactsList(data);

            // THIS PART COULD GET TRICKY SINCE WE WOULD NEED TO UPDATE INVITED CONTACTS AND CONFIRMED CONTACTS FROM HERE TOO
            // const placeholder_contact = contactsList[0].id;
            // console.log(placeholder_contact);

            const uninvited_contacts = data.filter(contact => !invitees_id.includes(contact.id));
            const invited_contacts = data.filter(contact => invitees_id.includes(contact.id));
            console.log(uninvited_contacts);

            // at this point, the contactsList is updated but i need to fetch the invitees as well

            setTableColumns(prevColumns => ({
                ...prevColumns, 
                'Invite Contacts': uninvited_contacts, 
                'Invited Contacts': invited_contacts,
            }));
            
            // setMaxLength(Math.max(tableColumns['Invite Contacts'].length, tableColumns['Invited Contacts'].length, tableColumns['Confirmed Contacts'].length));
            // // var max_length = 
            // console.log(max_length);

        })
        .catch((error) => {
            alert('Login failed');
            console.error('Error during login:', error);
        });
        

        // after this point, the ContactsList has been set up to include all the contacts. But i need to also update the tableColumns
    }
    var rows;


    if (contactsList.length > 0) {
        max_length = Math.max(tableColumns['Invite Contacts'].length, tableColumns['Invited Contacts'].length, tableColumns['Confirmed Contacts'].length);
        // rows only contains the length. Nothing special. we need it because rows generates an empty array for map() later
        rows = Array.from({ length: max_length });
        console.log(rows);
        // console.log(max_length);
    }

    const contactInvited = (contact) => {
        console.log(currCalendarName);
        console.log(contact, currCalendarID);

        const emailRecipient = contact.email; // Leave empty or specify a recipient email address
        const emailSubject = encodeURIComponent('Please select a timeslot by clicking at the link below');
        const calendar_link = 'http://localhost:3000/calendars/' + currCalendarID + '/contacts/' + contact.id;
        const emailBody = encodeURIComponent(calendar_link);

        // Construct the mailto link
        const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;

        // Open the default mail client
        window.location.href = mailtoLink;

        // on top of sending the email, we also need to make this contact an invitee and update the column of the invitees to contain that information
        invitee_create_request(currCalendarID, contact.id)
        .then(data => console.log(data));
    }


    //////////////////////////


    // setting up data for the create calendar form:
    const [formData, setFormData] = useState({
        name: '',
        start_date: new Date(),
        end_date: new Date(),
    })
    // Setting up data for the timeslot creation form
    const [timeslotFormData, setTimeslotFormData] = useState({
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        "high_priority": false
    })
    const [error, setError] = useState('');  // State to store the error message
    const [isOpen, setIsOpen] = useState(false);
    const [timeslotIsOpen, setTimeslotIsOpen] = useState(false);
    const [currentCalendarId, setCurrentCalendarId] = useState(null);
    const [currentCalendarStart, setCurrentCalendarStart] = useState(null);
    const [currentCalendarEnd, setCurrentCalendarEnd] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currCalendarName, setCurrCalendarName] = useState('Please select a calendar');
    const [startDateRange, setStartDateRange] = useState(new Date());  // Start of range
    const [endDateRange, setEndDateRange] = useState(new Date());    // End of range
    const [timeslotsList, setTimeslotsList] = useState();
    const [events, setEvents] = useState(null);
    const [timeslotEvents, setTimeslotEvents] = useState({});
    

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const toggleTimeslotOverlay = (calendar) => {
        setTimeslotIsOpen(!timeslotIsOpen);
        setCurrentCalendarId(calendar.id)
        setCurrentCalendarStart(calendar.start_date)
        setCurrentCalendarEnd(calendar.end_date)
    };

    // Handle changes for form data
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        setError('');  // Clear error message when the user starts editing again
    };

    // Handle changes for form data
    const handleTimeslotFormChange = (e) => {
        const { name, checked } = e.target;
        setTimeslotFormData(prevFormData => ({
            ...prevFormData,
            [name]: checked
        }));
        setError('');  // Clear error message when the user starts editing again
    };

    // Handle changes for form data regarding date/time objects
    const handleDateTimeChange = (value, fieldName) => {
        // Format the Date object into a string if necessary, e.g., 'YYYY-MM-DD HH:mm'
        const formattedDate = value ? value.toISOString() : '';
        // setTimeslotIsOpen(false)
        setTimeslotFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: formattedDate
        }));
    };

    // Handle changes for form data regarding date objects
    const handleDateChange = (date, fieldName) => {
        const formattedDate = date ? moment(date).add(date.getTimezoneOffset(), 'minutes').format('YYYY-MM-DD') : '';
        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: formattedDate
        }));
    };

    // Handle form submission for creating a new calendar
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCalendar = await send_create_request(formData); // This should return the newly created calendar
            setCalendars(prevCalendars => [...prevCalendars, newCalendar]); // Add the new calendar to the current list
            setIsOpen(false); // Close the overlay on successful POST
            setError(''); // Clear any previous errors
            console.log('Calendar created successfully');
        } catch (error) {
            setError(error.message); // Set the error message to display in the UI
            console.error(error);
        }
    };

    // Handle form submission for creating a new timeslot
    const handleTimeslotSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(timeslotFormData, currentCalendarId);
            const newTimeslot = await send_timeslot_create_request(timeslotFormData, currentCalendarId);
            setIsOpen(false); // Close the overlay on successful POST
            setError(''); // Clear any previous errors
            console.log('Timeslot created successfully');

            // Update the timeslots list to include the new timeslot
            setTimeslotsList(prevTimeslots => [...prevTimeslots, newTimeslot]);
            fetchEventsForTimeslot(newTimeslot.id); // Optionally fetch events for the new timeslot

        } catch (error) {
            setError(error.message); // Set the error message to display in the UI
            console.error('Error while creating timeslot:', error);
        }
    };

    // Handle calendar deletion
    const handleCalendarDelete = async (calendarId) => {
        const apiUrl = `http://localhost:8000/api/calendars/${calendarId}/`;
        const accessToken = localStorage.getItem('accessToken');
    
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Deletion failed');
            console.log('Calendar deleted successfully');
            setCalendars(data.filter(calendar => calendar.id !== calendarId));
        } catch (error) {
            console.error('Error deleting calendar:', error);
            alert('Failed to delete calendar.');
        }
    };

    // Handle timeslot deletion
    const handleTimeslotDelete = async (timeslotId) => {
        const apiUrl = `http://localhost:8000/api/calendars/${currentCalendarId}/timeslots/${timeslotId}`;
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Deletion failed');
            console.log('Timeslot deleted successfully');
            // Update the timeslots list by removing the deleted timeslot
            setTimeslotsList(prevTimeslots => prevTimeslots.filter(timeslot => timeslot.id !== timeslotId));
        } catch (error) {
            console.error('Error deleting timeslot:', error);
            alert('Failed to delete timeslot.');
        }
    };
    
    // Handle changing the react calendar when interacting directly with it
    const handleCalendarChange = (calendar) => {
        setSelectedDate(new Date(calendar.start_date));  // Or `end_date` depending on the requirement
    };

    // Handle choosing a different calendar from the list
    const handleCalendarSelect = async (calendar) => {
        const startDate = new Date(calendar.start_date);
        const endDate = new Date(calendar.end_date);

        /////////SW
        setShowCalendar(true);
        setShowInvitees(false);

        setCalendarID(calendar.id);
        //////////
    
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
    
        setStartDateRange(startDate);
        setEndDateRange(endDate);
        setSelectedDate(startDate);
        setCurrCalendarName(calendar.name);
        setCurrentCalendarId(calendar.id)

        // Fetch and update timeslots for the selected calendar
        try {
            const timeslotsData = await get_timeslots(calendar.id);
            if (timeslotsData && timeslotsData.length > 0) {
                setTimeslotsList(timeslotsData);
                // Automatically fetch events for each timeslot
                timeslotsData.forEach(timeslot => {
                    fetchEventsForTimeslot(timeslot.id);
                });
            } else {
                setTimeslotsList([]);
            }
        } catch (error) {
            console.error('Failed to load timeslots and events:', error);
            setTimeslotsList([]);
        }
    };

    // Function to check if a date is within a range
    const isInRange = (date) => {
        return date >= startDateRange && date <= endDateRange;
    };

    async function get_timeslots(currentCalendarId) {
        const apiUrl = `http://localhost:8000/api/calendars/${currentCalendarId}/timeslots`;
        const accessToken = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Use Bearer scheme for JWT
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch timeslots');
            }
    
            const data = await response.json();
            console.log("Timeslots data fetched:", data);
            return data;
        } catch (error) {
            console.error('Error fetching timeslots:', error);
            alert('Failed to load timeslots');
        }
    }
    
    const fetchEventsForTimeslot = async (timeslotId) => {
        const apiUrl = `http://localhost:8000/api/timeslots/${timeslotId}/events`;
        const accessToken = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
    
            let events = await response.json();
            // Fetch contact details for each event
            const eventsWithContacts = await Promise.all(events.map(async event => {
                if (event.contact) {
                    const contact = await fetchContactDetails(event.contact);
                    return { ...event, contact: contact };
                }
                return event;
            }));
    
            console.log(`Events for timeslot ${timeslotId}:`, eventsWithContacts);
            updateTimeslotEvents(timeslotId, eventsWithContacts);
    
            return eventsWithContacts;
        } catch (error) {
            console.error(`Error fetching events for timeslot ${timeslotId}:`, error);
            alert('Failed to load events');
        }
    };
    
    const updateTimeslotEvents = (timeslotId, events) => {
        setTimeslotsList(prevTimeslots => prevTimeslots.map(timeslot =>
            timeslot.id === timeslotId ? {...timeslot, events: events} : timeslot
        ));
    };

    // Function to confirm the event, this will unconfirm other events
    const confirmEvent = async (event) => {
        const apiUrl = `http://localhost:8000/api/events/${event.id}/`;
        const accessToken = localStorage.getItem('accessToken');
        const eventData = {
            timeslot: event.timeslot,
            contact: event.contact.id,
            confirmed: true
        };
    
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(eventData)
            });
    
            if (!response.ok) {
                throw new Error("Failed to confirm event");
            }
    
            const updatedEvent = await response.json();
            console.log('Event confirmed:', updatedEvent);
            // Refresh all events for this timeslot to reflect new statuses
            fetchEventsForTimeslot(event.timeslot);
        } catch (error) {
            console.error('Error confirming event:', error);
            alert('Failed to confirm event.');
        }
    };

    const fetchContactDetails = async (contactId) => {
        const apiUrl = `http://localhost:8000/api/contacts/${contactId}`;
        const accessToken = localStorage.getItem('accessToken');
    
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch contact');
            }
    
            const contact = await response.json();
            return contact;
        } catch (error) {
            console.error(`Error fetching contact ${contactId}:`, error);
            return null; // Return null or default contact structure
        }
    };

    const renderTimeslots = () => {
        if (!timeslotsList || timeslotsList.length === 0) {
            return <div>Select a calendar with existing timeslots to view timeslot status.</div>;
        }
    
        return (
            <ul>
                {timeslotsList.map(timeslot => (
                    <li key={timeslot.id}>
                        <div className="py-2 shadow-md border p-4 m-2 rounded-lg bg-white space-y-2">
                            <p>Start: {new Date(timeslot.start_time).toLocaleString()}</p>
                            <p>End: {new Date(timeslot.end_time).toLocaleString()}</p>
                            <p>Priority: {timeslot.high_priority ? "High" : "Normal"}</p>
                            <div>
                                <h4>Events:</h4>
                                {timeslot.events && timeslot.events.map(event => (
                                    <div key={event.id} className={`flex flex-row items-center justify-between space-x-2 shadow-md border p-1 text-sm rounded-[10px] ${event.confirmed ? 'bg-green-400' : 'bg-yellow-400'} border-gray-300`}>
                                        <p className="font-bold">{event.confirmed ? `Confirmed: ${event.contact.email}` : `Unconfirmed: ${event.contact.email}`}</p>
                                        {!event.confirmed && (
                                            <button onClick={() => confirmEvent(event)} className="bg-green-3 hover:bg-green-2 text-white font-bold py-1 px-2 rounded">
                                                Confirm
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="py-2">
                                <button className="bg-red-600 hover:bg-red-400 text-white py-2 px-4 rounded-full inline-flex items-center" onClick={() => handleTimeslotDelete(timeslot.id)}>
                                    Delete Timeslot
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

        );
    };
    
    // Logic and formatting for listing the calendars
    const calendars = data.map((calendar) => (
        <li key={calendar.id}>
            <div className="relative flex items-stretch py-2">
                {/* -- Calendar Name -- */}
                <button className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0 rounded-l inline-flex items-center h-full" onClick={() => handleCalendarSelect(calendar)} >
                {calendar.name}
                </button>

                {/* -- Add Timeslot Button */}
                <div className="group">
                    <button type="button" className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0  inline-flex items-center h-full" onClick={() => toggleTimeslotOverlay(calendar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
                    </svg>
                    </button>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                        Add Timeslot
                        </span>
                    </div>
                </div>

                {/* -- Contact Button -- */}
                <div className="group">
                    {/* <a href="/" type="button" className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0  inline-flex items-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        </svg>
                    </a>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                        Manage Contacts
                        </span>
                    </div> */}

                    {/* SW */}
                    <button className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0  inline-flex items-center h-full" onClick={() => showManageContacts(calendar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        </svg>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                        Manage Contacts
                        </span>
                    </div>
                    </button>
                </div>
                
                {/* -- Delete Button -- */}
                <div className="group">
                    <button className="bg-green-3 hover:bg-green-2 text-white py-2 mx-0 px-4  inline-flex items-center h-full rounded-r" onClick={() => handleCalendarDelete(calendar.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                        </svg>       
                    </button>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                        Delete Calendar
                        </span>
                    </div>
                </div>
            </div>
        </li>
    ))

    // RENDERING
    return (
        <div className="container mx-auto p-2 pb-12">
            {/* -- Two Columns -- */}
            <div className="flex flex-wrap -mx-8">
                {/* -- First Column -- */}
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow ">
                        <h2 className="font-semibold text-lg mb-2 text-center">Your Calendars</h2>
                        
                        {/* -- Calendars List -- */}
                        <ul>{calendars}</ul>
                        
                        <div className="py-2">
                            <button className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 rounded-full inline-flex items-center" onClick={toggleOverlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 me-2">
                                    <path fillRule="evenodd"
                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
                                    clipRule="evenodd" />
                                </svg>
                                Create Calendar
                            </button>
                        </div>

                    </div>
                </div>

                {/* -- Second Column -- */}
                    {showCalendar && (!showInvitees) && (<div className="w-full md:w-1/2 px-2 mb-4">
                        <div className="bg-gray-100 p-4 rounded-lg shadow">
                            <h2 className="font-semibold text-lg mb-2 text-center"> {currCalendarName} </h2>
                            {/* -- Calendar -- */}
                            <div className="flex justify-center items-center w-full">
                                <ReactCalendar
                                    tileClassName={({ date, view }) => {
                                        if (view === 'month' && isInRange(date)) {
                                            return 'calendar-day-in-range';
                                        }
                                    }}
                                    onChange={handleCalendarChange}
                                    value={selectedDate}
                                />
                            </div>
                            {/* -- Timeslots List Here -- */}
                            {renderTimeslots()}
                        </div>
                    </div>)}


                    {/* SW */}
                    {(!showCalendar) && (showInvitees) && (
                    <div class="w-full md:w-1/2 px-2 mb-4">
                    <div class="bg-gray-100 p-4 rounded-lg shadow">
                      {/* <!-- <h2 class="font-semibold text-lg mb-2">My Calendar 1</h2> --> */}
                      {/* <!-- Table Navigator --> */}
                      <div class="flex justify-center text-center">
                        <h2 class="font-semibold text-lg inline mb-2">Invitations for "My Calendar 1"</h2>
                      </div>
                        {/* <!-- Schedules by day --> */}
                        <div class="overflow-x-scroll [&::-webkit-scrollbar]:hidden">
                          <table class="border-collapse w-full">
                            <tr class="h-12">
                              <th class="border-b px-4 border-b-black border-r border-r-gray-300">Invite Contacts</th>
                              <th class="border-b px-4 border-b-black border-r border-r-gray-300">Invited Contacts</th>
                              <th class="border-b px-4 border-b-black border-r border-r-gray-300">Confirmed Contacts</th>
                            </tr>

                            {/* <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr class="h-12">
                                        <th class="border-b px-4 border-b-black border-r border-r-gray-300">Invite Contacts</th>
                                        <th class="border-b px-4 border-b-black border-r border-r-gray-300">Invited Contacts</th>
                                        <th class="border-b px-4 border-b-black border-r border-r-gray-300">Confirmed Contacts</th>
                                        <th class="border-b px-4 border-b-black border-r border-r-gray-300">Incorrect Email Addresses</th>
                                    </tr>
                                </thead> */}

                            {/* EVERY CONTACT HAS A DIFFERENT LOOKING CARD */}

                            {rows && rows.map((_, i) => (
                                // tr is every row
                                <tr class="h-12" id={"row" + i}>
                                    {/* first column entry in this row */}
                                    {tableColumns['Invite Contacts'][i] && (<td class="border-b border-b-gray-300 border-r border-r-gray-300">
                                        <div class = "flex mt-4 flex-row items-center justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300 bg-white">
                                        {/* <!--Details--> */}
                                        <div class = "w-max">
                                            <h3 class = "font-bold">{tableColumns['Invite Contacts'][i].first_name} {tableColumns['Invite Contacts'][i].last_name}</h3>
                                            <h3>
                                                <a class="break-all hover:bg-green-500" href="mailto:LeBron@gmail.com">{tableColumns['Invite Contacts'][i].email}</a>
                                            </h3>
                                        </div>
                                        {/* <!--Buttons--> */}
                                        <div class = "flex flex-row space-x-2 items-center">
                                            {/* <!--Edit contact button--> */}
                                            <button onClick={() => contactInvited(tableColumns['Invite Contacts'][i], currCalendarName.charAt(currCalendarName.length - 1))}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                                </svg>
                                            </button>       
                                        </div>   
                                        </div>
                                </td>)}

                                {/* second column entry in this row (for invited contacts or invitees) */}
                                {tableColumns['Invited Contacts'][i] && (
                                    <td class="border-b border-b-gray-300 border-r border-r-gray-300">
                                    <div class = "flex mt-4 flex-row items-center justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300 bg-white">
                                      {/* <!--Details--> */}
                                      <div class = "w-max">
                                          <h3 class = "font-bold">{tableColumns['Invited Contacts'][i].first_name} {tableColumns['Invited Contacts'][i].last_name}</h3>
                                          <h3>
                                            <a class="break-all hover:bg-green-500" href="mailto:jane@gmail.com">{tableColumns['Invited Contacts'][i].email}</a>
                                          </h3>
                                      </div>
                                      {/* <!--Buttons--> */}
                                      <div class = "flex flex-row space-x-2 items-center">
                                          {/* <!--Accept--> */}
                                          <a class="" href="mailto:john@gmail.com">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                                              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
                                            </svg>                            
                                          </a>        
                                      </div>   
                                    </div>
                                  </td>
                                )}

                                {/* third column entry in this row (for confirmed invitees) */}
                                {tableColumns['Confirmed Contacts'][i] && (
                                    <td class="border-b border-b-gray-300 border-r border-r-gray-300">
                                    <div class = "flex flex-row items-center mt-4 justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300 bg-green-300">
                                      {/* <!--Details--> */}
                                      <div class = "w-max">
                                          <h3 class = "font-bold">{tableColumns['Confirmed Contacts'][i]['contact_id'].first_name} {tableColumns['Confirmed Contacts'][i]['contact_id'].last_name}</h3>
                                          <h3>
                                            <a class="break-all hover:bg-green-500" href="mailto:john@gmail.com">{tableColumns['Confirmed Contacts'][i]['contact_id'].email}</a>
                                          </h3>
                                      </div>
                                      {/* <!--Buttons--> */}
                                      <div class = "flex flex-row space-x-2 items-center">
                                          {/* <!--Accept--> */}
                                          <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#333D29" class="w-6 h-6 hover:fill-green-1">
                                              <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clip-rule="evenodd" />
                                          </svg>                         
                                        </button>
                                          
                                          {/* <!-- cancel reservation button --> */}
                                          <button class ="">           
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A4AC86" class="w-6 h-6 hover:fill-green-1">
                                                <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                                            </svg>            
                                        </button>
                                      </div>   
                                    </div>  
                                </td>
                                )}

                                </tr>
                            ))}
                          </table>
                        </div>
            
            
                    </div>
                  </div>
                )}

                    {/* END SW */}
            </div>
            <Overlay isOpen={isOpen} onClose={toggleOverlay} className="bg-white rounded-lg shadow-xl p-5 max-w-lg mx-auto my-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex flex-col">
                        <label htmlFor="name" className="font-semibold">Calendar Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleFormChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="start_date" className="font-semibold">Start Date:</label>
                        <DatePicker
                            selected={formData.start_date}
                            onChange={(date) => handleDateChange(date, 'start_date')}
                            dateFormat="yyyy-MM-dd"
                            required={true}
                            id="start_date"
                            name="start_date"
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="end_date" className="font-semibold">End Date:</label>
                        <DatePicker
                            selected={formData.end_date}
                            onChange={(date) => handleDateChange(date, 'end_date')}
                            dateFormat="yyyy-MM-dd"
                            required={true}
                            id="end_date"
                            name="end_date"
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <button type="submit" className="bg-green-3 hover:bg-green-2 text-white font-bold py-2 px-4 rounded">
                        Create Calendar
                    </button>
                </form>
            </Overlay>

            <Overlay isOpen={timeslotIsOpen} onClose={toggleTimeslotOverlay} className="bg-white rounded-lg shadow-xl p-5 max-w-lg mx-auto my-12">
                <form onSubmit={handleTimeslotSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex flex-col">
                        <label htmlFor="start_time" className="font-semibold">Start Time:</label>
                        <DateTimePicker
                            onChange={(value) => handleDateTimeChange(value, 'start_time')}
                            disableClock={true}
                            dayPlaceholder='dd'
                            monthPlaceholder='mm'
                            yearPlaceholder='yyyy'
                            hourPlaceholder='hh'
                            minutePlaceholder='mm'
                            required={true}
                            id="start_time"
                            name="start_time"
                            value={new Date(timeslotFormData.start_time)}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="end_time" className="font-semibold">End Time:</label>
                        <DateTimePicker
                            onChange={(value) => handleDateTimeChange(value, 'end_time')}
                            disableClock={true}
                            dayPlaceholder='dd'
                            monthPlaceholder='mm'
                            yearPlaceholder='yyyy'
                            hourPlaceholder='hh'
                            minutePlaceholder='mm'
                            required={true}
                            id="end_time"
                            name="end_time"
                            value={new Date(timeslotFormData.end_time)}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className="flex items-center mt-4">
                        <label htmlFor="high_priority" className="font-semibold mr-2">High Priority:</label>
                        <input
                            type="checkbox"
                            id="high_priority"
                            name="high_priority"
                            checked={timeslotFormData.high_priority}
                            onChange={handleTimeslotFormChange}
                            className="w-4 h-4 text-green-3 focus:ring-green-2 border-gray-300 rounded"
                        />
                    </div>
                    
                    <button type="submit" className="bg-green-3 hover:bg-green-2 text-white font-bold py-2 px-4 rounded">
                        Create Timeslot
                    </button>
                </form>
            </Overlay>

        </div>
    );
}

function send_create_request(formData) {
    const apiUrl = "http://localhost:8000/api/calendars/";
    const accessToken = localStorage.getItem('accessToken');

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
    })
    .then(async (response) => {
        const data = await response.json();  // Always parse the response body
        if (!response.ok) {
            // Extract error message from the server's response
            const errorMessages = Object.keys(data).map(key => {
                return `${key}: ${data[key].join(" ")}`;  // Assuming each key can have multiple messages
            }).join("\n");
            throw new Error(`Failed to create calendar: ${errorMessages}`);
        }
        return data;  // Return the successful data to handle in the caller
    })
}

function send_timeslot_create_request(timeslotFormData, currentCalendarId) {
    const apiUrl = `http://localhost:8000/api/calendars/${currentCalendarId}/`;
    const accessToken = localStorage.getItem('accessToken');

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(timeslotFormData),
    })
    .then(async (response) => {
        const data = await response.json();  // Always parse the response body
        if (!response.ok) {
            // Extract error message from the server's response
            const errorMessages = Object.keys(data).map(key => {
                return `${key}: ${data[key].join(" ")}`;  // Assuming each key can have multiple messages
            }).join("\n");
            throw new Error(`Failed to create timeslot: ${errorMessages}`);
        }
        return data;  // Return the successful data to handle in the caller
    })
}

function invitee_create_request(calendar_id, contact_id) {
    // console.log(calendar_id, contact_id);
    const apiUrl = "http://localhost:8000/api/calendars/" + calendar_id + "/contacts/" + contact_id + '/';
    console.log(apiUrl);
    const accessToken = localStorage.getItem('accessToken');

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json()) // Convert response to JSON
    .then(data => data); // Return the data
}


function fetch_all_invitees() {
    // console.log(calendar_id, contact_id);
    const apiUrl = "http://localhost:8000/api/calendars/contacts/";
    console.log(apiUrl);
    const accessToken = localStorage.getItem('accessToken');

    return fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json()) // Convert response to JSON
    .then(data => data); // Return the data
}

export default Calendar;