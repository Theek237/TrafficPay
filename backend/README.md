# Backend REST API ⚙️

This is the Node.js and Express REST API backend for the Sri Lanka Traffic Fine System. It handles database operations, authentication, fine issuance, mock payments, and analytics data aggregation.

## 🛠️ Tech Stack
* **Runtime:** Node.js 
* **Framework:** Express.js 
* **Database:** MongoDB 7.x (Atlas / self-hosted) 
* **ODM:** Mongoose 8.x 
* **Authentication:** Single JWT access token (24-hour expiry) 

## ✨ Key Features
* **JWT Authentication:** Secure endpoints using JSON Web Tokens.
* **Fine Management:** Endpoints for officers to issue fines and for public lookup.
* **Mock Payment Gateway:** A simplified mock endpoint that accepts payment details, immediately returns SUCCESS, and generates a receipt without requiring third-party webhooks.
* **SMS Notifications:** Automatically triggers an SMS to the issuing officer upon a successful mock payment.
* **Analytics Aggregation:** Complex MongoDB aggregation pipelines to supply data for the Admin Dashboard charts.


## 🚀 Getting Started

### Prerequisites
* Node.js installed on your machine.
* A running MongoDB instance (local server or MongoDB Atlas cloud).

