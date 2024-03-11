import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import "./css/App.css";
import "./css/index.css";

function App() {
  const [user, setUser] = useState({});
  const [credential, setCredential] = useState(null);
  useEffect(() => {
    const theUser = localStorage.getItem("user");
    const cred = localStorage.getItem("credential");

    if (theUser && !theUser.includes("undefined")) {
      setUser(JSON.parse(theUser));
    }
    if (cred && !cred.includes("undefined")) {
      setCredential(cred);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            credential && user?.email ? (
              <Navigate to="/dashboard" />
            ) : (
              <Landing />
            )
          }
        />
        <Route
          path="/dashboard"
          element={credential ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
