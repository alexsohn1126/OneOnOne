import logo from './logo.svg';
import './App.css';

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
import Login from './pages/login';
// import Layout from './pages/layout';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import {Contacts, ContactsInfo} from './pages/Contacts';
import Signin from './pages/Signin';
import ContactsPage from './pages/ContactsPage'
import HeaderLayout from './components/layout'
// import ContactsInfo from './pages/Contacts';

// don't need the header and the footer since that is used by index.js which uses app.js (gotta love these
// dependencies -_-)

// the component or code below could go in a separate JS file that defines behaviour when we send a get request 
// to a url 

// the routes can also be added to index JS instead 

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p class="text-slate-100">
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path ="/" element={<Home/>}></Route>
          <Route path="/contacts" element={<ContactsPage />} />
          {/* <Route path="/calendars" element={<Calendar />} /> */}
          <Route path="/contacts/:id" element={<ContactsInfo />}></Route>
        </Route>
        
        <Route path='/signin' element={<Signin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




