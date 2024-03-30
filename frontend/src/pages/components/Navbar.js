import React from "react";
import NavImg from "../../media/download.png";
import { capitalizeFirstLetter } from "../../utils/utils";
import "../../index.css";
import useStore from "../../hooks/useStore";
import ProfileBox from "./ProfileBox";
import PageBox from "./PageBox";

const PAGES = [
  { name: "workshop", owner: ["workshop", ""], role: "" },
  { name: "template", owner: ["template"], role: "Admin" },
  { name: "institute", owner: ["institute"], role: "Admin" },
  { name: "user", owner: ["user"], role: "Admin" },
];

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
            Workshop Reporting Tool
          </div>
          {!hide ? (
            <div
              style={{ float: "right", marginLeft: "auto" }}
              className="flex flex-1 flex-row justify-end"
            >
              {PAGES.map((p) => {
                return getComponent(
                  <button
                    key={p.name}
                    className="add-button mr-2"
                    onClick={() => setModal(!modal)}
                  >
                    +
                  </button>,
                  page,
                  p.owner,
                  p.role,
                  user
                );
              })}

              <PageBox
                user={user}
                onLogout={logout}
                pages={PAGES}
                page={page}
                setPage={setPage}
              />
              <ProfileBox user={user} onLogout={logout} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NavBar;
