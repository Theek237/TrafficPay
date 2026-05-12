# Backend REST API ⚙️

[cite_start]This is the Node.js and Express REST API backend for the Sri Lanka Traffic Fine System[cite: 32]. [cite_start]It handles database operations, authentication, fine issuance, mock payments, and analytics data aggregation[cite: 525, 1010].

## 🛠️ Tech Stack
* [cite_start]**Runtime:** Node.js [cite: 237]
* [cite_start]**Framework:** Express.js [cite: 237]
* [cite_start]**Database:** MongoDB 7.x (Atlas / self-hosted) [cite: 545]
* [cite_start]**ODM:** Mongoose 8.x [cite: 545]
* [cite_start]**Authentication:** Single JWT access token (24-hour expiry) [cite: 545, 740]

## ✨ Key Features
* [cite_start]**JWT Authentication:** Secure endpoints using JSON Web Tokens[cite: 42, 745].
* [cite_start]**Fine Management:** Endpoints for officers to issue fines and for public lookup[cite: 821].
* [cite_start]**Mock Payment Gateway:** A simplified mock endpoint that accepts payment details, immediately returns SUCCESS, and generates a receipt without requiring third-party webhooks[cite: 875, 876].
* [cite_start]**SMS Notifications:** Automatically triggers an SMS to the issuing officer upon a successful mock payment[cite: 876, 919].
* [cite_start]**Analytics Aggregation:** Complex MongoDB aggregation pipelines to supply data for the Admin Dashboard charts[cite: 698, 1010].


## 🚀 Getting Started

### Prerequisites
* Node.js installed on your machine.
* [cite_start]A running MongoDB instance (local server or MongoDB Atlas cloud)[cite: 545].

