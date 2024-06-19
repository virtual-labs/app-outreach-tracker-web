# Workshop Tracker Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [User Privileges](#user-privileges)
4. [Walkthrough of the Workshop Tracker](#walkthrough-of-the-workshop-tracker)
   - [Logging In](#logging-in)
   - [Dashboard](#dashboard)
   - [Managing Workshops](#managing-workshops)
   - [Managing Templates](#managing-templates)
   - [Managing Users and Institutes](#managing-users-and-institutes)
   - [Logging Out](#logging-out)
5. [Support and Updates](#support-and-updates)

## Introduction

The [Workshop Tracker](https://outreach.vlabs.ac.in/) is designed to facilitate the storage and management of workshop data for Virtual Labs. It allows admins and nodal coordinators from various institutes to access and maintain workshop information efficiently.

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

## Walkthrough of the Workshop Tracker
### Logging In

Upon navigating to the [Workshop Tracker](https://outreach.vlabs.ac.in/), users will be presented with the login page. Users can log in using their Google credentials.

![Login Page](./img/login.png)

Mobile view:

<p align="center">
<img src="./img/login_mobile.png"
     alt="Login Page"
     style="height: 400px" />
</p>

### Dashboard

After successful login, users will land on the dashboard. The dashboard provides an overview of workshops and other relevant information.

![Dashboard](./img/dash.png)

Mobile view:

<p align="center">
<img src="./img/dash_mobile.png"
     alt="Dashboard"
     style="height: 400px" />
</p>

Summary of a page can be viewed by clicking on the summary button present in the top of the workshop page.

<p align="center">
<img src="./img/summary.png"
     alt="Summary"
     style="height: 400px" />
</p>

Filters can be added to aid in searching by clicking on the filter button present on the top of the page.

<p align="center">
<img src="./img/filters.png"
     alt="Filters"
     style="height: 400px" />
</p>

### Managing Workshops

Admin and Nodal Coordinator users can manage workshops by adding, editing, or deleting workshop records. They can also view detailed information about each workshop.

![Dashboard](./img/dash.png)

Mobile view:

<p align="center">
<img src="./img/profile_mobile.png"
     alt="Profile"
     style="height: 400px" />
</p>

### Managing Templates

Users can utilize different templates for workshop records to streamline data entry and ensure consistency. They can add, edit, or delete templates as needed.

![Templates](./img/pagebox.png)
![Templates](./img/template.png)

Mobile view:

<p align="center">
<img src="./img/hamburg_mobile.png"
     alt="Hamburger Icon"
     style="height: 400px" />
<img src="./img/template_mobile.png"
     alt="Templates"
     style="height: 400px" />
</p>

### Managing Users and Institutes

Admin users have the privilege to add, edit, or delete user accounts and nodal center information. This allows for efficient management of user access and organization data. Upon addition(or deletion) of a user, a mail is sent to the user who has been added(or deleted).

![Users](./img/ins.png)
![Users](./img/user.png)

Mobile view:

<p align="center">
<img src="./img/ins_mobile.png"
     alt="Institutes"
     style="height: 400px" />
<img src="./img/user_mobile.png"
     alt="Users"
     style="height: 400px" />
</p>

### Logging Out

Users can log out of the [Workshop Tracker](https://outreach.vlabs.ac.in/) by clicking on the logout button located in the navigation menu. This ensures the security of their account and data.

![Logout](./img/dash.png)

Mobile view:

<p align="center">
<img src="./img/profile_mobile.png"
     alt="Profile"
     style="height: 400px" />
</p>

## Support and Updates

Regular updates and versioning are provided to ensure the tool's functionality and security.
