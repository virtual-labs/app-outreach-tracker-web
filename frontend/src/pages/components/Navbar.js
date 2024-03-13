import React from "react";
import NavImg from "../../media/download.png";
import { capitalizeFirstLetter } from "../../utils/utils";
import "../../index.css";
import useStore from "../../hooks/useStore";

const PAGES = [
  { name: "workshop", owner: ["workshop", ""], role: "" },
  { name: "template", owner: ["template"], role: "Admin" },
  { name: "institute", owner: ["institute"], role: "Admin" },
  { name: "user", owner: ["user"], role: "Admin" },
];

const ToggleButton = ({ page, setPage, name }) => {
  const capitalizedName = capitalizeFirstLetter(name);

  return (
    <button
      className={`insert-doc-button ${page === name ? "active" : ""}  mr-2`}
      onClick={() => (page === name ? setPage("") : setPage(name))}
    >
      {capitalizedName}
    </button>
  );
};

const getComponent = (component, page, ownerPage, role = "", user) => {
  if (role !== "" && user.role !== role) return null;
  if (ownerPage.includes(page)) return component;
  return null;
};

const NavBar = ({ setModal, modal, setPage, page, hide }) => {
  const user = useStore((state) => state.user);
  const logout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    localStorage.removeItem("user");
    localStorage.removeItem("credential");
    window.location.reload(true);
  };
  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper h-14">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Outreach
          </div>
          {!hide ? (
            <div style={{ float: "right", marginLeft: "auto" }}>
              <span className="text-xl">
                <sup className={`text-sm institute mr-2`}>
                  {user?.institute}
                </sup>
                <sup className={`text-sm role ${user.role}`}>{user?.role}</sup>
                <span className="text-gray-100 mx-2">{user?.firstName}</span>
              </span>
              {PAGES.map((p) => {
                return getComponent(
                  <button
                    key={p.name}
                    className="insert-doc-button mr-2"
                    onClick={() => setModal(!modal)}
                  >
                    Add {capitalizeFirstLetter(p.name)}
                  </button>,
                  page,
                  p.owner,
                  p.role,
                  user
                );
              })}

              {PAGES.map((p) => {
                return (
                  <ToggleButton
                    key={p.name + "x"}
                    page={page}
                    setPage={setPage}
                    name={p.name}
                  />
                );
              })}
              {/* <ToggleButton page={page} setPage={setPage} name="template" /> */}
              <button className="logout-button" onClick={logout}>
                {`Logout`}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NavBar;
