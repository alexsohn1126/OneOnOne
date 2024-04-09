import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment } from "react";
import './Overlay.css';
import Overlay from '../index';

// this is a parent component and it would have another child component that would render the page with the contact data. The child
// component would also add a button on the page and a pop-up form to create a new contact. After the new contact has been added, we can call 
// navigate to the same page to refresh and show the new contact
function Contacts() {
    // using contactsList variable to store the list of contacts that are returned by the server
    const [contactsList, setContactsList] = useState(null);

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
                // there is contacts thus we need to display those contacts on the page
                console.log(data[0].first_name);
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
        // the intial template of the contacts page should be returned here including the add contact button
        <div>
            {contactsList ? (
                <List_Contacts data={contactsList} /> // Render child with fetched data
            ) : (
                <p>Loading...</p> 
            )}
        </div>
    )
    
      
}


function List_Contacts({ data }) {
    // setting up data for the create contact form:
    const [formData, setFormData] = useState({
        "first_name": '',
        "last_name": '',
        "email": ''
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
        // can call a function here that takes in a request for sending form data 
        // and updates the contact info.
        // optionally call navigate to go back to old page after form data has been updated successfully
        // console.log(formData);
        send_create_request(formData);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };



    // console.log('hi');
    // data has some number of contacts that we fetched from the server. We now display this contact on the page along with a <Create_new_contact> button 
    const contacts = data.map((contact) => (
        <li key={'contact ' + contact.id}>
            <p>Contact Name: {contact.first_name} {contact.last_name}</p>
            <span>Email: {contact.email}</span>
        </li>
    ))

    return (
        <div className="container">
            <div>
                <h1>List of contacts</h1>
            </div>
        
            {/* we would need to save the contact cards in the contacts variable and then assign that here. Should work  */}
            <ul>{contacts}</ul>     

            <div className="App">
            <button onClick={toggleOverlay}>Create new contact</button>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                {/* <h1>Hello from overlay</h1> */}
                <form onSubmit={handleSubmit}>
                <div>
                    <label>first name</label>
                    <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    // using the attribute firstName and its setter ensures that <input> is "controlled" and that the fields are updated as we enter the values
                    value={formData.first_name}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>lname</label>
                    <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                    type="text"
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
                <button type="submit">Create contact</button>
                </form>
            </Overlay>
            </div>
        </div>
      );
}


function send_create_request(formData) {
    const apiUrl = "http://localhost:8000/api/contacts/";
    const accessToken = localStorage.getItem('accessToken');

    fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

        })
        .catch((error) => {
            alert('failed');
            console.error('Contact update failed:', error);
        });
}



function delete_contact(data) {
    // in this function we would make a fetch call with method delete to delete contact info
    var id = data.id;

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
            console.log("contact has been successfully deleted")
            // can TRIGGER a UI update here. Same UI update can be used to update the contact information after EDIT 
            // and/or CREATE 
            // navigate('/contacts');
        }
    })
    .catch((error) => {
        // alert('Login failed');
        console.error('Error during login:', error);
      });
}

function send_edit_request(id, formData) {
    const apiUrl = "http://localhost:8000/api/contacts/" + id + '/';
    const accessToken = localStorage.getItem('accessToken');

    fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

        })
        .catch((error) => {
            alert('failed');
            console.error('Contact update failed:', error);
          });

}

// name of a react component must start with an uppercase letter. A react component is 
// anything that renders the UI dynamically upon submission of some request 

// remember that Contact_details is a child component of Contacts_Info (since it's used inside that Parent component to render additional data)

function Contact_details({ data }) {
    const [formData, setFormData] = useState({
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email
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
        // can call a function here that takes in a request for sending form data 
        // and updates the contact info.
        // optionally call navigate to go back to old page after form data has been updated successfully
        // console.log(formData);
        send_edit_request(data.id, formData);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
          <p>Name: {data.first_name} {data.last_name}</p>
          <p>Email: {data.email}</p>
            <div>
          <button type="button" onClick={() => delete_contact(data)}>Delete Contact</button>
            </div>
        <div className="App">
            <button onClick={toggleOverlay}>Edit contact information</button>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                {/* <h1>Hello from overlay</h1> */}
                <form onSubmit={handleSubmit}>
                <div>
                    <label>first name</label>
                    <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    // using the attribute firstName and its setter ensures that <input> is "controlled" and that the fields are updated as we enter the values
                    value={formData.first_name}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>lname</label>
                    <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
                <button type="submit">Update contact information</button>
                </form>
            </Overlay>
        </div>

        <div className='for-form'></div>
    </div>
      );
}

function ContactsInfo () {
    // on top of displaying the contact info, this also needs to have a button
    const [contactData, setContactData] = useState(null);

    // the lines below fetch the id of the contact being looked up
    const route_params = useParams();
    const id = route_params['id'];
    // console.log(id);
    const apiUrl = 'http://localhost:8000/api/contacts/' + id;
    const accessToken = localStorage.getItem('accessToken');
    var contact_info;
    var navigate = useNavigate();
    
    // fetch is asynchronous so the variables defined outside it will be undefined 
    // this is because the then call will happen after the return code below has been executed 

    useEffect(()=> {
        var elem = document.querySelector('header');
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Use Bearer scheme for JWT
            },
        })
          .then((response) => {
            if (response.ok) {
                console.log(response);
                return response.json();
            } else if (response.status === 404) {
                console.log("we have a 404 not found error as this contact DNE");
                // How do i make the 404 not found error not show up in the console?

                // in this case, it would make more sense to show on the page that this contact dne
                // and giving a link which navigates back to contacts page
                navigate('/contacts');
            }
          })
          .then((data) => {
            setContactData(data);       // updating the state with the fetched data
          })
          .catch((error) => {
            // alert('Login failed');
            console.error('Error during login:', error);
          });
    }, [apiUrl, accessToken])

    return (
        <div>
            {/* if the contact data has been updated, we call the child component (contact_details) and that 
            renders the updated data along with some buttons */}
            {/* if contactData has been updated, we call contact_details component to render the information 
            interactively on the page */}
          {contactData ? (
            <Contact_details data={contactData} /> // Render child with fetched data
          ) : (
            <p>Loading...</p> 
          )}
      </div>
      );
}

// export {Contacts, ContactInfo};
export {Contacts, ContactsInfo};