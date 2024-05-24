import React, { useState } from "react";
import NavImg from "../../media/download.png";
import { capitalizeFirstLetter } from "../../utils/utils";
import "../../../index.css";
import useStore from "../../hooks/useStore";
import ProfileBox from "./ProfileBox";
import PageBox from "./PageBox";
import HelpIcon from "../../media/help.png";
import NavBarSmall from "./SmallNavBar";

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

const NavBar = ({ setModal, modal, setPage, page, hide, setViewHelp }) => {
  const user = useStore((state) => state.user);
  const logout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    localStorage.removeItem("user");
    localStorage.removeItem("credential");
    window.location.reload(true);
  };

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const handleResize = () => {
    setIsLargeScreen(window.innerWidth > 767);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isLargeScreen ? (
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
                <button
                  key={"help"}
                  className="add-button mr-2"
                  onClick={() => setViewHelp(true)}
                  title={"Help"}
                >
                  <img height={30} width={30} src={HelpIcon} alt="Help" />
                </button>
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
      ) : (
        <NavBarSmall
          setModal={setModal}
          modal={modal}
          setPage={setPage}
          page={page}
          hide={hide}
          setViewHelp={setViewHelp}
        />
      )}
    </>
  );
};

export default NavBar;
