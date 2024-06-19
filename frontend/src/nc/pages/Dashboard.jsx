import React from "react";
import { API_URL } from "../utils/config";
import { get } from "../utils/requests";
import { useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import Table from "./components/Table";
import "../../index.css";
import "../css/index.css";
import useStore from "../hooks/useStore";
import HelpPane from "./components/HelpPane";
import axios from "axios";

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
    name: ["nodal center"],
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
  {
    name: ["feedback link"],
    endpoint: "getFeedbackLinks",
    postEndpoint: "addFeedbackLink",
    editRole: "Admin",
  },
];

const Dashboard = () => {
  const setUser = useStore((state) => state.setUser);
  const setInstituteList = useStore((state) => state.setInstituteList);
  const setHelp = useStore((state) => state.setHelp);
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState("workshop");
  const [viewHelp, setViewHelp] = useState(false);

  useEffect(() => {
    const T = async () => {
      const user_ = await get(`${API_URL}/api/user`);
      const ilist = await get(`${API_URL}/api/workshop/instituteList`);
      setUser(user_.user);
      setInstituteList(ilist.instituteList);
      // https://raw.githubusercontent.com/virtual-labs/app-outreach-tracker-web/dev/docs/nc-help-doc.md
      const helpContent = await axios.get(
        "https://raw.githubusercontent.com/virtual-labs/app-outreach-tracker-web/main/docs/nc-help-doc.md"
      );

      setHelp(helpContent.data);
    };
    T();
  }, []);

  console.log("****New version****");

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex">
        <NavBar
          setModal={setModal}
          modal={modal}
          setPage={setPage}
          page={page}
          setViewHelp={setViewHelp}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden overflow-auto">
        {viewHelp && <HelpPane setViewHelp={setViewHelp} />}
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
