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
- **Web Portal:** `http://localhost:5173`
- **API Gateway:** `http://localhost:5005`

To stop the services:
```bash
docker-compose down
```

---

## 2. Running the Flutter Mobile App (Officers App)

The `mobile-app` directory contains the Flutter mobile application.

**Prerequisites:**
- Ensure the [Flutter SDK](https://flutter.dev/docs/get-started/install) is installed.
- Ensure an Android Emulator or iOS Simulator is running, or a physical device is connected.

**Commands:**
Open a new terminal window, navigate to the `mobile-app` directory, and run:

```bash
cd mobile-app
flutter pub get
flutter run
```

---

## 3. Running the React Native Mobile App (Alternative)

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
