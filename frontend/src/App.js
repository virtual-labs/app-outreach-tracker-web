import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

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
        {ROUTES.map((route) => {
          const { path } = route;
          return route.children.map((child) => {
            const abs_path = `${path}${child.path}`;

            if (child.protected) {
              return (
                <Route
                  path={abs_path}
                  element={
                    credential && user?.email ? (
                      child.element
                    ) : (
                      <Navigate to={child.failure_redirect} />
                    )
                  }
                />
              );
            } else {
              return (
                <Route
                  path={abs_path}
                  element={
                    credential && user?.email ? (
                      <Navigate to={child.login_redirect} />
                    ) : (
                      child.element
                    )
                  }
                />
              );
            }
          });
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
