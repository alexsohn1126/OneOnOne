import React, { useState, useEffect } from 'react';
import './Overlay.css';
import './calendar_styling.css';
import Overlay from '../index';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
        "name": '',
        "start_date": '',
        "end_date": '',
    })
    const [error, setError] = useState('');  // State to store the error message
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currCalendarName, setCurrCalendarName] = useState('Please select a calendar');
    const [startDateRange, setStartDateRange] = useState(new Date());  // Start of range
    const [endDateRange, setEndDateRange] = useState(new Date());    // End of range

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
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

    // Handle calendar deletion
    const handleDelete = async (calendarId) => {
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
    
    // Handle changing the react calendar when interacting directly with it
    const handleCalendarChange = (calendar) => {
        setSelectedDate(new Date(calendar.start_date));  // Or `end_date` depending on the requirement
    };

    // Handle changing the react calendar when choosing a different calendar from the list
    const handleCalendarSelect = (calendar) => {
        const startDate = new Date(calendar.start_date);
        const endDate = new Date(calendar.end_date);

        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        setStartDateRange(startDate);
        setEndDateRange(endDate);

        setSelectedDate(startDate);
        setCurrCalendarName(calendar.name);
    };

    // Function to check if a date is within a range
    const isInRange = (date) => {
        return date >= startDateRange && date <= endDateRange;
    };

    // Logic and formatting for listing the calendars
    const calendars = data.map((calendar) => (
        <li key={calendar.id}>
            <div className="relative flex items-stretch py-2">
                {/* -- Calendar Name -- */}
                <button className="bg-green-3 hover:bg-green-2 text-white py-2 px-4 mx-0 rounded-l inline-flex items-center h-full" onClick={() => handleCalendarSelect(calendar)} >
                {calendar.name}
                </button>

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
                    <button className="bg-green-3 hover:bg-green-2 text-white py-2 mx-0 px-4  inline-flex items-center h-full rounded-r" onClick={() => handleDelete(calendar.id)}>
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

                        <div className="App">
                        
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
                </div>
                {/* -- Second Column -- */}
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                        <h2 className="font-semibold text-lg mb-2 text-center"> {currCalendarName} </h2>
                        {/* -- Calendar -- */}
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
                </div>
            </div>
            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Calendar Name</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    />
                </div>
                <div>
                    <label>start_date</label>
                    <input
                    type="text"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleFormChange}
                    />
                </div>
                <div>
                    <label>end_date</label>
                    <input
                    type="text"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleFormChange}
                    />
                </div>
                <button type="submit">Create Calendar</button>
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


export default Calendar;