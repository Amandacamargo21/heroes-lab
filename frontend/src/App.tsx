import React from "react";
import AppRoutes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/global.css"; 
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default App;
