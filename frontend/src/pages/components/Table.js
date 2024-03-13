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
      const resp = await delete_(`${deleteEndpoint}`, {
        index,
        table: title,
      });
      if (resp.error) throw resp.error;
      alert(resp.msg);
    } catch (err) {
      alert(err);
    } finally {
      R();
    }
  };

  const editEntry = (row) => {
    setEditObj(row);
  };

  const R = async () => {
    try {
      setPending(true);
      const resp = await get(endpoint);
      let data = resp.rows;

      let col_ = [{ value: "S. No", type: "number" }, ...resp.columns];

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
        const sortable = ["string", "date", "number", "select"].includes(
          colType
        );
        newColumns.push({
          name: capitalizeFirstLetter(colName),
          selector: (row) => row[colName || key.action],
          sortable: sortable,
          wrap: true,
          resizable: true,
          width: colName.length ? `${200}px` : `${60}px`,
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

  const dateColumns = rawColumns.filter((col) => col.type === "date");
  const numberColumns = rawColumns.filter((col) => col.type === "number");
  const stringColumns = rawColumns.filter(
    (col) =>
      col.type !== "date" &&
      col.type !== "number" &&
      col.type !== "link" &&
      col.value !== ""
  );

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

      {editObj && (
        <EditModal
          editObj={editObj}
          setEditObj={setEditObj}
          columns_={rawColumns.slice(1)}
          refreshFunc={R}
        />
      )}
      <span className="text-xl p-2">{capitalizeFirstLetter(title_) + "s"}</span>
      {title === "workshop" && <TotalBlock rows={rows} />}
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
        <div className=" m-2">
          <label>Filters</label>
          <div className="flex flex-row">
            {dateColumns.length > 0 && (
              <DateFilterPane
                dateColumns={dateColumns}
                setRows={setRows}
                origRows={origRows}
              />
            )}
            {numberColumns.length > 0 && (
              <NumberFilterPane
                numberColumns={numberColumns}
                setRows={setRows}
                origRows={origRows}
              />
            )}
            {stringColumns.length > 0 && (
              <StringFilterPane
                stringColumns={stringColumns}
                setRows={setRows}
                origRows={origRows}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const TotalBlock = ({ rows }) => {
  const total_p = rows.reduce((acc, row) => {
    return acc + row["Participants"];
  }, 0);

  const total = rows.length;

  const total_r = rows.reduce((acc, row) => {
    return acc + row["Usage Recorded"];
  }, 0);

  return (
    <div className="flex flex-row justify-start p-2">
      <div className="flex flex-col mx-2">
        <span>Total Participants</span>
        <span>{total_p}</span>
      </div>
      <div className="flex flex-col mx-2">
        <span>Total Recorded</span>
        <span>{total_r}</span>
      </div>
      <div className="flex flex-col mx-2">
        <span>Total Workshops</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

const DateFilterPane = ({ dateColumns, setRows, origRows }) => {
  const dateFilters = [
    "last 7 days",
    "last 30 days",
    "last 90 days",
    "last year",
    "all",
  ];
  const [dateFilter, setDateFilter] = React.useState("all");
  const [dateColumn, setDateColumn] = React.useState(
    dateColumns[0] ? dateColumns[0].value : null
  );

  const applyDateFilter = (dateFilter_, dateColumn_) => {
    if (dateFilter_ === "all") {
      setRows(origRows);
      return;
    }
    let date = new Date();
    if (dateFilter_ === "last 7 days") date.setDate(date.getDate() - 7);
    if (dateFilter_ === "last 30 days") date.setDate(date.getDate() - 30);
    if (dateFilter_ === "last 90 days") date.setDate(date.getDate() - 90);
    if (dateFilter_ === "last year") date.setFullYear(date.getFullYear() - 1);
    setRows(
      origRows.filter((row) => {
        let rowDate = new Date(row[dateColumn_]);
        return rowDate >= date;
      })
    );
  };

  return (
    <>
      {
        <div className="p-2">
          <label>Date</label>
          <select
            onChange={(e) => {
              setDateColumn(e.target.value);
              applyDateFilter(dateFilter, e.target.value);
            }}
          >
            {dateColumns.map((col, index) => {
              return (
                <option
                  key={index}
                  value={col.value}
                  selected={dateColumn === col.value}
                >
                  {col.value}
                </option>
              );
            })}
          </select>
          <select
            onChange={(e) => {
              setDateFilter(e.target.value);
              applyDateFilter(e.target.value, dateColumn);
            }}
          >
            {dateFilters.map((filter, index) => {
              return (
                <option
                  key={index}
                  value={filter}
                  selected={filter === dateFilter}
                >
                  {filter}
                </option>
              );
            })}
          </select>
        </div>
      }
    </>
  );
};

const NumberFilterPane = ({ numberColumns, setRows, origRows }) => {
  const [leftVal, setLeftVal] = React.useState(0);
  const [rightVal, setRightVal] = React.useState(1000);
  const [numberColumn, setNumberColumn] = React.useState(
    numberColumns[0] ? numberColumns[0].value : null
  );

  const applyNumberFilter = (leftVal_, numberColumn_, rightVal_) => {
    setRows(
      origRows.filter((row) => {
        return (
          row[numberColumn_] >= leftVal_ && row[numberColumn_] <= rightVal_
        );
      })
    );
    setLeftVal(leftVal_);
    setRightVal(rightVal_);
    setNumberColumn(numberColumn_);
  };

  return (
    <>
      {
        <div className="p-2">
          <label>Number</label>
          <input
            type="number"
            value={leftVal}
            onChange={(e) =>
              applyNumberFilter(e.target.value, numberColumn, rightVal)
            }
            className="mr-2 w-20"
          />
          {"<"}
          <select
            onChange={(e) =>
              applyNumberFilter(leftVal, e.target.value, rightVal)
            }
            className="mx-2"
          >
            {numberColumns.map((col, index) => {
              return (
                <option
                  key={index}
                  value={col.value}
                  selected={numberColumn === col.value}
                >
                  {col.value}
                </option>
              );
            })}
          </select>
          {"<"}
          <input
            type="number"
            value={rightVal}
            onChange={(e) =>
              applyNumberFilter(leftVal, numberColumn, e.target.value)
            }
            className="ml-2 w-20"
          />
        </div>
      }
    </>
  );
};

const StringFilterPane = ({ stringColumns, setRows, origRows }) => {
  const [str, setStr] = React.useState("");
  const [stringColumn, setStringColumn] = React.useState(
    stringColumns[0] ? stringColumns[0].value : null
  );

  const applyNumberFilter = (stringColumn_, val) => {
    if (!stringColumn_) {
      setRows(origRows);
      return;
    }
    const lowerVal = val.toLowerCase();
    setRows(
      origRows.filter((row) => {
        return row[stringColumn_].toLowerCase().includes(lowerVal);
      })
    );
    setStr(val);
    setStringColumn(stringColumn_);
  };

  return (
    <>
      {
        <div className="p-2">
          <label>String</label>
          <select onChange={(e) => applyNumberFilter(e.target.value, str)}>
            {stringColumns.map((col, index) => {
              return (
                <option
                  key={index}
                  value={col.value}
                  selected={stringColumn === col.value}
                >
                  {col.value}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            value={str}
            onChange={(e) => applyNumberFilter(stringColumn, e.target.value)}
            className="ml-2"
            placeholder="Search"
          />
        </div>
      }
    </>
  );
};

export default Table;
