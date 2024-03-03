const { instituteList, appendIntoSheet } = require("../utils/sheet");
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

const addWorkshop = async (req, res) => {
  const { date, ins, count, url } = req.body;
  const { user } = req;

  let w_date = getFormattedDate(new Date(date));
  let c_date = getFormattedDate(new Date());

  const row = [
    [ins, user.email, c_date, w_date, count, `=HYPERLINK("${url}", "Link")`],
  ];

  await appendIntoSheet(row, SPREADSHEET_ID, SPREADSHEET_WORKSHOP_TAB_RANGE);

  return res.json({ msg: "Added successfully" });
};
module.exports = { getInstituteList, addWorkshop };
