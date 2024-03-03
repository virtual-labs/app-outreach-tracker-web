const { google } = require("googleapis");
const {
  SPREADSHEET_ID,
  SPREADSHEET_USER_TAB_RANGE,
  SPREADSHEET_INSTITUTE_TAB_RANGE,
} = require("../secrets/spreadsheet");

const getDataFromSheet = async (spreadsheetId, range, req = null) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./secrets/service-account-secret.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const readData = await googleSheetsInstance.spreadsheets.get({
      auth,
      spreadsheetId,
      ranges: range,
      fields: "sheets(data(rowData(values(hyperlink,userEnteredValue))))",
    });
    if (req === "RAW") {
      const rawData = await googleSheetsInstance.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
        dateTimeRenderOption: "FORMATTED_STRING",
      });
      return { readData, rawData: rawData.data.values };
    }

    return readData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getUsersList = async () => {
  const usersData = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_USER_TAB_RANGE
  );
  const usersList = usersData.data.sheets[0].data[0].rowData;

  const admins = [];
  const coordinators = [];

  usersList.forEach((user, i) => {
    if (i === 0) return;
    for (let j = 0; j < user.values.length; j++) {
      if (user.values[j].userEnteredValue) {
        if (j === 0) {
          admins.push(user.values[j].userEnteredValue.stringValue);
        } else if (j === 1) {
          coordinators.push(user.values[j].userEnteredValue.stringValue);
        }
      }
    }
  });
  return { admins, coordinators };
};

const instituteList = async () => {
  const usersData = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_INSTITUTE_TAB_RANGE
  );
  const instituteList = usersData.data.sheets[0].data[0].rowData;
  const list = [];

  instituteList.forEach((ins, i) => {
    if (i === 0) return;
    if (ins) list.push(ins.values[0].userEnteredValue.stringValue);
  });
  return list;
};

const appendIntoSheet = async (row, spreadsheetId, range) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./secrets/service-account-secret.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const resource = {
      majorDimension: "ROWS",
      values: row,
    };
    const result = await googleSheetsInstance.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: resource,
    });
    return result.data.updates.updatedCells;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = { getUsersList, instituteList, appendIntoSheet };
