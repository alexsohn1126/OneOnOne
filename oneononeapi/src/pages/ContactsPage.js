import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment } from "react";
import './Overlay.css';
import Overlay from '../index';


function ContactsPage() {
    // setting up data for the create contact form:
    const initialFormData = {
        "first_name": '',
        "last_name": '',
        "email": ''
    };


    const [formData, setFormData] = useState(initialFormData);

    const [editInfo, setEditInfo] = useState({
        "id": '',
        "first_name": '',
        "last_name": '',
        "email": ''
    });

    // need to use another state for the contacts list so that everytime a contact is added or deleted, it will render a new card on the page 
    // instead of asking the page to be reloaded

    // creating a function to delete the contact
    const send_delete_request = (id) => {
        // we can use the fetch method again to delete the data. Will the page be reloaded after contact is deleted?
        const apiUrl = "http://localhost:8000/api/contacts/" + id + '/';
        console.log(apiUrl);
        const accessToken = localStorage.getItem('accessToken');
        // var navigate = useNavigate();

        fetch(apiUrl, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("contact has been successfully deleted");
                // also need to update the contactsList state here so that the contact can be removed 
                const updatedContacts = contactsList.filter(contact => contact.id !== id);
                setContactsList(updatedContacts);
            }
        })
        .catch((error) => {
            // alert('Login failed');
            console.error('Error during login:', error);
        });
    }

    // let's move send_create_request here so that we can close the form when there are no error and keep it open if there are

    const send_create_request = (data) => {
        const apiUrl = "http://localhost:8000/api/contacts/";
        const accessToken = localStorage.getItem('accessToken');
        var contact_info;
        // var navigate = useNavigate();
        const error_notif = document.querySelector('.createContactError');

        fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        })
            // error received from the servers can be handled and displayed in createContactError element on the page
            .then(response => {
                if (response.ok) {
                    // before closing the form, we also need to reset the form
                    setFormData(initialFormData);
                    toggleOverlay();
                    return response.json();
                }
                return response.json().then(response => {(response.email) ? error_notif.textContent = response.email[0] : error_notif.textContent = "Contact info is invalid"})
            })
            .then((data) => {
                // at this point, the contact has been created so we update the contactslist state to reflect that change
                setContactsList([...contactsList, data]);
                console.log(data);
            })
            .catch((error) => {
                alert('failed');
                console.error('Contact update failed:', error);
            });
    }


    const List_Contacts = ({ data }) => {
        const contacts = data.map((contact) => (
            <li key={'contact ' + contact.id}>
                <div
                    class="py-8 px-8 mb-8 max-w-md mx-auto rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 relative border border-gray-300">
    
                    <div
                        class=" mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0 inline-flex items-center justify-center text-purple-600 text-2xl font-semibold border border-black">
                        {contact.first_name[0].toUpperCase()}
                    </div>
    
                    <div class="text-center sm:text-left mt-4 sm:mt-0">
                        <p class="text-lg text-black font-semibold">
                            {contact.first_name} {contact.last_name}
                        </p>
                        <p class="text-gray-700">
                            <a class="break-all hover:bg-green-500" href="mailto:john@gmail.com">{contact.email}</a>
                        </p>
                    </div>
    
                    {/* EDIT contact info button */}
                    <div class="absolute right-2 top-2 EditContactInfo">
                        <button onClick={() => toggleOverlaytwo(contact)}
                            class="py-2 px-4 mx-0  inline-flex items-end h-10 ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                        </button>
                    </div>
    
                    {/* DELETE contact button */}
                    <div class="absolute right-2 bottom-2 deleteContact">
                        <button class="py-2 px-4 mx-0  inline-flex items-end h-10" onClick={() => send_delete_request(contact.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-6 h-6  hover:fill-green-1">
                                <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                        </svg>
                        </button>
                    </div>
                </div> 
            </li>
        ))
    
        return (
            <div className="container">
                <ul>{contacts}</ul>     
            </div>
          );
    }

    const send_edit_request = (formData) => {
        const id = formData.id;
        const apiUrl = "http://localhost:8000/api/contacts/" + id + '/';
        const accessToken = localStorage.getItem('accessToken');
        const error_notif = document.querySelector('.createContactError');

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    toggleOverlaytwo(formData);
                    return response.json();
                }
                return response.json().then(response => {(response.email) ? error_notif.textContent = response.email[0] : error_notif.textContent = "Contact info is invalid"})
            })
            .then((updatedContact) => {
                // at this point, we have received updated contact info after sending it to the server and there are no errors in it
                const updatedContacts = contactsList.map(contact => {
                    if (contact.id === id) {
                      return updatedContact; // Use the updated contact from the server
                    }
                    return contact; // Keep all other contacts unchanged
                  });
                  setContactsList(updatedContacts);
            })
            .catch((error) => {
                console.log(formData);
                console.log(apiUrl);
                alert('failed');
                console.error('Contact update failed:', error);
            });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // can call a function here that takes in a request for sending form data 
        // and updates the contact info.
        // optionally call navigate to go back to old page after form data has been updated successfully
        // console.log(formData);
        send_create_request(formData);
        // toggleOverlay();
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        send_edit_request(editInfo);
    }

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setEditInfo(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const [editIsOpen, setEditIsOpen] = useState(false);

    const toggleOverlaytwo = (contactInfo) => {
        setEditInfo({
            id: contactInfo.id,
            first_name: contactInfo.first_name,
            last_name: contactInfo.last_name,
            email: contactInfo.email
        });
        setEditIsOpen(!editIsOpen);
    }

    // we first send request to fetch the list of contacts
    const [contactsList, setContactsList] = useState([]);

    const apiUrl = 'http://localhost:8000/api/contacts/';
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Use Bearer scheme for JWT
            },
        })
          .then((response) => response.json())
          .then((data) => {
            // TODO: contact data is in the arrays that are in the dictionary by indices.
            console.log(data);
            if (data.length === 0) {
                console.log("there are no contacts to show");
            } else {
                // when we have fetched the initial list of contacts, this will save those contacts in the contactsList state.
                // everytime
                setContactsList(data);
            }
            // return <h1>Contacts list returned in console</h1>;
          })
          .catch((error) => {
            alert('Login failed');
            console.error('Error during login:', error);
          });
    }, [apiUrl, accessToken])

    return (
        <>
        <body class="min-h-screen relative pb-12">


    <div id="content-wrap" class="pt-32 pb-44 text-center">

        <div class="p-4 rounded-lg shadow mx-auto my-8 max-w-4xl">
            <div class="mb-8">
                <label for="User">Search for user</label>
                <br/>
                <input type="email" class="py-1 px-1 border border-black rounded-xl"/>
            </div>

            <div className="App">
                <button onClick={toggleOverlay}
                    class="py-8 px-8 mb-8 max-w-md mx-auto bg-green-3 hover:bg-green-2 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 CreateContactButton">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-12 h-12">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <div class="text-center sm:text-left mt-4 sm:mt-0">
                        <p class="text-xl text-white font-semibold">
                            Add contact
                        </p>
                    </div>
                </button>


                <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                {/* <h1>Hello from overlay</h1> */}
                <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="First Name"
                        />
                        <p className="text-sm"></p> {/* Placeholder for potential error message for first name */}
                        
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="Last Name"
                        />
                        <p className="text-sm"></p> {/* Placeholder for potential error message for last name */}
                        
                        <input
                            type="email" // Note: Changed type to 'email' to match the type of email input from Template A
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="Email"
                        />
                        <p className="text-sm createContactError"></p> {/* Placeholder for potential error message for email */}

                        <button
                            type="submit"
                            className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2" // Adjusted the color classes to use Tailwind's default color scale
                        >
                            Create contact
                        </button>
                    </form>
                </Overlay>


                <Overlay isOpen={editIsOpen} onClose={toggleOverlaytwo}>
                {/* <h1>Hello from overlay</h1> */}
                <form onSubmit={handleSubmit2} className="space-y-4">
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={editInfo.first_name}
                            onChange={handleChange2}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="First Name"
                        />
                        <p className="text-sm"></p> {/* Placeholder for potential error message for first name */}
                        
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={editInfo.last_name}
                            onChange={handleChange2}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="Last Name"
                        />
                        <p className="text-sm"></p> {/* Placeholder for potential error message for last name */}
                        
                        <input
                            type="email" // Note: Changed type to 'email' to match the type of email input from Template A
                            id="email"
                            name="email"
                            value={editInfo.email}
                            onChange={handleChange2}
                            className="border w-full p-2 text-sm rounded-[10px] border-gray-500"
                            placeholder="Email"
                        />
                        <p className="text-sm createContactError"></p> {/* Placeholder for potential error message for email */}

                        <button
                            type="submit"
                            className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2" // Adjusted the color classes to use Tailwind's default color scale
                        >
                            Update Contact
                        </button>
                    </form>
                </Overlay>

            </div>

            {/* contact cards should go below here */}

            


            {contactsList ? (
                <List_Contacts data={contactsList} /> // Render child with fetched data
            ) : (
                <p>Loading...</p> 
            )}
        </div>
    </div>

    <footer class="absolute bottom-0 min-w-full text-center h-12 bg-footer flex justify-center items-center text-white">
            <p>Copyright &copy; 2024</p>
        </footer>


        </body>
        </>
    )
}


function deprecated({ data }) {
        // const deleteContact = delete_contact(data);
        const contacts = data.map((contact) => (
        <li key={'contact ' + contact.id}>
            <div
                class="py-8 px-8 mb-8 max-w-md mx-auto rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 relative border border-gray-300">

                <div
                    class=" mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0 inline-flex items-center justify-center text-purple-600 text-2xl font-semibold border border-black">
                    {contact.first_name[0].toUpperCase()}
                </div>

                <div class="text-center sm:text-left mt-4 sm:mt-0">
                    <p class="text-lg text-black font-semibold">
                        {contact.first_name} {contact.last_name}
                    </p>
                    <p class="text-gray-700">
                        <a class="break-all hover:bg-green-500" href="mailto:john@gmail.com">{contact.email}</a>
                    </p>
                </div>

            
                <div class="absolute right-2 top-2 EditContactInfo">
                    <button
                        class="py-2 px-4 mx-0  inline-flex items-end h-10 ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                    </button>
                </div>

                <div class="absolute right-2 bottom-2 deleteContact">
                    <button class="py-2 px-4 mx-0  inline-flex items-end h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-6 h-6  hover:fill-green-1">
                            <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                    </svg>
                    </button>



                </div>
            </div> 
        </li>
    ))

    return (
        <div className="container">
            <ul>{contacts}</ul>     
        </div>
      );
}


export {ContactsPage};

