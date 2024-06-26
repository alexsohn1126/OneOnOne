import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom/';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function EditProfile() {
  let navigate = useNavigate();
  // Set up hook for current profile information
  const [editProfileInfo, setEditProfileInfo] = useState({
    "first_name": "",
    "last_name": "",
    "username": "",
    "email": "",
    "password": ""
  });

  // Set up hook for profile validation errors
  const [editProfileErrors, setEditProfileErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: ""
  });

  // Set up hook for changes to border color 
  const [borderColor, setBorderColor] = useState({
    first_name: "border-gray-500",
    last_name: "border-gray-500",
    username: "border-gray-500",
    email: "border-gray-500",
    password: "border-gray-500",
  });

  const [success, setSuccessMsg] = useState('');

  const editProfileAPI = 'http://localhost:8000/api/accounts/profile/';
  const accessToken = localStorage.getItem('accessToken');

  // useEffect: function will run what is inside its body when it is rendered
  useEffect(() => {
    // Check if authorized to access this page 
    fetch(editProfileAPI, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken, // Pass in access token
      },
    })
      .then(response => response.json())
      .then(data => {
        if ("first_name" in data) {
          // If reached here, this User is authorized to access the page and set the form up 
          // with the User's info that is retrieved from the database
          setEditProfileInfo({ "first_name": data["first_name"], "last_name": data["last_name"], "username": data["username"], "email": data["email"], "password": "" })
        }
        else {
          // If reached here, then it means that this person isn't authorized to access this page and direct them to the 404 page
          navigate('/*/');
        }
      })
      .catch(error => {
        navigate('/*/');
      });
  }, [navigate, accessToken]);

  // handleChange: Function is called to set state when info is added into the input fields 
  // Referenced https://www.geeksforgeeks.org/how-to-use-handlechange-function-in-react-component/
  const handleChange = (e) => {
    setEditProfileInfo(prevEditProfile => ({ ...prevEditProfile, [e.target.name]: e.target.value }));
  };

  // handleSubmit: If this function is called, it means that edits could have been made and we should validate their inputted info  
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(editProfileAPI, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken, // Pass in access token
      },
      body: JSON.stringify({ "first_name": editProfileInfo.first_name, "last_name": editProfileInfo.last_name, "username": editProfileInfo.username, "email": editProfileInfo.email, "password": editProfileInfo.password }),
    })
      .then(newresponse => newresponse.json())
      .then(newdata => {
        // Clear any previous errors 
        setEditProfileErrors({ first_name: "", last_name: "", username: "", email: "", password: "" });
        // Error checking
        let all_errors = {}
        let all_border_error_colors = {}
        for (let err in newdata) {
          if (typeof newdata[err] != "string") {
            all_errors[err] = (newdata[err]).toString();
            all_border_error_colors[err] = "border-red-600";
          }
        }
        setEditProfileErrors(all_errors);
        setBorderColor(all_border_error_colors);
        if ("first_name" in newdata && (typeof newdata["first_name"]) == "string") {
          // Show a success message if there's no error in the form 
          setSuccessMsg("Profile was updated.");
        }
      })
      .catch(error => {
        setSuccessMsg("There was an error. Please try submitting again or refresh the page.");
      }
      )
  }

  const deleteProfile = (e) => {
    // Make request to delete profile 
    const deleteProfileAPI = 'http://localhost:8000/api/accounts/delete/';
    fetch(deleteProfileAPI, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken, // Pass in access token
      }
    })
      .then(response => {
        if (response.status === 204) {
          navigate("/signin/");
        }
        else {
          setSuccessMsg("Something went wrong when deleting your profile.");
        }
      })
      .catch(error => {
        // If something goes wrong, just navigate them back to the edit profile page
        setSuccessMsg("Something went wrong when deleting your profile.");
      })
  }

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h2 className="font-bold text-2xl">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 space-y-4">
        <input value={editProfileInfo.first_name} onChange={handleChange} type="text" name="first_name" id="firstname" required="" className={["border w-full p-2 text-sm rounded-[10px] border-gray-500", borderColor.first_name].join(' ')} placeholder="First Name"></input>
        <p className="text-red-600 text-sm">{editProfileErrors.first_name}</p>
        <input value={editProfileInfo.last_name} onChange={handleChange} type="text" name="last_name" id="lastname" required="" className={["border w-full p-2 text-sm rounded-[10px] border-gray-500", borderColor.last_name].join(' ')} placeholder="Last Name"></input>
        <p className="text-red-600 text-sm">{editProfileErrors.last_name}</p>
        <input value={editProfileInfo.username} onChange={handleChange} type="text" name="username" id="username" required="" className={["border w-full p-2 text-sm rounded-[10px] border-gray-500", borderColor.username].join(' ')} placeholder="Username"></input>
        <p className="text-red-600 text-sm">{editProfileErrors.username}</p>
        <input value={editProfileInfo.email} onChange={handleChange} type="text" name="email" id="email" required="" className={["border w-full p-2 text-sm rounded-[10px] border-gray-500", borderColor.email].join(' ')} placeholder="Email Address"></input>
        <p className="text-red-600 text-sm">{editProfileErrors.email}</p>
        <input value={editProfileInfo.password} onChange={handleChange} type="password" name="password" id="password" required="" className={["border w-full p-2 text-sm rounded-[10px] border-gray-500", borderColor.password].join(' ')} placeholder="New Password/Current Password"></input>
        <p className="text-red-600 text-sm">{editProfileErrors.password}</p>
        <button type="submit" className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2">Submit</button>
        <p className="text-sm">{success}</p>
      </form>
      <div className="w-full max-w-md p-6 space-y-4">
        <h2 className="font-bold text-xl">Delete Profile</h2>
        <Popup trigger={<button type="submit" className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-red-800 hover:bg-red-700">I wish to delete my profile</button>} modal nested>
          {
            close => (
              <div className='modal'>
                <div className = "p-6 space-y-4">
                  <p className='text-sm'>Do you confirm that you want to delete your profile?</p>
                  <button className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-red-800 hover:bg-red-700" onClick={(e) => deleteProfile(e)}>Yes! Please delete my profile.</button>
                  <button className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2" onClick={() => close()}>No! Please close this popup.</button>
                </div>
              </div>
            )
          }
        </Popup>
      </div>

    </div>
  );
}

export default EditProfile;