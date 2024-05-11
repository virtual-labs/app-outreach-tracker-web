# Outreach Tool Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Definitions](#definitions)
3. [Features](#features)
4. [User Privileges](#user-privileges)
5. [Walkthrough of the Outreach Tool](#walkthrough-of-the-outreach-tool)
   - [Logging In](#logging-in)
   - [Dashboard](#dashboard)
   - [Managing Workshops](#managing-workshops)
   - [Managing Templates](#managing-templates)
   - [Managing Users and Institutes](#managing-users-and-institutes)
   - [Logging Out](#logging-out)
6. [Support and Updates](#support-and-updates)

## Introduction

The Outreach tool is designed to facilitate the storage and management of workshop data for Virtual Labs. It allows admins and nodal coordinators from various institutes to access and maintain workshop information efficiently.

## Definitions

## Features

- Store and manage workshop data.
- Utilize different templates for workshop records.
- Google authorization for both admin and coordinator users.

## User Privileges

| Operation        | Admin User | Nodal Coordinator |
| ---------------- | ---------- | ----------------- |
| Add Workshop     | Yes        | \*Yes             |
| Delete Workshop  | Yes        | \*Yes             |
| Edit Workshop    | Yes        | \*Yes             |
| Add Template     | Yes        | Yes               |
| Delete Template  | Yes        | No                |
| Add User         | Yes        | No                |
| Delete User      | Yes        | No                |
| Add Institute    | Yes        | No                |
| Delete Institute | Yes        | No                |
| View Workshop    | Yes        | \*Yes             |

\* Nodal coordinators can only view, add, delete, and edit workshops that are added by them.

## Walkthrough of the Outreach Tool

### Logging In

Upon navigating to the Outreach tool's URL, users will be presented with the login page. Users can log in using their Google credentials.

![Login Page](./img/login.png)

### Dashboard

After successful login, users will land on the dashboard. The dashboard provides an overview of workshops and other relevant information.

![Dashboard](./img/dash.png)

### Managing Workshops

Admin and Nodal Coordinator users can manage workshops by adding, editing, or deleting workshop records. They can also view detailed information about each workshop.

![Dashboard](./img/dash.png)

### Managing Templates

Users can utilize different templates for workshop records to streamline data entry and ensure consistency. They can add, edit, or delete templates as needed.

![Templates](./img/pagebox.png)
![Templates](./img/template.png)

### Managing Users and Institutes

Admin users have the privilege to add, edit, or delete user accounts and institute information. This allows for efficient management of user access and organization data.

![Users](./img/ins.png)
![Users](./img/user.png)

### Logging Out

Users can log out of the Outreach tool by clicking on the logout button located in the navigation menu. This ensures the security of their account and data.

![Logout](./img/dash.png)

## Support and Updates

Regular updates and versioning are provided to ensure the tool's functionality and security.
