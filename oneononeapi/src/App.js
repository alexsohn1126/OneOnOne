// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './components/login';
// import Layout from './components/layout';
// import Home from './components/Home';
// import NoPage from './components/NoPage';
// import Calendar from './components/calendar';
// import {Contacts, ContactsInfo} from './components/Contacts';


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


// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Layout from './pages/layout';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import {ContactsPage} from './pages/ContactsPage';
import ContactScheduling from './pages/ContactScheduling';
import HeaderLayout from './components/layout';
// TODO: Change this once calendar.js is finished and in pages folder
// import Calendar from './pages/Calendar';
import NotFoundPage from './pages/NotFoundPage';
import EditProfile from './pages/EditProfile';
import Schedule from './pages/Schedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path ="/" element={<NotFoundPage/>}></Route>
          <Route path="/contacts" element={<ContactsPage />} />
          {/* TODO: FIX THIS ONCE CALENDAR DONE <Route path="/calendars" element={<Calendar />} /> */}
          <Route path='/schedules' element={<Schedule/>}></Route>
          {/* TODO: CHANGE ABOVE TO SCHEDULES PAGE */}
          <Route path='/edit-profile/' element={<EditProfile/>}></Route>
        </Route>
        <Route path="/calendar/:calendarId/contact/:contactId" element={<ContactScheduling />} />
        <Route path='/signin' element={<Signin />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




