# 🚦 TrafficPay - Smart City Traffic Fine Management

<div align="center">
  <p>A next-generation, microservice-based web portal for managing and processing smart-city traffic violations.</p>
</div>

---

## 📖 Overview

TrafficPay is a robust Software Architecture project designed to handle the secure lookup, management, and payment of traffic fines. Moving away from traditional monolithic architectures, TrafficPay is built on a highly scalable, decoupled **Microservices Architecture**, ensuring fault tolerance, independent scaling, and distinct domain boundaries.

The user interface represents the cutting edge of modern web design, featuring an ultra-premium, responsive aesthetic powered by advanced animations, glassmorphism, and dynamic 3D visuals.

---

## 🏗️ Architecture Design

![High-Level Architecture Diagram](mern-architecture.png)

The backend ecosystem utilizes an API Gateway pattern to route client requests securely to dedicated, lightweight microservices.

*   **API Gateway (Port 5005)**: The single point of entry for the frontend, handling CORS, logging, and proxy routing to internal services.
*   **Authentication Service (Port 5001)**: Dedicated to user identity, RBAC (Role-Based Access Control), and issuing stateless JWTs.
*   **Fines Service (Port 5002)**: Manages the core domain logic of issuing traffic tickets, scanning the database for violations, and calculating demerit points.
*   **Payments Service (Port 5003)**: Securely processes fine payments, logs transaction histories, and interfaces with simulated SMS gateways.

## 💻 Tech Stack

### Frontend (Client)
*   **Framework**: React 19 (Vite)
*   **Styling**: Tailwind CSS v4
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Routing**: React Router DOM v7

### Backend (Microservices)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB Atlas (Cloud)
*   **ODM**: Mongoose
*   **Security**: bcryptjs, jsonwebtoken (JWT)
*   **Routing**: http-proxy-middleware

---

## ✨ Key Features

1.  **Immersive 3D UI:** A stunning, cinematic frontend interface featuring dynamic blur filters, floating animations, and high-contrast smart-city aesthetics.
2.  **True Microservices:** Completely decoupled backend services ensuring high availability and domain-driven design.
3.  **Live Cloud Database:** Integrated directly with MongoDB Atlas for persistent, cloud-based data storage.
4.  **Secure Authentication:** JWT-based stateless authentication preventing unauthorized access to officer and admin routes.
5.  **Real-Time Data Fetching:** Instantaneous fine lookups utilizing dynamic API Gateway routing.

---

## 🚀 Getting Started

To run the entire microservices cluster and the web portal locally, we use **Docker**.

### Start the Entire System
Ensure you have Docker Desktop running, then open your terminal in the root directory and run:

```bash
docker-compose up --build
```

### Access the Application
- **Web Portal**: Open your browser and navigate to `http://localhost:5173`
- **Mobile App**: Run the Flutter app in an emulator pointing to the API Gateway at `http://localhost:5005`
---

<div align="center">
  <i>Developed for Advanced Software Architecture</i>
</div>
