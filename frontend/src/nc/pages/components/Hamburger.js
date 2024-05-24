import React, { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";

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

const Hamburger = ({ setModal, modal, setPage, page, setViewHelp, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button className="hamburger-button" onClick={toggleMenu}>
                <div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </div>
            </button>
            {isMenuOpen && (
                <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
                    <HamburgerMenu
                        user={user}
                        onLogout={onLogout}
                        PAGES={PAGES}
                        page={page}
                        setPage={setPage}
                        setViewHelp={setViewHelp}
                        toggleMenu={toggleMenu}
                    />
                </div >
            )}
        </>
    );
};

export default Hamburger;