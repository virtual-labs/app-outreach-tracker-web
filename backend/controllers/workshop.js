const {
  instituteList,
  appendIntoSheet,
  getWorkshopsList,
  getTemplatesList,
} = require("../utils/sheet");

const {
  SPREADSHEET_ID,
  SPREADSHEET_WORKSHOP_TAB_RANGE,
} = require("../secrets/spreadsheet");

const getFormattedDate = (currentDate) => {
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
};

const getInstituteList = async (req, res) => {
  const list = await instituteList();
  return res.json({ instituteList: list });
};

const getFormattedRow = (rowData) => {
  return rowData.map((entry) => {
    if (entry.type === "date") {
      return getFormattedDate(new Date(entry.value));
    }
    if (entry.type === "link") {
      return `=HYPERLINK("${entry.value}", "Link")`;
    }
    return entry.value;
  });
};

const addWorkshop = async (req, res) => {
  const rowData = req.body;
  const r = getFormattedRow(rowData);
  const row = [r];
  await appendIntoSheet(row, SPREADSHEET_ID, SPREADSHEET_WORKSHOP_TAB_RANGE);

  return res.json({ msg: "Added successfully" });
};

const getWorkshops = async (req, res) => {
  const role = req.user.role;
  const email = req.user.email;
  const data = await getWorkshopsList(role, email);
  return res.json(data);
};

const getTemplates = async (req, res) => {
  const templates = await getTemplatesList();
  return res.json(templates);
};

module.exports = { getInstituteList, addWorkshop, getWorkshops, getTemplates };
