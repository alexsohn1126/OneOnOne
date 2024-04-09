import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Layout from './components/layout';
import Home from './components/Home';
import NoPage from './components/NoPage';
import Calendar from './pages/calendar';
import {Contacts, ContactsInfo} from './pages/Contacts';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* the home.js page needs to be defined */}
        <Route path ="/" element={<Home/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/calendars" element={<Calendar />} />
        <Route path="/contacts/:id" element={<ContactsInfo />}></Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
