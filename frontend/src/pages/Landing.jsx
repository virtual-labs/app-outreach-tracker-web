import React from "react";
import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { API_URL, CLIENT_ID } from "../utils/config";
import BackImg from "../media/introduction.webp";
import "../index.css";
import NavBar from "./components/Navbar";

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
      <div className="flex flex-col bg-gray-100 font-sans h-full w-full overflow-hidden">
        {/* Header */}
        <NavBar hide={true} />

        {/* Main Content Section */}
        <div className="flex-1 text-center py-0 relative">
          <img src={BackImg} className=" object-cover" />

          {/* Content Over the Cover Image */}
          <div className="landpage-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            <h2 className="text-3xl font-bold mb-4">Virtual Labs Outreach</h2>
            <p className="text-lg">
              Expanding educational horizons through interactive virtual
              experiences and inclusive learning initiatives
            </p>
            <div className="w-full flex flex-col items-center justify-center">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div id="loginDiv" className="mt-8"></div>
              )}
              {error && <p className="text-red-800 text-lg m-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-white text-center py-4">
          <p>&copy; 2024 Virtual Labs. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Landing;
