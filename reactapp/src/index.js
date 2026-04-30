// This is the main entry point of our React application.
// We set up Redux and Toast notifications here so they work across the whole app.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing the style for toast messages
import './index.css';
import App from './App';
import store from './store'; // The central database for our app state

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* The Provider makes the Redux store available to all components */}
    <Provider store={store}>
      <App />
      {/* The ToastContainer is where the pop-up messages will appear */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  </React.StrictMode>
);