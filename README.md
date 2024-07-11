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

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
   - [Main Technologies](#main-technologies)
   - [Important Packages](#important-packages)
   - [Third-Party Services](#third-party-services)
3. [Requirements](#requirements)
   - [User Requirements](#user-requirements)
   - [System Requirements](#system-requirements)
4. [Application Architecture](#application-architecture)
   - [Class Diagram](#class-diagram)
   - [Folder Structure](#folder-structure)
   - [System Components and Use Cases](#system-components-and-use-cases)
   - [Request Journey](#request-journey)
5. [Installation](#installation)
   - [Requirements](#requirements-2)
   - [Environment Variables](#environment-variables)
   - [Steps](#steps)
   - [Run Tests](#run-tests)
6. [License](#license)

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

- Donors can upload used items (e.g. clothing , electrical products) to donate.

- Charities can book used items uploaded by donors.

- Built-in Chat System to allow charities to contact donors.

- Users can create a fundraising announcement for a specific charity.

#### System Requirements (specific requirements):

- The admin must review the charity papers , and accept or reject it

- The system allows registered charities to post new cases, review, edit and mark cases as completed.

- Each case must include fields for title, description(and urgency level), main type & sub type, image, case location gender, target donation amount needed with a progress bar of donations for each case

- The system must display all transactions payment made to charity in dashboard , or made by user in dashboard

- Users shall be able to filter cases and donation opportunities and create fundraising announcements for specific charities..

- The system must provide a feature for users to post and apply for donations of used clothing and electrical products.

- The system shall include a built-in chat system to facilitate communication between charities and donors.

- The system must provide secure payment processing for online donations, integrating with a third-party payment gateway to ensure the safety and confidentiality of financial transactions.

- Triggering notifications to nearby users and blood donation centers.

## Application Archeticture

### Class Diagram

![Subul Class Diagram](https://github.com/SaadMu7ammad/subul/assets/130322757/b10fa06f-985e-46a8-b77a-3732c0a31fb4)

### Folder Structure

We are using a module structure for our project, where each module has its own folder (under `src/components/`) containing the following files following the `3 Tier Archeticture`:

- `entry-points`: Contains the entry points for the module (routes)

- `domain`: Contains the business logic for the module (use-case - services - utils)

- `data-access`: Contains the database layer for the module (repository - models - interfaces)

- `test`: Contains the tests for the module

other folders include:

- `libraries` : Contains libraries configuraiton files e.g. (configuration provider, error handling setup, paymob ...).
- `utils` : Contains the shared utilities used by the system (e.g. sendNotifications,deleteFile) .
- `locales` : Contains the translation files for the system.
- `scripts` : Contains Custom scripts.

### System Components and Use Cases

The Main Components of the system are located in the `src/components` folder:

[auth](https://github.com/SaadMu7ammad/subul/tree/main/src/components/auth): In this folder we include the authentication logic (login & register) for the system.

- [user](https://github.com/SaadMu7ammad/subul/tree/main/src/components/auth/user) contains the user authentication logic.

- [charity](https://github.com/SaadMu7ammad/subul/tree/main/src/components/auth/charity) contains the charity authentication logic.

- [shared](https://github.com/SaadMu7ammad/subul/tree/main/src/components/auth/shared) contains shared middlewares used by both user and charity e.g. `auth`,`isActivated` functions.

[admin](https://github.com/SaadMu7ammad/subul/tree/main/src/components/admin) use cases :

- `getAllCharities` : return all charities in the system.

- `getAllUsers` : return all users in the system.

- `getCharityById` : return a specific charity by id.

- `getAllPendingRequestsCharities` : return all charities that are not confirmed yet.

- `getPendingRequestCharityById` : return a specific charity that is not confirmed yet.

- `getPendingPaymentRequestsForConfirmedCharityById` : return all payment confirmation requests for a specific confirmed charity.

- `getAllRequestsPaymentMethodsForConfirmedCharities` : return all payment confirmation requests for all confirmed charities.

- `confirmCharity` : admin confirms a charity.

- `rejectCharity` : admin rejects a charity.

- `confirmPaymentAccountRequestForConfirmedCharities` : admin confirms a payment account confirmation request for a confirmed charity.

- `rejectPaymentAccountRequestForConfirmedCharities` : admin rejects a payment account confirmation request for a confirmed charity.

[case](https://github.com/SaadMu7ammad/subul/tree/main/src/components/case) use cases :

- `addCase` : charity adds a new case.

- `getAllCases` : charity gets all cases.

- `getAllCasesForUser` : user gets all cases.

- `getCaseById` : charity gets a specific case by id.

- `deleteCase` : charity deletes a specific case by id.

[charity](https://github.com/SaadMu7ammad/subul/tree/main/src/components/charity) use cases :

- `activateCharityAccount` : charity activates its account using the token that is sent to its email.

- `requestResetPassword` : when a charity forgets its password, it can request a reset password email.

- `confirmResetPassword` : charity confirms the reset password request.

- `changePassword` : charity changes its password.

- `editCharityProfile` : charity edits its profile.

- `changeProfileImage` : charity changes its profile image.

- `requestEditCharityPayments` : charity requests to edit its payment methods waiting for the admin to review them.

- `sendDocs` : charity sends the required documents to the admin.

- `logout` : charity logs out.

[chat](https://github.com/SaadMu7ammad/subul/tree/main/src/components/chat) use cases :

- `sendMessage` : charity/user sends a message to another charity/user .

- `getConversation` : charity/user gets the conversation between him and another charity/user .

[notification](https://github.com/SaadMu7ammad/subul/tree/main/src/components/notification) use cases :

- `getAllNotifications` : charity/user gets all notifications.

- `markNotificationAsRead` : charity/user marks a notification as read.

- `deleteNotification` : charity/user deletes a notification.

[used-items](https://github.com/SaadMu7ammad/subul/tree/main/src/components/used-items) use cases :

- `addUsedItem` : user adds usedItem.

- `getUsedItem` : user gets usedItem by id.

- `deleteUsedItem` : user deletes usedItem by id.

- `updateUsedItem` : user updates usedItem by id.

- `addUsedItemImages` : user adds images to usedItem.

- `deleteUsedItemImage` : user deletes an image from usedItem.

- `getAllUsedItems` : charity gets all usedItems.

- `bookUsedItem` : charity books a usedItem.

- `cancelBookingOfUsedItem` : charity cancels booking of a usedItem.

- `ConfirmBookingReceipt` : charity confirms booking receipt of a usedItem.

[user](https://github.com/SaadMu7ammad/subul/tree/main/src/components/user) use cases :

- `resetUser` : if the user forgets his password, he can request a reset password email.

- `confirmReset` : user confirms the reset password request.

- `changePassword` : user changes his password.

- `activateAccount` : user activates his account using the token that is sent to his email.

- `bloodContribution` : user contributes blood.

- `requestFundraisingCampaign` : user requests a fundraising campaign.

- `editUserProfile` : user edits his profile.

- `logoutUser` : user logs out.

- `getUserProfileData` : user gets his profile data.

[transaction](https://github.com/SaadMu7ammad/subul/tree/main/src/components/transaction) use cases :

- `preCreateTransaction` : Assertions and validations before creating a transaction.

- `getAllTransactions` : users gets all transactions.

- `getAllTransactionsToCharity` : charity gets all transactions.

- `updateCaseInfo` : User donates to a case and update its info after `preCreateTransaction`.

### Request Journey

The request journey starts from the entry point, where the request is validated and passed to the domain layer. The domain layer contains the business logic for the request, where the data is processed and passed to the data-access layer. The data-access layer contains the database logic for the request, where the data is fetched or updated in the database.

![Request Journey](https://github.com/SaadMu7ammad/subul/assets/130322757/fc10bf72-e229-45b1-b818-50febdc7ac76)

## Installation

### Requirements

- Node.js & Npm
- git

### Environment Variables

Fill in [exmaple.env](https://github.com/SaadMu7ammad/subul/blob/main/example.env) with your credentials and rename it to `.env`.

### Steps

```bash
git clone https://github.com/SaadMu7ammad/subul.git
cd subul
npm i
npm run server
```

### Run Tests

```bash
npm run test
```

> **Note:**
> If you set the `NODE_ENV` to `development` in the `.env` file
> make sure to run this command :
>
> ```bash
> mkdir uploads{,/caseCoverImages,/usedItemsImages,/charityDocs,/charityLogos}
> ```

## License

[MIT License](https://github.com/SaadMu7ammad/subul/blob/main/LICENSE)
