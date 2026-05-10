# Library Management API

A RESTful API for managing library books and student records, built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose** using ES6 modules.

## Tech Stack

- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Dev Tooling:** Nodemon, dotenv

## Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers (business logic)
├── models/          # Mongoose schemas and models
├── routes/          # Express route definitions
├── middleware/      # Custom middleware (error handling, etc.)
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables** – copy `.env` and update values
4. **Start MongoDB** locally or provide a remote URI
5. **Run in development**
   ```bash
   npm run dev
   ```
6. **Run in production**
   ```bash
   npm start
   ```

## API Endpoints

_To be implemented._

## License

ISC
