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
import Login from './pages/login';
// import Layout from './pages/layout';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import {Contacts, ContactsInfo} from './pages/Contacts';
import Signin from './pages/Signin';
import {ContactsPage} from './pages/ContactsPage';
import HeaderLayout from './components/layout';
import Calendar from './pages/Calendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path ="/" element={<Home/>}></Route>
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/calendars" element={<Calendar />} />
          <Route path="/contacts/:id" element={<ContactsInfo />}></Route>
          <Route path='/schedules' element={<NoPage/>}></Route>
        </Route>
        
        <Route path='/signin' element={<Signin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




