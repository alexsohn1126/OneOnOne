import React, { useState } from 'react';

function LoginForm({ onLoginSuccess }) {
    // set email is the function used to set the email state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the login function (defined next)
        login(email, password, onLoginSuccess);
    };

    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label>Email</label>
            <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
            <label>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit">Login</button>
        </form>
  );
}


// method below sends a request with the information required for logging in 
function login(email, password, onLoginSuccess) {
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
      .then((response) => response.json())
      .then((data) => {
        // at this point the data variable contains the response data sent by the server after a successful login. If it contains a key named 
        // access that means we were successfully logged in
        if (data.access) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('userId', data.user_id);

            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess(data.access);
            }

        } else {
            // if we get here, the data is returned but it doesn't contain access token so invalid login info
            alert('Login info incorrect');
        }
      })
      .catch((error) => {
        alert('Login failed');
        console.error('Error during login:', error);
      });
  }
  

  function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const handleLoginSuccess = (token) => {
      console.log('Logged in with token:', token);
      setIsLoggedIn(true);
      // Redirect the user or load a new component
    };
  
    return (
      <div>
        {/* using a ternary operator below to handle what is displayed when the user logs in successfully */}
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div>Welcome back!</div>
        )}
      </div>
    );
  }
  
  export default Login;