# Ailoitte E-Commerce API

A RESTful e-commerce backend API built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Node.js** with **Express.js** - Server-side framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Jest** - Testing framework
- **Swagger** - API documentation

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammedanwarabbas/ailoitte-ecommerce-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ailoitte-ecommerce-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file based on `.env.example`

5. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

6. Run admin seeder (optional):
   ```bash
   npm run db:seed:admin
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, visit the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Project Structure

```
ailoitte-ecommerce-api/
├── config/
├── migrations/
├── seeders/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```