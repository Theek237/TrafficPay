# Sri Lanka Traffic Fine System 🚦

[cite_start]This is the main monorepo for the Sri Lanka Traffic Fine System, developed as a group project for the Software Architecture module (2026)[cite: 1, 1014].

## 📖 Project Overview
[cite_start]Aligning with the Sri Lankan government's national policy of strengthening public services through digitalization, the Sri Lanka Police Department has identified the need to modernize traffic fine payments across the country[cite: 22]. [cite_start]This system aims to eliminate inefficiencies in the traditional traffic fine settlement process and reduce the inconvenience faced by motorists[cite: 23].

## 🏗️ Repository Structure
[cite_start]This repository follows a monorepo structure containing the following sub-projects[cite: 1011]:

* [cite_start]**`backend/`**: Node.js and Express REST API handling the database and business logic[cite: 527].
* [cite_start]**`mobile-app/`**: React Native application for drivers to make on-the-spot fine payments[cite: 34, 1011].
* [cite_start]**`web-portal/`**: React Single Page Application (SPA) for drivers to pay fines online later[cite: 35, 1011].
* [cite_start]**`admin-portal/`**: React web portal for senior officials to monitor traffic fine collections nationwide[cite: 29, 1011].


## 🚀 Branching & Workflow Rules
To ensure a smooth collaboration and prevent merge conflicts, all team members must follow these strict Git rules:

1.  [cite_start]**Main Branch:** The `main` branch is the final integration branch and is always deployable[cite: 1012]. Do not push code directly to `main`.
2.  **Feature Branches:** Create a separate feature branch for your tasks.
    * [cite_start]*Examples:* `feature/auth` (Member 1), `feature/fines` (Member 2), `feature/payments` (Member 3), `feature/admin` (Member 4)[cite: 1013].
3.  [cite_start]**Final Merge:** All commits must be merged to the `main` branch via Pull Requests before the final evaluation[cite: 15].