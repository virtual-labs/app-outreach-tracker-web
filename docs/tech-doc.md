# Outreach Tool Technical Documentation

## Table of Contents

- [Outreach Tool Technical Documentation](#outreach-tool-technical-documentation)
  - [Table of Contents](#table-of-contents)
  - [Frontend](#frontend)
  - [Backend](#backend)
    - [Authentication](#authentication)
    - [Data Source](#data-source)
  - [Templates for mails](#templates-for-mails)
  - [Email Account Setup for App Email Functionality](#email-account-setup-for-app-email-functionality)
  - [Development Environment Setup](#development-environment-setup)
  - [Google Sheets Setup](#google-sheets-setup)
  - [Deployment](#deployment)
  - [Future Works](#future-works)

## Frontend

`/frontend`

The frontend of the Outreach tool is developed using the Create React App framework. All dependencies and libraries are listed in the `package.json` file. Developers can use npm or yarn to manage dependencies and run scripts for building and running the frontend.

## Backend

`/backend`

The backend of the Outreach tool is built with Express.js framework. It serves as a server to handle API requests and interact with the Google Sheets API to retrieve data. Developers can find the server-side code in the `backend` directory.

### Authentication

The Outreach tool utilizes Google OAuth authentication for user authentication. Roles specified in the Google Sheets' Users tab are used for authorization.

### Data Source

Google Sheets is used as the data source for the Outreach tool. Developers need to provide editor access to the Google service account specified in `backend/secrets/service-account-secret.json`. This service account is used to read data from the Google Sheet.

## Templates for mails

The mailing functionality utilizes the template_mail.json file located in the backend folder. This file includes contexts for adding and removing a user. To accommodate additional contexts, update this file accordingly.

The `template_mail.json` file includes various email contexts. Each context consists of a subject, body, and HTML content. If the HTML content is a null string, the body text will be used instead. When both body and HTML content are present, only the HTML content will be utilized.

## Email Account Setup for App Email Functionality

To set up email functionality, the .env file must contain the sender's email ID and password. For Gmail accounts, the "Allow less secure apps" option must be enabled. This option can only be enabled if two-factor authentication (2FA) is disabled; it cannot be granted if 2FA is enabled. For non-Gmail accounts, no additional permissions are needed, and providing the correct email address and password in the .env file is sufficient.

## Development Environment Setup

Developers can set up their local development environment using the following steps:

1. Clone the repository from GitHub.
2. Navigate to the project directory.
3. Navigate to frontend folder. Install frontend dependencies using `npm install` or `yarn install`.
4. Copy `example.env` to `.env` and update the environment variables.
5. Navigate to backend folder. Install backend dependencies using `npm install` or `yarn install` in the `backend` directory.
6. Add the Google service account secret file to `backend/secrets/service-account-secret.json`.
7. Copy `example.env` to `.env` and update the environment variables.
8. Start the frontend server using `npm start` or `yarn start`.
9. Start the backend server using `npm start` or `yarn start` in the `backend` directory.

## Google Sheets Setup

1. Create a Google Sheet with the following tabs:

   - Users
   - Worskshops
   - Institutes
   - Templates

2. Share the Google Sheet with the service account specified in `backend/secrets/service-account-secret.json`.

3. Populate the Users tab with the following columns:
   - Email
   - Role
   - Institute

- User can add columns as needed. It will automatically be reflected in the frontend with following login rules. `type` key is used to determine the type of input field in the frontend
  - link
  - date
  - number
  - select
  - string

```javascript
// getColumns in backend/utils/sheet.js

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

if (lowerValue.includes("institute") || lowerValue.includes("nodal center")) {
  return { value, type: "select" };
}

return { value, type: "string" };
```

## Deployment

This app is deployed on GCP (Google Cloud Platform) using App Engine for backend and bucket for frontend.

The Outreach tool can be deployed using the following steps:

1. **Google Cloud Platform CLI Setup** :- Install the Google Cloud SDK by following the instructions [here](https://cloud.google.com/sdk/docs/install).

2. **Login to GCP from CLI**

```bash
gcloud auth login
```

3. **Set the project ID**

```bash
gcloud config set project outreach-default
```

4. **Deploy the backend**

```bash
cd backend
gcloud app deploy
```

5. **Deploy the frontend**

```bash
cd frontend
npm run build:prod
gsutil cp -r build/* gs://outreach.vlabs.ac.in
```

Changes will be reflected in the frontend (https://outreach.vlabs.ac.in) after a few minutes.


## Future Works
- Take data from response sheet and populate in the tracker
- Add functionality to download reports from workshops page and templates page
- Convert the Delete workshop functionality to Deactivate workshop, so that the listing can be shown without the deactivated workshops. This will avoid accidental deletion of workshop data by the nodal coordinator.
