import React from "react";
import { useState } from "react";
import { API_URL, validateURL } from "../../utils/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import { post } from "../../utils/requests";

const AddWorkshop = ({ setModal, instituteList }) => {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [ins, setIns] = useState(instituteList[0]);
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    const newErrors = {};

    // Validate URL
    if (validateURL(url)) {
      newErrors.url = "URL is required";
    }

    // Validate Count
    if (!count && count < 0) {
      newErrors.name = "Count is required";
    }

    // Validate Date
    if (!date) {
      newErrors.date = "Date is required";
    }

    // Return true if there are no errors, else false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = await validateForm();
    if (v) {
      setUrl("");
      setCount(0);
      setDate(new Date());
      const body = {
        date,
        ins,
        count,
        url,
      };
      setLoading(true);
      const resp = await post(`${API_URL}/api/workshop/addWorkshop`, body);
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
            Workshop Information
          </h2>
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setModal(false)}
          >
            &times;
          </span>
        </div>
        <form className="flex flex-col mb-4" onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">Institute Name</label>
            <select
              className="search-query w-input"
              name="filter"
              onChange={(e) => setIns(e.target.value)}
            >
              {instituteList.map((column, index) => {
                return (
                  <option key={index} value={column} selected={ins === column}>
                    {column}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">Workshop Date</label>
            <DatePicker
              className="search-query w-input"
              selected={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </div>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">
              Participation Count
            </label>
            <input
              type="number"
              id="name"
              name="name"
              className="search-query w-input"
              placeholder="Enter Count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">
              Workshop PDF Drive Link
            </label>
            <input
              type="text"
              id="url"
              name="url"
              className="search-query w-input"
              placeholder="Enter Drive Link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

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

export default AddWorkshop;
