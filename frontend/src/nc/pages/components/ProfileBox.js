import React, { useState } from "react";
import "../../css/tooltip.css"; // Assuming you have defined your tooltip styles in this file
import { capitalizeFirstLetter } from "../../utils/utils";

const ProfileBox = ({ user, onLogout }) => {
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
      <div className="profile-icon">
        {" "}
        <span className="text-2xl">
          {user?.firstName && capitalizeFirstLetter(user?.firstName[0])}
        </span>{" "}
      </div>
      {showTooltip && (
        <div className="tooltip-profile">
          <div className="user-info ">
            <div className="flex flex-col position-absolute bg-gray-200 text-xl w-full p-1 rounded m-1">
              <span className="px-1">
                <span className={`role mr-2`}>{user?.role}</span>
                <span className={`institute mr-2`}>{user?.institute}</span>
              </span>

              <span style={{ float: "right" }} className="text-gray-700 mx-2">
                {user?.firstName + " " + user?.lastName}
              </span>
            </div>
            <button className="float-end" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBox;
