const { google } = require("googleapis");
const {
  SPREADSHEET_ID,
  SPREADSHEET_USER_TAB_RANGE,
  SPREADSHEET_INSTITUTE_TAB_RANGE,
  SPREADSHEET_WORKSHOP_TAB_RANGE,
  SPREADSHEET_TEMPLATES_TAB_RANGE,
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
    const fuser = {};
    fuser.email = user.values[0].userEnteredValue.stringValue;
    fuser.role = user.values[1].userEnteredValue.stringValue;
    fuser.institute = user.values[2].userEnteredValue.stringValue;

    if (fuser.role === "Admin") {
      admins.push(fuser);
    } else if (fuser.role === "Coordinator") {
      coordinators.push(fuser);
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

const getColumns = (values) => {
  return values.map((col) => {
    if (col.userEnteredValue) {
      const value = col.userEnteredValue.stringValue.trim();
      const lowerValue = value.toLowerCase();
      if (lowerValue.includes("url") || lowerValue.includes("link")) {
        return { value, type: "link" };
      }
      if (lowerValue.includes("date")) {
        return { value, type: "date" };
      }
      if (
        lowerValue.includes("number") ||
        lowerValue.includes("count") ||
        lowerValue.includes("participants") ||
        lowerValue.includes("no.") ||
        lowerValue.includes("record")
      ) {
        return { value, type: "number" };
      }

      if (lowerValue.includes("institute")) {
        return { value, type: "select" };
      }

      return { value, type: "string" };
    }
  });
};

const getRow = (values, columns, rawData) => {
  let rowObj = {};
  columns.forEach((col, index) => {
    if (!values[index]) {
      rowObj[col.value] = "";
      return;
    }

    if (col.type === "link") {
      rowObj[col.value] = getLinkAndName(values[index]).link;
      return;
    }
    if (col.type === "date") {
      rowObj[col.value] = rawData[index];
      return;
    }
    if (col.type === "number") {
      rowObj[col.value] = values[index].userEnteredValue.numberValue;
      return;
    }
    rowObj[col.value] = values[index].userEnteredValue.stringValue;
  });
  return rowObj;
};

const getTableData = (dataList, rawData) => {
  let rows = [];
  let columns = [];

  dataList.forEach((data, i) => {
    if (i === 0) {
      columns = getColumns(data.values);
      return;
    }
    let values = data.values;
    let rowObj = getRow(values, columns, rawData[i]);
    rows.push(rowObj);
  });

  return { rows, columns };
};

const getWorkshopsList = async (role, email) => {
  let { readData: workshopData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_WORKSHOP_TAB_RANGE,
    "RAW"
  );
  const workshopsList = workshopData.data.sheets[0].data[0].rowData;
  let { rows: workshops, columns } = getTableData(workshopsList, rawData);

  if (role.toLowerCase() === "coordinator") {
    workshops = workshops.filter((workshop) => workshop.Email === email);
  }

  return { rows: workshops, columns };
};

const getTemplatesList = async () => {
  let { readData: templatesData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_TEMPLATES_TAB_RANGE,
    "RAW"
  );
  const templatesList = templatesData.data.sheets[0].data[0].rowData;
  return getTableData(templatesList, rawData);
};

module.exports = {
  getUsersList,
  instituteList,
  appendIntoSheet,
  getWorkshopsList,
  getTemplatesList,
};
