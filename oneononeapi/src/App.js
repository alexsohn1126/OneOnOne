// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// header and footer exist on every page


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Layout from './components/layout';
import Home from './components/Home';
import NoPage from './components/NoPage';
import {Contacts, ContactsInfo} from './components/Contacts';
// import ContactsInfo from './components/Contacts';

// don't need the header and the footer since that is used by index.js which uses app.js (gotta love these
// dependencies -_-)

// the component or code below could go in a separate JS file that defines behaviour when we send a get request 
// to a url 

// the routes can also be added to index JS instead 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p class="text-slate-100">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;




// class connectionExample extends React.Component {
//   componentDidMount() {
//     const apiUrl = 'http://localhost:8000/api/contacts/';
//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }
//   render() {
//     return <div>Example connection</div>; 
//   }
// }

// export default connectionExample;


