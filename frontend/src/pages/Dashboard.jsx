import React from "react";
import { API_URL } from "../utils/config";
import { get } from "../utils/requests";
import { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import AddWorkshop from "./components/AddWorkshop";
import WorkshopTable from "./components/WorkshopTable";

// Pass User
const Dashboard = () => {
  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  const [instituteList, setInstituteList] = useState([]);

  useEffect(() => {
    const T = async () => {
      const user = await get(`${API_URL}/api/user`);
      const ilist = await get(`${API_URL}/api/workshop/instituteList`);
      setUser(user.user);
      setInstituteList(ilist.instituteList);
    };
    T();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex">
        <NavBar user={user} setModal={setModal} modal={modal} />
      </div>
      {modal && (
        <AddWorkshop setModal={setModal} instituteList={instituteList} />
      )}
      <div>
        <WorkshopTable />
      </div>
    </div>
  );
};

export default Dashboard;
