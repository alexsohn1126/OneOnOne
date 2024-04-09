
import React from 'react';


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
import Calendar from './pages/calendar';
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
          <Route path="/calendars" element={<Calendar />} />
          <Route path='/schedules' element={<Schedule/>}></Route>
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




