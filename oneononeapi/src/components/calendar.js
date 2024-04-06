import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment } from "react";
import './Overlay.css';
import Overlay from '../index';

function Calendar() {
    const [calendarsList, setCalendars] = useState([]);

    const apiUrl = 'http://localhost:8000/api/contacts/';
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
                // there is calendars thus we need to display those contacts on the page
                console.log(data);
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



export default Calendar;