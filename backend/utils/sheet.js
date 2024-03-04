const { google } = require("googleapis");
const {
  SPREADSHEET_ID,
  SPREADSHEET_USER_TAB_RANGE,
  SPREADSHEET_INSTITUTE_TAB_RANGE,
  SPREADSHEET_WORKSHOP_TAB_RANGE,
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

const getLinkAndName = (obj) => {
  let link = "";
  let name = "";
  if (!obj.userEnteredValue) return { link, name };
  if (obj.userEnteredValue.stringValue) {
    name = obj.userEnteredValue.stringValue.trim();
  }
  if (obj.userEnteredValue.formulaValue) {
    name = obj.userEnteredValue.formulaValue.trim();
    name = name.split('"');
    name = name[name.length - 2];
  }
  if (obj.userEnteredValue.numberValue) {
    return {
      link,
      number: obj.userEnteredValue.numberValue,
    };
  }
  if (obj.hyperlink) {
    link = obj.hyperlink;
  }
  return { link, name };
};

const getWorkshopsList = async (role, email) => {
  let { readData: workshopData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_WORKSHOP_TAB_RANGE,
    "RAW"
  );
  const workshopsList = workshopData.data.sheets[0].data[0].rowData;

  let workshops = [];

  workshopsList.forEach((workshop, i) => {
    if (i === 0) return;
    let values = workshop.values;
    let instituteName = values[0].userEnteredValue.stringValue.trim();
    let email = values[1].userEnteredValue.stringValue.trim();
    let createDate = rawData[i][2];
    let workshopDate = rawData[i][3];
    let count = values[4].userEnteredValue.numberValue;
    let { link: workshopLink, name: _ } = getLinkAndName(values[5]);

    workshops.push({
      "S. No.": i,
      "Institute Name": instituteName,
      Email: email,
      "Entry Date": createDate,
      "Workshop date": workshopDate,
      Participants: count,
      "Link To workshop PDF": workshopLink,
    });
  });

  if (role === "coordinator") {
    workshops = workshops.filter((workshop) => workshop.Email === email);
  }

  return workshops;
};

module.exports = {
  getUsersList,
  instituteList,
  appendIntoSheet,
  getWorkshopsList,
};
