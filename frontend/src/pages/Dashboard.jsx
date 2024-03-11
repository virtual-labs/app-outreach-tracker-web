import React from "react";
import { API_URL } from "../utils/config";
import { get } from "../utils/requests";
import { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import Table from "./components/Table";
import "../index.css";

// Pass User
const Dashboard = () => {
  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  const [instituteList, setInstituteList] = useState([]);
  const [page, setPage] = useState("workshop");

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
        <NavBar
          user={user}
          setModal={setModal}
          modal={modal}
          setPage={setPage}
          page={page}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {page === "workshop" || page === "" ? (
          <Table
            endpoint={`${API_URL}/api/workshop/getWorkshops`}
            postEndpoint={`${API_URL}/api/workshop/addWorkshop`}
            title={page}
            modal={modal}
            setModal={setModal}
            instituteList={instituteList}
          />
        ) : null}

        {page === "template" ? (
          <Table
            endpoint={`${API_URL}/api/workshop/getTemplates`}
            postEndpoint={`${API_URL}/api/workshop/addTemplate`}
            title={page}
            modal={modal}
            setModal={setModal}
            instituteList={instituteList}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
