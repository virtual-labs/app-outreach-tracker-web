import DataTable from "react-data-table-component";
import React from "react";
import axios from "axios";
import { API_URL } from "../../utils/config";
import { get } from "../../utils/requests";

const customStyles = {
  headRow: {
    style: {
      border: "none",
      backgroundColor: "#F5F5F5",
    },
  },
  headCells: {
    style: {
      color: "#202124",
      fontSize: "16px",
      whiteSpace: "unset",
      textOverflow: "unset",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "rgb(230, 244, 244)",
      borderBottomColor: "#FFFFFF",
      borderRadius: "25px",
      outline: "1px solid #FFFFFF",
      whiteSpace: "unset",
      textOverflow: "unset",
    },
  },
  pagination: {
    style: {
      border: "none",
    },
  },
};

function capitalizeFirstLetter(str) {
  str = str.split("-").join(" ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function WorkshopTable() {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [title, setTitle] = React.useState("Workshops");

  React.useEffect(() => {
    const R = async () => {
      try {
        const resp = await get(`${API_URL}/api/workshop/getWorkshops`);
        const data = resp.workshops;
        console.log(data);
        let newColumns = [];
        for (let key in data[0]) {
          newColumns.push({
            name: capitalizeFirstLetter(key),
            selector: (row) => row[key],
            sortable: false,
            wrap: true,
            resizable: true,
          });
        }
        setColumns(newColumns);

        setRows(
          data.map((row) => ({
            ...row,
            "Link To workshop PDF": (
              <a
                href={row["Link To workshop PDF"]}
                target="_blank"
                rel="noopener noreferrer"
                className="table-link"
              >
                {"Link to PDF"}
              </a>
            ),
          }))
        );
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    };
    R();
  }, []);
  console.log("hi");
  return (
    <>
      <span className="text-xl p-2">{title}</span>
      <DataTable
        columns={columns}
        data={rows}
        progressPending={pending}
        customStyles={customStyles}
        pagination
      />
    </>
  );
}

export default WorkshopTable;
