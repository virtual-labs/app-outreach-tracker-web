import React from "react";
import NavImg from "../../media/download.png";

const NavBar = ({ user, setModal, modal }) => {
  const logout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    localStorage.removeItem("user");
    localStorage.removeItem("credential");
    window.location.reload();
  };
  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper h-14">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Outreach
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
            <span className="text-xl">
              <sup className={`text-sm role ${user.role}`}>{user?.role}</sup>
              <span className="text-gray-100 mx-2">{user?.firstName}</span>
            </span>
            <button
              className="insert-doc-button mr-2"
              onClick={() => setModal(!modal)}
            >
              Add Workshop
            </button>
            <button className="logout-button" onClick={logout}>
              {`Logout`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
