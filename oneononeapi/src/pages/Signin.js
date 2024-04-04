import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/'
// Import stylesheet 
import "../styles/output.css"

function Signin() {
    const navigate = useNavigate();
    // Set up hooks (setEmail = function used to set email state variable, setPassword = function used to set password state variable)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Set up hooks for validation
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
                navigate('/api/calendars/');
    
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
        <div class="flex flex-col justify-center items-center mt-20 text-[#404040]">
          <h1 class="text-5xl font-bold text-transparent bg-gradient-to-br from-[#001233] to-[#979DAC] bg-clip-text">1 on 1</h1>
          <div class="w-full max-w-md p-6 space-y-6">
            <h2 class = "font-bold text-2xl">Sign in</h2>
            <form onSubmit={handleSubmit} class="space-y-4">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" required="" class="border w-full p-2 text-sm rounded-[10px] border-gray-500" placeholder="Email Address"></input>
              <p class ="text-sm">{errorEmail}</p>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Password" required="" class="border w-full p-2 text-sm rounded-[10px] border-gray-500"></input>
              <p class = "text-sm">{errorPassword}</p>
              <div class="flex flex-row max-[350px]:flex-col items-center justify-between text-sm font-medium">
                <div class="flex items-center">
                  <input id="remember-me" type="checkbox" class="mr-2 rounded-[10px]"></input>
                  <label for="remember-me" class="">Remember me</label>
                </div>
                <a class="hover:underline text-green-3" href="forgot_password">Forgot password?</a>
              </div>
              <button type="submit" class="w-full px-5 py-3 font-medium text-center rounded-[10px] text-white bg-green-3 hover:bg-green-2">Log in</button>
              <p class="text-sm font-medium text-center">Don’t have an account yet? <a href="signup" class="hover:underline text-green-3">Sign up</a></p>
              <p class ="text-sm">{loginFailed}</p>
            </form>
          </div>
        </div>
    );
}

export default Signin;