# Blood Management System (BMS) - Backend

![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) ![Nodemailer](https://img.shields.io/badge/Nodemailer-14C38E?style=for-the-badge&logo=maildotru&logoColor=white)

---

## 🌟 Overview
The backend application for the **Blood Management System (BMS)** provides a robust, scalable, and secure RESTful API. Built with Node.js and Express, it follows the Model-View-Controller (MVC) architecture. It handles everything from donor registration, blood bank real-time data integration, to secure authentication and automated email notifications.

---

## ✨ Key Features
* **🏗️ MVC Architecture**: Clean code structure separating models, views (routes), and controllers for better maintainability.
* **🔐 Authentication & Security**: Secure endpoints for user registration, login, and authorization.
* **🩸 Donor Management**: Comprehensive API endpoints (`/api/donors`) to handle donor profiles and searches.
* **🏥 Blood Bank API**: Endpoints (`/api/blood-banks`) to seamlessly fetch and manage verified blood bank information.
* **📧 Email Service**: Integrated with `nodemailer` for communication, including OTP/email verifications.
* **🗃️ Database Seeding & Data parsing**: Includes scripts utilizing `csv-parser` to smoothly seed the database with real government blood bank data.

---

## 📂 Project Structure
```text
/
├── config/          # Configurations (Database connection, etc.)
├── controllers/     # Route logic and request handling
├── models/          # Mongoose database schemas
├── routes/          # Express route definitions
├── scripts/         # Utility scripts
├── seeders/         # Database seeders (e.g., CSV to JSON parsing)
├── services/        # Reusable business logic (e.g., Email service)
├── index.js         # Entry point of the application
└── package.json     # Project metadata and dependencies
```

---

## 🚀 Getting Started

Follow these instructions to set up the backend environment on your local machine.

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.
* Node.js (v18 or higher recommended)
* MongoDB (Local instance or MongoDB Atlas URI)

### Installation Steps

1. **Clone the repository** and navigate to the backend directory:
   ```bash
   cd New_RTBMS_Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure the necessary environment variables:
   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   ALLOWED_ORIGIN=http://localhost:5173
   # Add your email configuration variables here for Nodemailer
   ```

4. **Start the server**:
   ```bash
   node index.js
   # Or use nodemon for development: npm run dev (if configured)
   ```
   *The API will be available at `http://localhost:8080`.*

---

## 📡 API Endpoints Summary

* `/api/auth` - Authentication routes (Login, Register).
* `/api/donors` - Donor CRUD operations and search functionality.
* `/api/blood-banks` - Endpoints for accessing verified blood bank details.

---

## 💻 Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js (v5.2.1)
* **Database:** MongoDB
* **ODM:** Mongoose (v9.2.2)
* **Utilities:** Nodemailer (v8.0.1), Dotenv, CORS, CSV-Parser
