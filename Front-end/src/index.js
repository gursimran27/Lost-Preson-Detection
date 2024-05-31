// main.tsx or main.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  
import { Toaster } from "react-hot-toast";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";

const store = configureStore(
  {
    reducer: rootReducer,
  }
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

  <Provider store={store}>
    <BrowserRouter>
        <App />
        <Toaster/>
    </BrowserRouter>
  </Provider>
  
  </React.StrictMode>
);