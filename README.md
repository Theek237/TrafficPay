# Sri Lanka Traffic Fine System 🚦

This is the main monorepo for the Sri Lanka Traffic Fine System, developed as a group project for the Software Architecture module (2026).

## 📖 Project Overview
Aligning with the Sri Lankan government's national policy of strengthening public services through digitalization, the Sri Lanka Police Department has identified the need to modernize traffic fine payments across the country. This system aims to eliminate inefficiencies in the traditional traffic fine settlement process and reduce the inconvenience faced by motorists.

## 🏗️ Repository Structure
This repository follows a monorepo structure containing the following sub-projects:

* **`backend/`**: Node.js and Express REST API handling the database and business logic.
* **`mobile-app/`**: Flutter application for drivers to make on-the-spot fine payments.
* **`web-portal/`**: React Single Page Application (SPA) for drivers to pay fines online later.
* **`admin-portal/`**: React web portal for senior officials to monitor traffic fine collections nationwide.


## 🚀 Branching & Workflow Rules
To ensure a smooth collaboration and prevent merge conflicts, all team members must follow these strict Git rules:

1.  **Main Branch:** The `main` branch is the final integration branch and is always deployable. Do not push code directly to `main`.
2.  **Feature Branches:** Create a separate feature branch for your tasks.
    * *Examples:* `feature/auth` (Member 1), `feature/fines` (Member 2), `feature/payments` (Member 3), `feature/admin` (Member 4).
3.  **Final Merge:** All commits must be merged to the `main` branch via Pull Requests before the final evaluation.## Contributors
- Theenuka Bandara
