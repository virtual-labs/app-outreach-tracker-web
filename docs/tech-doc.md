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
4. Navigate to backend folder. Install backend dependencies using `npm install` or `yarn install` in the `backend` directory.
5. Start the frontend server using `npm start` or `yarn start`.
6. Start the backend server using `npm start` or `yarn start` in the `backend` directory.

## Deployment

Deployment instructions will be provided separately.
