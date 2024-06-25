import DataTable from "react-data-table-component";
import React from "react";
import { get, delete_ } from "../../utils/requests";
import { customStyles } from "../../utils/tableStyle";
import { capitalizeFirstLetter } from "../../utils/utils";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import ReactLoading from "react-loading";
import useStore from "../../hooks/useStore";
import EditIcon from "../../media/edit.png";
import Loading from "./Loading";
import SummaryBlock from "./SummaryBlock";
import FilterBlock from "./FilterBlock";
import Dropdowns from "./Dropdowns";

const SORTABLE_TYPES = ["string", "date", "number", "select"];

function Table({
  title,
  endpoint,
  modal,
  setModal,
  postEndpoint,
  editRole,
  deleteEndpoint,
}) {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = React.useState(false);
  const [editObj, setEditObj] = React.useState(null);
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [origRows, setOrigRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [rawColumns, setRawColumns] = React.useState([]);

  const deleteEntry = async (index) => {
    const conf = window.confirm("Are you sure you want to delete this entry?");
    if (!conf) return;

    try {
      setLoading(true);
      const resp = await delete_(`${deleteEndpoint}`, {
        index,
        table: title,
      });
      if (resp.error) throw resp.error;
      alert(resp.msg);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
      R();
    }
  };

  const editEntry = (row) => {
    setEditObj(row);
  };

  const getColWidth = (colName) => {
    if (colName === "") return `${60}px`;
    return colName.length > 8 ? `${150}px` : `${100}px`;
  };

  const R = async () => {
    try {
      setPending(true);
      const resp = await get(endpoint);
      let data = resp.rows;

      let col_ = [{ value: "S. No", type: "number" }, ...resp.columns];

      if (title === "feedback link") {
        col_ = [...resp.columns];
      }

      setRawColumns(col_);

      if (editRole === "" || user.role === editRole) {
        col_ = [{ value: "", action: "delete", type: "button" }, ...col_];
      }

      if (title === "workshop") {
        col_ = [{ value: "", action: "edit", type: "button" }, ...col_];
      }

      data = data.map((workshop, index) => {
        return { ...workshop, "S. No": index + 1 };
      });

      let newColumns = [];
      let typeDict = {};
      for (let key of col_) {
        const colName = key.value;
        const colType = key.type;
        typeDict[colName] = colType;
        const sortable = SORTABLE_TYPES.includes(colType);
        newColumns.push({
          name: capitalizeFirstLetter(colName),
          selector: (row) => row[colName || key.action],
          sortable: sortable,
          wrap: true,
          resizable: true,
          width: getColWidth(colName),
          style: { "white-space": "unset" },
        });
      }

      setColumns(newColumns);

      let rows_ = data.map((row, index) => {
        const newRow = {};
        newRow["edit"] = (
          <button className="edit-button" onClick={() => editEntry(row)}>
            <img
              style={{ width: "75%", height: "75%" }}
              src={EditIcon}
              alt="edit"
            ></img>
          </button>
        );
        for (let key in row) {
          if (typeDict[key] === "link") {
            if (row[key] !== "") {
              newRow[key] = (
                <a
                  href={row[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="table-link"
                >
                  {"Link"}
                </a>
              );
            } else {
              newRow[key] = "";
            }
          } else newRow[key] = row[key];
        }
        newRow["delete"] = (
          <button
            className="delete-button"
            onClick={() => deleteEntry(row["S. No"])}
          >
            &times;
          </button>
        );

        return newRow;
      });
      if (title === "feedback link" && user.role !== "Admin") {
        rows_ = rows_.filter((row) => row["Nodal Center"] === user.institute);
      }

      setOrigRows(rows_);
      setRows(rows_);
    } catch (err) {
      console.log(err);
    } finally {
      setPending(false);
    }
  };

  React.useEffect(() => {
    R();
  }, []);

  const title_ = title === "" ? "Workshop" : title;

  return (
    <>
      {modal && (
        <AddModal
          setModal={setModal}
          table={title_}
          columns_={rawColumns.slice(1)}
          postEndpoint={postEndpoint}
          refreshFunc={R}
        />
      )}

      {loading && <Loading />}

      {editObj && (
        <EditModal
          editObj={editObj}
          setEditObj={setEditObj}
          columns_={rawColumns.slice(1)}
          refreshFunc={R}
        />
      )}
      <span className="text-xl p-2"><strong>{capitalizeFirstLetter(title_) + "s"}</strong></span>
      <div className="flex flex-col md:flex-row p-2">
        <div className="summary-filter flex flex-row p-2">
          <SummaryBlock rows={rows} visible={title === "workshop"} />
          <FilterBlock {...{ rawColumns, setRows, origRows }} />
        </div>
        <div className="md:hidden">
          <div className="flex">
            <Dropdowns {...{ rows, visible: title === 'workshop', rawColumns, setRows, origRows }} />
          </div>
        </div>
      </div>
      <br></br>
      <div className="atable-parent flex flex-col w-full overflow-hidden">
        <DataTable
          columns={columns}
          data={rows}
          progressPending={pending}
          customStyles={customStyles}
          pagination
          progressComponent={
            <ReactLoading type={"bars"} width={40} color={"#28bfa4"} />
          }
        />
      </div>
    </>
  );
}

export default Table;
