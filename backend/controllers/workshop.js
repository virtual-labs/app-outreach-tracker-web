const {
  instituteList,
  appendIntoSheet,
  getWorkshopsList,
  getTemplatesList,
  getUsers_,
  getInstitutes_,
  deleteFromSheet,
  updateRow,
  getFeedbackLinks,
} = require("../utils/sheet");

const {
  SPREADSHEET_ID,
  SPREADSHEET_WORKSHOP_TAB_RANGE,
  SPREADSHEET_TEMPLATES_TAB_RANGE,
  SPREADSHEET_USER_TAB_RANGE,
  SPREADSHEET_INSTITUTE_TAB_RANGE,
  SPREADSHEET_FEEDBACK_LINK_TAB_RANGE,
} = require("../utils/spreadsheet");

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

const addTemplates = async (req, res) => {
  const rowData = req.body;
  const r = getFormattedRow(rowData);
  const row = [r];
  await appendIntoSheet(row, SPREADSHEET_ID, SPREADSHEET_TEMPLATES_TAB_RANGE);
  return res.json({ msg: "Added successfully" });
};

const addUser = async (req, res) => {
  const rowData = req.body;
  const r = getFormattedRow(rowData);
  const row = [r];
  await appendIntoSheet(row, SPREADSHEET_ID, SPREADSHEET_USER_TAB_RANGE);
  return res.json({ msg: "Added successfully" });
};

const addInstitute = async (req, res) => {
  const rowData = req.body;
  const r = getFormattedRow(rowData);
  const row = [r];
  await appendIntoSheet(row, SPREADSHEET_ID, SPREADSHEET_INSTITUTE_TAB_RANGE);
  return res.json({ msg: "Added successfully" });
};

const getUsers = async (req, res) => {
  const users = await getUsers_();
  return res.json(users);
};

const getInstitutes = async (req, res) => {
  const institutes = await getInstitutes_();
  return res.json(institutes);
};

const deleteEntry = async (req, res) => {
  const { index, table } = req.body;
  const { role, email } = req.user;

  if (role === "Admin") {
    await deleteFromSheet(index, table);
  } else if (role === "Coordinator") {
    if (table === "workshop") {
      const workshops = await getWorkshopsList("admin", req.user.email);
      let counter = 0;
      for (let i = 0; i < workshops.rows.length; i++) {
        if (workshops.rows[i]["Email"] === email) {
          counter++;
        }
        if (counter === index) {
          await deleteFromSheet(i + 1, table);
          break;
        }
      }
    }
  }

  return res.json({ msg: "Deleted successfully" });
};

const editWorkshops = async (req, res) => {
  const { row, index } = req.body;
  const { role, email } = req.user;
  // console.log(data);
  // return res.json({ msg: "Updated successfully" });

  const formattedData = getFormattedRow(row);

  // return res.json({ msg: "Updated successfully" });

  if (role === "Admin") {
    await updateRow(
      SPREADSHEET_ID,
      SPREADSHEET_WORKSHOP_TAB_RANGE,
      formattedData,
      index
    );
  } else if (role === "Coordinator") {
    const workshops = await getWorkshopsList("admin", email);
    let counter = 0;
    for (let i = 0; i < workshops.rows.length; i++) {
      if (workshops.rows[i]["Email"] === email) {
        counter++;
      }
      if (counter === index - 1) {
        console.log("Updating", i + 2);
        await updateRow(
          SPREADSHEET_ID,
          SPREADSHEET_WORKSHOP_TAB_RANGE,
          formattedData,
          i + 2
        );
        break;
      }
    }
  }

  return res.json({ msg: "Updated successfully" });
};

const addFeedbackLink = async (req, res) => {
  const rowData = req.body;
  const r = getFormattedRow(rowData);
  const row = [r];
  await appendIntoSheet(
    row,
    SPREADSHEET_ID,
    SPREADSHEET_FEEDBACK_LINK_TAB_RANGE
  );
  return res.json({ msg: "Added successfully" });
};

const getFeedbackLink = async (req, res) => {
  const fl = await getFeedbackLinks();
  return res.json(fl);
};

module.exports = {
  getInstituteList,
  addWorkshop,
  getWorkshops,
  getTemplates,
  addTemplates,
  addUser,
  addInstitute,
  getUsers,
  getInstitutes,
  deleteEntry,
  editWorkshops,
  getFeedbackLink,
  addFeedbackLink,
};
