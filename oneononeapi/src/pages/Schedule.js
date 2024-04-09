import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom/';


function UnconfirmedTimeslots({allUnconfirmedEvents, theContacts, timeslotInfo}) {
    const allEventsFuncNotConfirmed = allUnconfirmedEvents.map((event) => (
        <div className = "flex flex-row items-center justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300">
            <div className = "w-max">
                <h3 className = "font-bold">{theContacts[event.contact]}</h3>
                <h3>{timeslotInfo[event.timeslot]}</h3>
            </div>
            <div className = "relative flex flex-row space-x-2 items-center">
                <div>
                    <button>
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
                <div>
                    <button>           
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A4AC86" className="w-8 h-8 hover:fill-green-1">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                        </svg>            
                    </button>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <span className="text-sm text-white p-2 bg-black rounded">
                            Reschedule
                        </span>
                    </div>
                </div>   
            </div>
        </div>
        )); 

    return (<div className = "space-y-5">{allEventsFuncNotConfirmed}</div>);
}

function ConfirmedTimeslots({allConfirmedEvents, theContacts, timeslotInfo}) {
    const allEventsFuncConfirmed = allConfirmedEvents.map((event) => (
        <div className = "flex flex-row items-center justify-between space-x-3 shadow-md border p-2 text-sm rounded-[10px] border-gray-300">
            <div className = "w-max">
                <h3 className = "font-bold">{theContacts[event.contact]}</h3>
                <h3>{timeslotInfo[event.timeslot]}</h3>
            </div>
            <div className = "relative flex flex-row space-x-2 items-center">
                <div>
                    <button>
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
        ));
    return (<div className = "space-y-5">{allEventsFuncConfirmed}</div>);
}


function Schedule() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    // Set up hook that stores all User's calendars 
    const [allCalendars, setAllCalendars] = useState([]);

    // Set up hook that stores the schedule we are current viewing
    const [selectedCalToShow, setSelectedCal] = useState('');

    // Set up hook that stores all suggested schedules
    const [allSuggestedSchedules, setAllSuggestedSchedules] = useState([]);

    // Set up hook that stores all confirmed events 
    const [allConfirmedEvents, setAllConfirmedEvents] = useState([]);

    // Set up hook that stores all unconfirmed events
    const [allUnconfirmedEvents, setAllUnconfirmedEvents] = useState([]);

    // Set up hook for contacts/invitee in suggested schedules 
    const [theContacts, setTheContacts] = useState([]);

    // Set up hook for timeslot info
    const [timeslotInfo, setTimeslotInfo] = useState([]);

    // Get information about the event's invitee
    async function getEventContact(contact_id)  {
        console.log("In Get Event Contact");
        console.log(contact_id);
        const contactAPI = "http://localhost:8000/api/contacts/" + contact_id + "/";
        fetch(contactAPI, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
        })
        .then(response => response.json())
        .then(data => { 
            setTheContacts(prevAddedContacts => ({...prevAddedContacts, [contact_id]: data}));
        })
    }
    
    
    // Get information about the timeslot
    async function getEventTimeslot({calendar_id, timeslot_id}) {   
        const timeslotAPI = "http://localhost:8000/api/calendars/" + calendar_id + "/timeslots/" + timeslot_id + "/";
        fetch(timeslotAPI, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken, // Pass in access token
            },
        })
        .then(response => response.json())
        .then(data => { 
            let time = data.start_time + "-" + data.end_time;
            setTimeslotInfo(prevTimeslotInfo => ({...prevTimeslotInfo, [timeslot_id]: time}));
        })
    }

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
            .then(response => response.json())
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

    // Add options 
    const allCalendarsFunc = allCalendars.map((cal) => <option value={cal.id}>{cal.name}</option>);

    async function retrieveSuggestedSchedules(accessToken, calendar_id) {
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
                // Check if the timeslot is confirmed or not
                let allConfirmed = []
                let allUnconfirmed= []
                for (let cal in data) {
                    if (data[cal].confirmed === false) {
                        allUnconfirmed.push(data[cal]);
                    }
                    else {
                        allConfirmed.push(data[cal]);
                    }
                }
                setAllConfirmedEvents(allConfirmed);
                setAllUnconfirmedEvents(allUnconfirmed);
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
    async function handleSubmit(e) {
        e.preventDefault();
        await retrieveSuggestedSchedules(accessToken, selectedCalToShow);
        setTheContacts({});
        setTimeslotInfo({});
        console.log(allSuggestedSchedules);
        if (allSuggestedSchedules.length !== 0) {
            for (let anEvent in allSuggestedSchedules) {
                // Get all contact info 
                await getEventContact(anEvent.contact);
                // Get all event info 
                await getEventTimeslot(selectedCalToShow, anEvent.timeslot_id);
            }
        }
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
                        <UnconfirmedTimeslots allUnconfirmedEvents={allUnconfirmedEvents} theContacts={theContacts} timeslotInfo={timeslotInfo}></UnconfirmedTimeslots>
                    </div>
                    <div className = "w-full space-y-5">
                        <h2 className = "font-bold text-2xl text-center">Confirmed</h2>
                        <ConfirmedTimeslots allConfirmedEvents={allConfirmedEvents} theContacts={theContacts} timeslotInfo={timeslotInfo}></ConfirmedTimeslots>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Schedule