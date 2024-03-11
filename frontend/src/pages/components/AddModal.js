import { useState } from "react";
import { validateURL } from "../../utils/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import { post } from "../../utils/requests";
import "../../css/App.css";
import { capitalizeFirstLetter } from "../../utils/utils";

const AddModal = ({
  setModal,
  instituteList,
  table,
  columns_,
  postEndpoint,
}) => {
  let columns = columns_.map((col) => {
    if (table === "workshop") {
      if (col.value === "Date") {
        col.disable = true;
      }
      if (col.value === "Email") {
        col.disable = true;
      }
    }
    return col;
  });
  console.log(columns);
  const getFormState = () => {
    const obj = {};
    for (let col of columns) {
      const inst = JSON.parse(localStorage.getItem("user"))?.institute;
      const email = JSON.parse(localStorage.getItem("user"))?.email;
      if (col.type === "date") obj[col.value] = new Date();
      else if (col.type === "number") obj[col.value] = 0;
      else if (col.type === "select") obj[col.value] = inst || instituteList[0];
      else if (col.value === "Email") obj[col.value] = email;
      else obj[col.value] = "";
    }
    return obj;
  };

  const form = getFormState(columns);

  const [formState, setFormState] = useState(form);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    for (let column of columns) {
      if (column.type === "link") {
        if (validateURL(formState[column.value])) {
          newErrors[column.value] = "Invalid URL";
        }
      }
      if (column.type === "number") {
        if (formState[column.value] < 0) {
          newErrors[column.value] = "Invalid Number";
        }
      }
      if (column.type === "date") {
        if (formState[column.value] === "") {
          newErrors[column.value] = "Invalid Date";
        }
      }
      if (column.type === "select") {
        if (!instituteList.includes(formState[column.value])) {
          newErrors[column.value] = "Invalid Institute";
        }
      }
      if (formState[column.value] === "") {
        newErrors[column.value] = "Invalid Input";
      }
    }
    console.log(newErrors);
    // Return true if there are no errors, else false
    return Object.keys(newErrors).length === 0;
  };

  const updateFormState = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const getInput = (column) => {
    if (column.type === "date") {
      return (
        <DatePicker
          className="search-query w-input"
          selected={formState[column.value]}
          onChange={(newDate) => updateFormState(column.value, newDate)}
          disabled={column.disable}
        />
      );
    }
    if (column.type === "number") {
      return (
        <input
          type="number"
          id={column.value}
          name="name"
          className="search-query w-input"
          placeholder="Enter Count"
          value={formState[column.value]}
          disabled={column.disable}
          onChange={(e) => updateFormState(column.value, e.target.value)}
        />
      );
    }
    if (column.type === "select") {
      return (
        <select
          className="search-query w-input"
          name="filter"
          onChange={(e) => updateFormState(column.value, e.target.value)}
          disabled={column.disable}
        >
          {instituteList.map((ins, index) => {
            return (
              <option
                key={index}
                value={ins}
                selected={formState[column.value] === ins}
              >
                {ins}
              </option>
            );
          })}
        </select>
      );
    }
    return (
      <input
        type="text"
        id={column.value}
        name="name"
        className="search-query w-input"
        placeholder={`Enter ${column.value}`}
        value={formState[column.value]}
        disabled={column.disable}
        onChange={(e) => updateFormState(column.value, e.target.value)}
      />
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const valid = validateForm();
    if (valid) {
      setLoading(true);

      const body = columns.map((col) => {
        return { value: formState[col.value], type: col.type };
      });
      const resp = await post(postEndpoint, body);
      setLoading(false);
      setModal(false);
      if (resp.error) {
        alert(resp.error);
      } else alert("Workshop added successfully");
    } else {
      alert("Validation error");
    }
  };

  return (
    <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full flex items-center justify-center z-1150">
      <div className="flex flex-col bg-gray-200 h-auto w-3/5 add-lab-container p-2">
        <div className="flex flex-row">
          <h2 className="flex-1 text-2xl text-gray-600 mt-0">
            {`${capitalizeFirstLetter(table)} Information`}
          </h2>
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setModal(false)}
          >
            &times;
          </span>
        </div>
        <form className="flex flex-col mb-4" onSubmit={handleSubmit}>
          {columns.map((column, index) => {
            return (
              <div className="flex flex-row">
                <label className="flex items-center w-1/2">
                  {capitalizeFirstLetter(column.value)}
                </label>
                {getInput(column)}
              </div>
            );
          })}

          <div className="flex flex-row h-10">
            <button type="submit" className="submit-button w-button w-32">
              Submit
            </button>
            <div className="flex items-center justify-center">
              {loading && (
                <ReactLoading
                  type="bars"
                  color="#28bfa4"
                  width={40}
                  className="flex"
                ></ReactLoading>
              )}
            </div>
          </div>
        </form>
        <div className="flex flex-row"></div>
      </div>
    </div>
  );
};

export default AddModal;
