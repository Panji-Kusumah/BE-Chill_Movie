# 🎬 CHILL MOVIE API

A lightweight Node.js backend service built to power the "Chill" movie and series streaming platform.

---

## 🛠️ Tech Stack & Tools

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **Testing Framework:** Jest
* **HTTP Assertions:** Supertest
* **API Testing Tool:** Postman

---

## 📁 Project Structure

```text
BE/
├── src/
│   ├── config/             # Database configuration (db.js)
│   ├── controllers/        # Business logic & request handling
│   ├── middlewares/        # Authentication & validation
│   ├── models/             # Database queries
│   ├── routes/             # API endpoints definitions
│   ├── services/           # Extended business logic
│   ├── utils/              # Helper functions
│   └── app.js              # Main application entry point
├── test/                   # Integration & HTTP tests (Jest + Supertest)
│   ├── episode.test.js
│   ├── genre.test.js
│   ├── movie.test.js
│   └── package.test.js
├── .env                    # Local environment variables
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore file
├── package.json            # Project manifest & dependencies
└── README.md               # Project documentation

🚀 Getting Started
Clone and install dependencies:

Bash
   npm install
Copy .env.example to .env and configure your variables.

Run the testing suite:

Bash
   npm test
Start the development server:

Bash
   npm run dev

.env is entered for testing, use it wisely