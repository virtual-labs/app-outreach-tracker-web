import React from "react";
import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { API_URL, CLIENT_ID } from "../utils/config";

const Landing = () => {
  const { handleGoogle, loading, error } = useFetch(`${API_URL}/login`);

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("loginDiv"), {
        // type: "standard",
        theme: "filled_black",
        // size: "small",
        text: "signin_with",
        shape: "pill",
      });

      // google.accounts.id.prompt();
    }
  }, [handleGoogle]);
  return (
    <>
      <header style={{ textAlign: "center" }}>
        <h1>Outreach</h1>
      </header>
      <main style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? <div>Loading....</div> : <div id="loginDiv"></div>}
      </main>
    </>
  );
};

export default Landing;
