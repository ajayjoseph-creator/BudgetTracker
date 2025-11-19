import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
     <ToastContainer   position="bottom-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  draggable
  theme="light" />
  </Provider>
);
