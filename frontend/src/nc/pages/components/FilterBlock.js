import React from "react";
import ReactDatePicker from "react-datepicker";

const SelectStyle =
  "bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg  p-2 m-1";

const FilterBlock = ({ rawColumns, setRows, origRows }) => {
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
    <div className="bg-gray-100 font-bold	 p-1  rounded m-2">
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
  );
};

const DateFilterPane = ({ dateColumns, setRows, origRows }) => {
  const [dateInterval, setDateInterval] = React.useState({
    start: new Date() - 7 * 24 * 60 * 60 * 100000,
    end: new Date(),
  });
  const [dateColumn, setDateColumn] = React.useState(
    dateColumns ? dateColumns[0].value : null
  );

  const applyDateFilter = (start, end) => {
    setRows(
      origRows.filter((row) => {
        let rowDate = new Date(row[dateColumn]);
        return rowDate >= start && rowDate <= end;
      })
    );
  };

  return (
    <>
      {
        <div className="p-2 bg-gray-200 rounded m-1">
          <label>Date</label>
          <div className="flex flex-row">
            <ReactDatePicker
              selected={dateInterval && dateInterval.start}
              onChange={(date) => {
                setDateInterval({ ...dateInterval, start: date });
                applyDateFilter(date, dateInterval.end);
              }}
              className={"w-24 " + SelectStyle}
            />
            <select
              className={"w-28 " + SelectStyle}
              onChange={(e) => {
                setDateColumn(e.target.value);
                applyDateFilter(dateInterval.start, dateInterval.end);
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
            <ReactDatePicker
              selected={dateInterval && dateInterval.end}
              onChange={(date) => {
                setDateInterval({ ...dateInterval, end: date });
                applyDateFilter(dateInterval.start, date);
              }}
              className={"w-24 " + SelectStyle}
            />
          </div>
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
        <div className="p-2 bg-gray-200 rounded m-1">
          <label>Number</label>
          <input
            type="number"
            value={leftVal}
            onChange={(e) =>
              applyNumberFilter(e.target.value, numberColumn, rightVal)
            }
            className={SelectStyle + " w-20"}
          />
          {"<"}
          <select
            onChange={(e) =>
              applyNumberFilter(leftVal, e.target.value, rightVal)
            }
            className={SelectStyle + " w-36"}
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
            className={SelectStyle + " w-20"}
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
        <div className="p-2 bg-gray-200 rounded m-1">
          <label className="text-gray-700 ">String</label>
          <select
            onChange={(e) => applyNumberFilter(e.target.value, str)}
            className={SelectStyle}
          >
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
            className={SelectStyle + " w-30"}
            placeholder="Search"
          />
        </div>
      }
    </>
  );
};

export default FilterBlock;
