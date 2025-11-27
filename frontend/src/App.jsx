
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;