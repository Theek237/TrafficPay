# TrafficPay Execution Instructions

This project is built using a Microservices Architecture, with independent services managed via Docker Compose, and distinct frontends for web and mobile.

## 1. Running the Microservices (Backend & Web Portal)

The backend ecosystem and the React web portal are completely dockerized.

**Prerequisites:**
- Ensure [Docker](https://www.docker.com/products/docker-desktop) is installed and running on your system.

**Commands:**
Open your terminal in the root directory (`TrafficPay`) and run:

```bash
docker-compose up --build
```

**Accessing Services:**
- **Driver Portal (Public):** `http://localhost:5173`
- **Admin Portal (Dashboard):** `http://localhost:5174`
- **API Gateway:** `http://localhost:5005`

To stop the services:
```bash
docker-compose down
```

---


## 2. Running the React Native Mobile App

The `mobile-app-rn` directory contains an alternative React Native application (using Expo).

**Prerequisites:**
- Node.js and npm installed.

**Commands:**
Open a new terminal window, navigate to the `mobile-app-rn` directory, and run:

```bash
cd mobile-app-rn
npm install
npx expo start
```
*(This will open the Expo developer tools, where you can scan a QR code or press `a` to run on an Android emulator or `i` for an iOS simulator).*
