import React, { useState } from "react";
import "../../css/tooltip.css"; // Assuming you have defined your tooltip styles in this file
import { capitalizeFirstLetter } from "../../utils/utils";

const PageBox = ({ user, pages, page, setPage }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 767);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isSmallScreen &&
        <div className="page-label flex justify-center items-center p-2 mr-2 rounded">
          {" "}
          <span className="text-xl">
            {capitalizeFirstLetter(page) + "s"}
          </span>{" "}
        </div>
      }
      {!isSmallScreen && showTooltip && (
        <div className="tooltip">
          <div className="flex flex-col">
            {pages.map((p) => {
              if (p.name === "user" && user.role === "Coordinator") return null;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    setPage(p.name);
                    if (p.click) p.click(user);
                  }}
                  className={`menu-button ${page === p.name && "selected"}`}
                >
                  {capitalizeFirstLetter(p.name) + "s"}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isSmallScreen && (
        <div className="flex flex-col">
          {pages.map((p) => {
            if (p.name === "user" && user.role === "Coordinator") return null;
            return (
              <button
                key={p.name}
                onClick={() => {
                  setPage(p.name);
                  if (p.click) p.click(user);
                }}
                className={`menu-button ${page === p.name && "selected"}`}
              >
                {capitalizeFirstLetter(p.name) + "s"}
              </button>
              // <br></br>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default PageBox;
