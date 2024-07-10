<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p align="center">
<img width="100" height="100" alt="Subul Logo" src="https://subul.me/images/Logo.png"/>
</p>
<p align="center">
  <h1 align="center">Subul API</h1>
</p>
<p align="center">
  <a href="https://subul.me">
    <img src="https://img.shields.io/badge/Website-91683a" alt="Discord">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-343d40.svg" alt="License">
  </a>
</p>

![Home-Page2](https://github.com/SaadMu7ammad/subul/assets/130322757/6c54cbce-78e8-447c-bdd6-cd75347589ff)

## Introduction

[Subul](https://subul.me) is a MERN Stack Charity Platform, where users can donate different Charities. This repository contains the backend API for the website.

## Technology Stack

### Main Technologies

[![Technology Stack](https://skillicons.dev/icons?i=nodejs,express,ts,mongodb,jest)](https://skillicons.dev)

### Important Packages

`Mongoose`: For MongoDB Object Modeling

`I18Next`: For website Translation and Localization (English, Arabic)

`jsownwebtoken`: For Authentication and Authorization

`Multer`: For File Uploads

`Socket.io`: For Real-Time Chat & notifications

`Winson`: For Logging

`Eslint`: For Code Linting

`Prettier`: For Code Formatting

### Third-Party Services

- [Paymob](https://paymob.com/): Our Payment Gateway
- [Couldinary](https://cloudinary.com/): Our Image Hosting Service
- [Render](https://render.com/): Our Deployment Service

## Requirements

#### User Requirements:

- Every charity has the ability to post a variety of cases that need help.

- Every Case has a clear description to ensure transparency and trust.

- Blood donation for urgent cases in hospitals according to your location.

- Used clothing or used electric products that donors can apply for the announcements according to the charity posts.

- Built-in Chat System to allow charities to contact donors.

- Users can create a fundraising announcement for a specific charity.

#### System Requirements (specific requirements):

- The system must review the charity papers , and accept or deny it

- The system allows registered charities to post new cases, review, edit and close posted cases

- Each case must include fields for title, description(and urgency level), main type & sub type, image, case location gender, target donation amount needed with a progress bar of donations for each case

- The system must display all transactions payment made to charity in dashboard , or made by user in dashboard

- Users shall be able to filter cases and donation opportunities and create fundraising announcements for specific charities..

- The system must provide a feature for users to post and apply for donations of used clothing and electrical products.

- The system shall include a built-in chat system to facilitate communication between charities and donors.

- The system must provide secure payment processing for online donations, integrating with a third-party payment gateway to ensure the safety and confidentiality of financial transactions.
- Triggering notifications to nearby users and blood donation centers.

## Application Archeticture

### Class Diagram

![Subul Class Diagram](https://github.com/SaadMu7ammad/subul/assets/130322757/d39d00ba-0bf1-46eb-b7bd-295952e3b061)

### Folder Structure

We are using a module structure for our project, where each module has its own folder containing the following files following the `3 Tier Archeticture`:

- `entry-points`: Contains the entry points for the module (routes)

- `domain`: Contains the business logic for the module (use-case - services - utils)

- `data-access`: Contains the database layer for the module (repository - models - interfaces)

### Request Journey

The request journey starts from the entry point, where the request is validated and passed to the domain layer. The domain layer contains the business logic for the request, where the data is processed and passed to the data-access layer. The data-access layer contains the database logic for the request, where the data is fetched or updated in the database.


![Request Journey](https://github.com/SaadMu7ammad/subul/assets/130322757/28ded137-ae3d-4dd9-9678-b3cd12e52e51)
