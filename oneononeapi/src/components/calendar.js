import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment } from "react";
import './Overlay.css';
import Overlay from '../index';

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
            // TODO: Calendar data is in the arrays that are in the dictionary by indices.
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
                <List_Calendars data={calendarsList} /> // Render child with fetched data
            ) : (
                <p>Loading...</p> 
            )}
        </div>
    )
}

function List_Calendars({ data }) {
    // setting up data for the create calendar form:
    const [formData, setFormData] = useState({
        "name": '',
        "start_date": '',
        "end_date": '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await send_create_request(formData); // Wait for the request to complete
        setIsOpen(false); // Close the overlay on successful POST
        console.log('Calendar created successfully');
    } catch (error) {
        alert('Failed to create calendar.'); // Show an error message
        console.error('Error:', error);
    }
    };

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
        } catch (error) {
            console.error('Error deleting calendar:', error);
            alert('Failed to delete calendar.');
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };


    // data has some number of calendars that we fetched from the server. We now display this calendar on the page along with a <Create_new_calendar> button 
    const calendars = data.map((calendar) => (
        <li key={'calendar ' + calendar.id}>
            <div>
                <p>Calendar Name: {calendar.name}</p>
                <p>Start Date: {calendar.start_date}</p>
                <p>End Date: {calendar.end_date}</p>
                <button onClick={() => handleDelete(calendar.id)}>Delete</button>
            </div>
        </li>
    ))

    return (
        <div className="container">
            <div>
                <h1>List of Calendars</h1>
            </div>
        
            <ul>{calendars}</ul>

            <div className="App">
            <button onClick={toggleOverlay}>Create new calendar</button>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <form onSubmit={handleSubmit}>
                <div>
                    <label>Calendar Name</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>start_date</label>
                    <input
                    type="text"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>end_date</label>
                    <input
                    type="text"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    />
                </div>
                <button type="submit">Create Calendar</button>
                </form>
            </Overlay>
            </div>
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
    .then((response) => response.json())
    .catch((error) => {
        console.error('Calendar creation failed:', error);
        throw new Error('Failed to create calendar');  // Throw an error to handle in handleSubmit
    });
}


export default Calendar;