import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/header';
import Footer from './components/footer';
import { Fragment } from "react";
import "./pages/Overlay.css";

// the router paths are added in app.js only. The header and the footer doesn't change in between calls

// the strict mode in the render element below renders every component twice (during dev not production)
// in order to detect any problems with the code. It can be run in production mode by running the commented version

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Header /> */}
    <App />
    {/* <Footer /> */}
  </React.StrictMode>
  // <>
  //   <Header />
  //   <App />
  //   <Footer />
  // </>
);



export function Overlay({ isOpen, onClose, children }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="overlay__controls">
              <button
                className="overlay__close"
                type="button"
                onClick={onClose}
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
