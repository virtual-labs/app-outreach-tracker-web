# Outreach Tool Technical Documentation

## Table of Contents

1. [Frontend](#frontend)
2. [Backend](#backend)
   - [Authentication](#authentication)
   - [Data Source](#data-source)
3. [Development Environment Setup](#development-environment-setup)
4. [Deployment](#deployment)

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
