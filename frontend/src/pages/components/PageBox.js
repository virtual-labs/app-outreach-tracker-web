import React, { useState } from "react";
import "../../css/tooltip.css"; // Assuming you have defined your tooltip styles in this file
import { capitalizeFirstLetter } from "../../utils/utils";

const PageBox = ({ user, pages, page, setPage }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="page-label mr-2 rounded">
        {" "}
        <span className="text-xl">
          {capitalizeFirstLetter(page) + "s"}
        </span>{" "}
      </div>
      {showTooltip && (
        <div className="tooltip">
          <div className="flex flex-col">
            {pages.map((p) => {
              return (
                <button
                  key={p.name}
                  onClick={() => setPage(p.name)}
                  className={`menu-button ${page === p.name && "selected"}`}
                >
                  {capitalizeFirstLetter(p.name) + "s"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBox;
