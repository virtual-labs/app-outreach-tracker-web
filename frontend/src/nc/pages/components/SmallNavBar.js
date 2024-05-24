import React from "react";
import NavImg from "../../media/download.png";
import "../../../index.css";
import useStore from "../../hooks/useStore";
import ProfileBox from "./ProfileBox";
import Hamburger from "./Hamburger";

const PAGES = [
  { name: "workshop", owner: ["workshop", ""], role: "" },
  { name: "template", owner: ["template"], role: "Admin" },
  { name: "nodal center", owner: ["nodel center"], role: "Admin" },
  { name: "user", owner: ["user"], role: "Admin" },
  {
    name: "feedback link",
    owner: ["feedback link"],
    role: "Admin",
    click: (user) => {
      // if (user.feedback_link) window.open(user.feedback_link, "_blank");
    },
  },
];

const getComponent = (component, page, ownerPage, role = "", user) => {
  if (role !== "" && user.role !== role) return null;

  if (ownerPage.includes(page)) return component;
  return null;
};

const NavBarSmall = ({ setModal, modal, setPage, page, hide, setViewHelp }) => {
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
      <div className="navbar-no-shadow-container justify-between w-nav">
        <div className="navbar-wrapper h-14">
          {!hide ? (
            <div className="hamburger-container">
              <Hamburger
                user={user}
                logout={logout}
                setModal={setModal}
                modal={modal}
                setPage={setPage}
                page={page}
                PAGES={PAGES}
                setViewHelp={setViewHelp}
              />
            </div>
          ) : null}
          <div af-el="nav-title" className="text-block flex-grow text-center">
            <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" style={{ display: 'block', margin: '0 auto' }} />
            <strong>Workshop Tracker</strong>
          </div>
          {!hide ? (
            <ProfileBox user={user} onLogout={logout} />
          ) : null}
        </div>
      </div>
      <div className="bottom-right hidden">
        {PAGES.map((p) => {
          return getComponent(
            <button
              key={p.name}
              className="add-button mr-2"
              onClick={() => setModal(!modal)}
              title={"Add " + page}
            >
              +
            </button>,
            page,
            p.owner,
            p.role,
            user
          );
        })}
      </div>
    </>
  );
};

export default NavBarSmall;
