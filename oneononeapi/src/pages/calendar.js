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

    // Handle form submission
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

    // Handle form submission
    const handleTimeslotSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(timeslotFormData, currentCalendarId);
            const newTimeslot = await send_timeslot_create_request(timeslotFormData, currentCalendarId); // This should return the newly created calendar
            setIsOpen(false); // Close the overlay on successful POST
            setError(''); // Clear any previous errors
            console.log('Timeslot created successfully');
        } catch (error) {
            setError(error.message); // Set the error message to display in the UI
            console.error(error);
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
                                        <p className="font-bold"> {event.confirmed ? `Confirmed: ${event.contact.email}` : `Unconfirmed: ${event.contact.email}`}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="py-2">
                                <button className="bg-red-600 hover:bg-red-400 text-white py-2 px-4 rounded-full inline-flex items-center" onClick={() => handleTimeslotDelete(timeslot.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                                </svg>  
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
                    <a href="/" type="button" className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0  inline-flex items-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        </svg>
                    </a>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                        Manage Contacts
                        </span>
                    </div>
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
                <div className="w-full md:w-1/2 px-2 mb-4">
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
                </div>
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

export default Calendar;