# Ailoitte E-Commerce API

RESTful API for an e-commerce platform built with Node.js, Express, and PostgreSQL.

## Features

- User authentication with JWT (access token + refresh token)
- Role-based access control (admin/customer)
- Product management with Cloudinary image upload
- Category management
- Shopping cart with persistent pricing
- Order management
- Product filtering and pagination
- Swagger API documentation
- Automated testing with Jest

## Prerequisites

- Node.js v20
- PostgreSQL
- Cloudinary account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables:
   - Database connection details
   - JWT secrets
   - Cloudinary credentials
   - Admin credentials

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests with Jest
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Revert last migration
- `npm run db:seed` - Run seeders
- `npm run db:reset` - Reset database (drop, migrate, seed)

## API Documentation

Swagger documentation is available at `/api-docs` endpoint.

## Environment Variables

- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Server port
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `ADMIN_EMAIL` - Admin user email (for seeding)
- `ADMIN_PASSWORD` - Admin user password (for seeding)

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── server.js        # Entry point
tests/               # Test files
migrations/          # Database migrations
seeders/             # Database seeders
```

## Testing

Run tests with:
```bash
npm test
```

## License

This project is for educational purposes as part of the Ailoitte Technologies assignment.