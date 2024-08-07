const { google } = require("googleapis");
const {
  SPREADSHEET_ID,
  SPREADSHEET_USER_TAB_RANGE,
  SPREADSHEET_INSTITUTE_TAB_RANGE,
  SPREADSHEET_WORKSHOP_TAB_RANGE,
  SPREADSHEET_TEMPLATES_TAB_RANGE,
  SERVICE_ACCOUNT_SECRET_FILE,
  SPREADSHEET_FEEDBACK_LINK_TAB_RANGE,
} = require("./spreadsheet");

const tableSheetMap = {
  workshop: SPREADSHEET_WORKSHOP_TAB_RANGE,
  template: SPREADSHEET_TEMPLATES_TAB_RANGE,
  user: SPREADSHEET_USER_TAB_RANGE,
  institute: SPREADSHEET_INSTITUTE_TAB_RANGE,
  "feedback link": SPREADSHEET_FEEDBACK_LINK_TAB_RANGE,
};

const getDataFromSheet = async (spreadsheetId, range, req = null) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_SECRET_FILE,
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

  // console.log(usersList);

  usersList.forEach((user, i) => {
    if (i === 0) return;
    const fuser = {};
    // console.log(user.values[0]);
    // console.log(user.values[1]);
    // console.log(user.values[2]);
    fuser.email = user.values[0].userEnteredValue.stringValue;
    fuser.role = user.values[1].userEnteredValue.stringValue;
    fuser.institute = user.values[2].userEnteredValue.stringValue;

    if (fuser.role === "Admin") {
      admins.push(fuser);
    } else if (fuser.role === "Coordinator") {
      coordinators.push(fuser);
    }
  });
  // console.log(admins);
  // console.log(coordinators);
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
      keyFile: SERVICE_ACCOUNT_SECRET_FILE,
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

      if (
        lowerValue.includes("institute") ||
        lowerValue.includes("nodal center")
      ) {
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
      rowObj[col.value] = values[index]?.userEnteredValue?.numberValue;
      return;
    }
    rowObj[col.value] =
      values[index]?.userEnteredValue?.stringValue || rawData[index];
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

const getUsers_ = async () => {
  let { readData: usersData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_USER_TAB_RANGE,
    "RAW"
  );
  const usersList = usersData.data.sheets[0].data[0].rowData;
  return getTableData(usersList, rawData);
};

const getInstitutes_ = async () => {
  let { readData: institutesData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_INSTITUTE_TAB_RANGE,
    "RAW"
  );
  const institutesList = institutesData.data.sheets[0].data[0].rowData;
  return getTableData(institutesList, rawData);
};

const sendmail = require("../mail");
const fs = require("fs").promises;

const deleteFromSheet = async (rowIndex, table) => {
  try {
    const result = await getUsers_();
    const email = result.rows[rowIndex - 1]["User Email"];

    const sendMailPromise = sendMail(email);
    const deleteRowPromise = deleteRow(rowIndex, table);

    await Promise.all([sendMailPromise, deleteRowPromise]);
  } catch (error) {
    console.error(error);
  }
};

const sendMail = async (email) => {
  try {
    const path = require("path");
    const jsonString = await fs.readFile(
      path.join(__dirname, "..", "template_mail.json"),
      "utf8"
    );
    const data = JSON.parse(jsonString);
    await sendmail(email, data.emails.access_revoke);
  } catch (err) {
    console.error("Error reading or parsing file:", err);
  }
};

const deleteRow = async (rowIndex, table) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_SECRET_FILE,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });

    const spreadsheet = await googleSheetsInstance.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheets = spreadsheet.data.sheets;
    const sheet = sheets.find(
      (s) => s.properties.title === tableSheetMap[table]
    );
    const sheetId = sheet.properties.sheetId;

    const result = await googleSheetsInstance.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const updateRow = async (spreadsheetId, sheetName, data, rowIndex) => {
  const sheetsAuth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_SECRET_FILE,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const authClient = await sheetsAuth.getClient();
  try {
    const rows = [data];

    await google.sheets("v4").spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        values: rows,
      },
    });
  } catch (error) {
    console.error("Error updating row:", error);
    throw error;
  }
};

const getFeedbackLinks = async () => {
  let { readData: usersData, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_FEEDBACK_LINK_TAB_RANGE,
    "RAW"
  );
  const linkList = usersData.data.sheets[0].data[0].rowData;
  // console.log(JSON.stringify(linkList, null, 2));
  return getTableData(linkList, rawData);
};

const getFeedbackLink = async (institute) => {
  const { rows } = await getFeedbackLinks();
  const link = rows.find((row) => row["Nodal Center"] === institute);
  return link ? link["Feedback Link"] : "";
};

module.exports = {
  getUsersList,
  instituteList,
  appendIntoSheet,
  getWorkshopsList,
  getTemplatesList,
  getUsers_,
  getInstitutes_,
  deleteFromSheet,
  updateRow,
  getFeedbackLinks,
  getFeedbackLink,
};
