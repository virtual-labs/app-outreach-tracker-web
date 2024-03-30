import React from "react";
import { API_URL } from "../utils/config";
import { get } from "../utils/requests";
import { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import Table from "./components/Table";
import "../index.css";
import useStore from "../hooks/useStore";

const TABLES = [
  {
    name: ["workshop", ""],
    endpoint: "getWorkshops",
    postEndpoint: "addWorkshop",
    editRole: "",
  },
  {
    name: ["template"],
    endpoint: "getTemplates",
    postEndpoint: "addTemplates",
    editRole: "Admin",
  },
  {
    name: ["institute"],
    endpoint: "getInstitutes",
    postEndpoint: "addInstitute",
    editRole: "Admin",
  },
  {
    name: ["user"],
    endpoint: "getUsers",
    postEndpoint: "addUser",
    editRole: "Admin",
  },
];

const Dashboard = () => {
  const setUser = useStore((state) => state.setUser);
  const setInstituteList = useStore((state) => state.setInstituteList);
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState("workshop");

  useEffect(() => {
    const T = async () => {
      const user_ = await get(`${API_URL}/api/user`);
      const ilist = await get(`${API_URL}/api/workshop/instituteList`);
      setUser(user_.user);
      setInstituteList(ilist.instituteList);
    };
    T();
  }, []);
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex">
        <NavBar
          setModal={setModal}
          modal={modal}
          setPage={setPage}
          page={page}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {TABLES.map((table) => {
          if (table.name.includes(page)) {
            return (
              <Table
                key={page}
                endpoint={`${API_URL}/api/workshop/${table.endpoint}`}
                postEndpoint={`${API_URL}/api/workshop/${table.postEndpoint}`}
                deleteEndpoint={`${API_URL}/api/workshop/`}
                title={page}
                modal={modal}
                setModal={setModal}
                editRole={table.editRole}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Dashboard;
