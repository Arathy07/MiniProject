import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import AppContextLayout from "./context/contextLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import IndividualEstimate from "./components/IndividualEstimate";
import Admin from "./components/Admin";
import LandingPage from "./components/Landing";
import UserDash from "./components/UserDash";
import AverageEstimate from "./components/AvrageEstimate";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppContextLayout />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/estimateitems" element={<IndividualEstimate />} />
            <Route path="/estimateaverage" element={<AverageEstimate />} />
            <Route path="/userdashboard" element={<UserDash />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
