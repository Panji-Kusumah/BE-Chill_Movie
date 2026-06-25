# 🎬 CHILL MOVIE API

A lightweight backend service built with Node.js and MySQL to power the **Chill Movie** streaming platform. This API provides authentication, user management, movie content management, email verification, and secure protected routes.

---

## 🛠️ Tech Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge\&logo=express\&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge\&logo=jest\&logoColor=white)

### Backend

* Node.js
* Express.js

### Database

* MySQL
* mysql2

### Authentication & Security

* JWT (JSON Web Token)
* bcrypt

### File Upload

* Multer

### Email Service

* Resend API

### Testing

* Jest
* Supertest

---

## ✨ Features

* 🔐 JWT Authentication
* 🔑 Password Hashing with bcrypt
* 📧 Email Verification using Resend API
* 👤 User Profile Management
* 🖼️ Profile Photo Upload
* 🎬 Movie Management (CRUD)
* 📺 Episode Management
* 🎭 Genre Management
* 💳 Package Management
* 🛡️ Protected Routes & Middleware
* 🧪 Automated Testing (41 Test Cases)

---

## 📁 Project Structure

```text
BE/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & upload middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper utilities
│   └── app.js           # Express application
│
├── test/                # Test suites
├── uploads/             # Uploaded files
├── .env
├── jest.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd BE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

RESEND_API_KEY=
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Run Production Server

```bash
npm start
```

---

## 🧪 Testing

Run all test cases:

```bash
npm test
```

Current status:

```bash
PASS 41/41 Test Cases
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint                 | Description   |
| ------ | ------------------------ | ------------- |
| POST   | `/api/auth/register`     | Register user |
| POST   | `/api/auth/login`        | Login user    |
| GET    | `/api/auth/verify-email` | Verify email  |

### User

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| GET    | `/api/users/profile` | Get profile    |
| PATCH  | `/api/users/profile` | Update profile |

### Movies

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/api/movies`     |
| POST   | `/api/movies`     |
| PATCH  | `/api/movies/:id` |
| DELETE | `/api/movies/:id` |

### Episodes

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/api/episodes` |
| POST   | `/api/episodes` |

### Genres

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/api/genres`     |
| POST   | `/api/genres`     |
| DELETE | `/api/genres/:id` |

### Packages

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/api/packages` |
| POST   | `/api/packages` |

> Protected endpoints require:
>
> ```http
> Authorization: Bearer <token>
> ```

---

## 🛡️ Security

* bcrypt password hashing 
* JWT authentication
* File upload validation
* Centralized error handling middleware

---

## 📦 Main Dependencies

```json
{
  "express": "^5.x",
  "mysql2": "^3.x",
  "bcrypt": "^6.x",
  "jsonwebtoken": "^9.x",
  "multer": "^2.x",
  "resend": "^6.x",
  "cors": "^2.x",
  "dotenv": "^17.x"
}
```

---

## 📄 License

ISC License

---

## 👨‍💻 Author

Built as part of a Fullstack Developer learning journey using Node.js, Express.js, MySQL, and RESTful API architecture.

.env is uploaded only for bootcamp assignments, use it wisely