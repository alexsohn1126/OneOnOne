import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom/'

function Signin() {
  const navigate = useNavigate();
  // Set up hooks (setEmail = function used to set email state variable, setPassword = function used to set password state variable)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Set up hooks for validation errors
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState('');

  // handleSubmit: Attempt to sign in by making a request with info needed for logging in when button is clicked
  async function handleSubmit(e) {
    e.preventDefault();
    // Referenced https://medium.com/@preciousimoniakemu/create-a-react-login-page-that-authenticates-with-django-auth-token-8de489d2f751
    const apiUrl = 'http://localhost:8000/api/accounts/signin/';
    // after we get the token and store it in local storage we can specify the header with authentication tokens
    // before sending in any request
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        // at this point the data variable contains the response sent by the server after a successful login
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem('userId', data.user_id);
          // Go to calendars page 
          navigate('/calendars/');

        } else {
          // If we're here, the login info is invalid. Render which field has the error 
          if (data !== "" && "email" in data) {
            setErrorEmail(data.email.toString());
          }
          else {
            setErrorEmail('');
          }
          if (data !== "" && "password" in data) {
            setErrorPassword(data.password.toString());
          }
          else {
            setErrorPassword('');
          }
        }
      })
      .catch(error => {
        setLoginFailed('There was an error during login. Please try again.');
      });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-5xl font-bold text-transparent bg-gradient-to-br from-[#001233] to-[#979DAC] bg-clip-text">1 on 1</h1>
      <div className="w-full max-w-md p-6 space-y-6">
        <h2 className="font-bold text-2xl">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" required="" className="border w-full p-2 text-sm rounded-[10px] border-gray-500" placeholder="Email Address"></input>
          <p className="text-sm">{errorEmail}</p>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Password" required="" className="border w-full p-2 text-sm rounded-[10px] border-gray-500"></input>
          <p className="text-sm">{errorPassword}</p>
          <button type="submit" className="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2">Log in</button>
          <p className="text-sm font-medium text-center">Don’t have an account yet? <Link to="/signup" className="hover:underline text-green-3">Sign up</Link></p>
          <p className="text-sm">{loginFailed}</p>
        </form>
      </div>
    </div>
  );
}

export default Signin;