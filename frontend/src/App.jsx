
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Account from "./Pages/Account";
import CreateGroup from"./Pages/CreateGroup";
import Groups  from "./Pages/Group";
import GroupDetailsPage from "./Pages/GroupDetailsPage";
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
      <Route path="/account" element={<Account/>}/>
      <Route path="/create-group" element={<CreateGroup />} />   
      <Route path="/groups" element={<Groups />} />
      <Route path="/group/:groupId" element={<GroupDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;