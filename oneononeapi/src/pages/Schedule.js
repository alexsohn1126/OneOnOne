/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom/';



// confirming timeslot

// cancelling confirmed timeslot 


// reschedule

function SuggestedTimeslot({handleConfirm, specificTimeslotInfo, specificContact}) {

    return(
        <div className = "flex flex-row items-center justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300">
            <div className = "w-max">
                <h3 className = "font-bold">{specificContact}</h3>
                <h3>{specificTimeslotInfo}</h3>
            </div>
            
            <div className = "relative flex flex-row space-x-2 items-center">
                <div>
                    <button onClick={handleConfirm}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#333D29" className="w-8 h-8 hover:fill-green-1">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                            Accept
                        </span>
                    </div>
                </div> 
            </div>

        </div>
    );
}

function SuggestedTimeslots({handleConfirm, suggestedEvents, theContacts, timeslotInfo}) {
    const allEventsFuncNotConfirmed = suggestedEvents.map((event) => (<SuggestedTimeslot handleConfirm={() => handleConfirm(event.id)} key={event.id} specificTimeslotInfo={timeslotInfo[event.timeslot]} specificContact={theContacts[event.contact]} />)); 
    return (<div className = "space-y-5">{allEventsFuncNotConfirmed}</div>);
}

function Schedule() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    // Set up hook that stores all User's calendars 
    const [allCalendars, setAllCalendars] = useState([]);

    // Set up hook that stores the schedule we are current viewing
    const [selectedCalToShow, setSelectedCal] = useState('');

    // Set up hook that stores all suggested schedules
    const [allSuggestedSchedules, setAllSuggestedSchedules] = useState({});

    // Set up hook for contacts/invitee in suggested schedules 
    const [theContacts, setTheContacts] = useState({});

    // Set up hook for timeslot info
    const [timeslotInfo, setTimeslotInfo] = useState({});

    // Get information about the event's invitee
    async function getEventContact(contact_id)  {
        return fetch(`http://localhost:8000/api/contacts/${contact_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
        })
        .then(response => response.json())
        .then(resJson => `${resJson.first_name} ${resJson.last_name}`);
    }
    
    // Get information about the timeslot
    async function getEventTimeslot(timeslot_id) {   
        return fetch(`http://localhost:8000/api/calendars/${selectedCalToShow}/timeslots/${timeslot_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
        })
        .then(response => response.json())
        .then(data => {
            return new Date(data.start_time).toString().split(' ').slice(0, 5).join(' ') + ' - ' + new Date(data.end_time).toString().split(' ').slice(0, 5).join(' ');
        })
    }

    async function handleConfirmSchedule(eventId) {
        // PATCH event
        await fetch(`http://localhost:8000/api/events/${eventId}/`,{
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({confirmed: true}),
        });
        retrieveSuggestedSchedules(accessToken, selectedCalToShow);
    }

    useEffect(() => {
        if (allCalendars.length > 0){
            setSelectedCal(`${allCalendars[0].id}`);
        }
    }, [allCalendars])

    useEffect(() => {
        // Check if authorized to access this page and get all calendars
        const calendarsAPI = "http://localhost:8000/api/calendars/";
         // Check if authorized to access this page and get all calendars
        fetch(calendarsAPI, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
            })
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    return {};
                }
            })
            .then(data => {
                if ("code" in data && data["code"] === 'token_not_valid') {
                    // If reached here, then it means that this person isn't authorized to access this page and direct them to the 404 page
                    navigate('/*/');
                }
                else {
                    // If reached here, this User is authorized to access the page.
                    if (data.length != 0) {
                        setAllCalendars(data);
                    }
                    else {
                        setAllCalendars("No Calendars");
                    }
                }
            })
            .catch(error => {
                navigate('/*/');
            });
    }, [accessToken]);

    async function updateThings(allSuggestedSchedules) {
        setTheContacts({});
        setTimeslotInfo({});
        let contacts = {}
        let ts = {};
        for (const [event, obj] of Object.entries(allSuggestedSchedules)) {
            // Get all contact info 
            let newContact = await getEventContact(obj.contact);
            contacts = {...contacts, [obj.contact]:newContact};
            // Get all event info 
            let newts = await getEventTimeslot(obj.timeslot);
            ts = {...ts, [obj.timeslot]:newts}
        }
        setTheContacts(contacts);
        setTimeslotInfo(ts);
    }

    useEffect(() => {
        updateThings(allSuggestedSchedules);
    }, [allSuggestedSchedules]);

    // Add options 
    const allCalendarsFunc = allCalendars.map((cal) => <option value={cal.id} key={cal.id}>{cal.name}</option>);

    function retrieveSuggestedSchedules(accessToken, calendar_id) {
        // retrieveSuggestedSchedules: function retrieves the suggested schedules for all calendars
        const scheduleAPI = "http://localhost:8000/api/calendars/" + calendar_id + "/suggested/";
    
        // Check if authorized to access this page and get all schedules for calendar with <calendar_id>
        fetch(scheduleAPI, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
            })
            .then(response => response.json())
            .then(data => {
                setAllSuggestedSchedules(data);
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    // Determine which is the selected calendar in dropdown 
    async function selectedOption(e) { 
        setSelectedCal(e.target.value);
    }

    // Handles on submit
    function handleSubmit(e) {
        e.preventDefault();
        retrieveSuggestedSchedules(accessToken, selectedCalToShow);
    }
    

    // confirming timeslot

    // cancelling confirmed timeslot 


    // reschedule


    return (
        <div className="min-h-screen relative pb-12 container mx-auto p-4 pb-12 flex flex-col justify-center items-center space-y-7">
            <h1 className = "text-4xl font-bold mt-11">My Schedule</h1>
            <form onSubmit={handleSubmit} className = "flex flex-col space-y-7">
                <select onChange = {selectedOption} name="calendar" id="calendar" className="border p-2 text-sm rounded-[10px] border-gray-500">
                    {allCalendarsFunc}
                </select>
                <button type="submit" className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2">Change Calendars</button>
                <div className = "flex flex-row max-[450px]:flex-col space-x-16 max-[450px]:space-x-0 max-[450px]:space-y-10">
                    <div className = "w-full space-y-5">
                        <h2 className = "font-bold text-2xl text-center">Suggested</h2>
                        {(Object.keys(theContacts).length > 0 && Object.keys(timeslotInfo).length > 0) ? <SuggestedTimeslots handleConfirm={handleConfirmSchedule} suggestedEvents={allSuggestedSchedules} theContacts={theContacts} timeslotInfo={timeslotInfo} /> :<></>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Schedule