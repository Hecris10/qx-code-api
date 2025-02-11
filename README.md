# QX Code API

QX Code API is the backend service for QX Code, a SaaS platform that allows users to generate fully customizable QR codes for free. This API is built using NestJS 10 and provides endpoints for managing QR code generation, authentication, and user data.

## Features

- **NestJS 10 Framework** – Scalable and modular backend architecture.
- **Prisma ORM with LibSQL (Turso)** – Efficient and scalable database access.
- **JWT Authentication** – Secure authentication using JSON Web Tokens.
- **Passport.js Integration** – Supports local and JWT authentication strategies.
- **Docker Support** – Easily deployable with Docker and Docker Compose.

## Tech Stack

- **Backend:** NestJS 10
- **Database:** Prisma with LibSQL (Turso)
- **Authentication:** Passport.js with bcrypt and JWT
- **API Documentation:** Swagger (if enabled)
- **Deployment:** Docker, AWS, or Vercel

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js 18+
- pnpm (preferred package manager)
- Docker (optional for containerized deployment)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/qxcode-api.git
   cd qxcode-api
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values accordingly.
4. Run database migrations (if applicable):
   ```sh
   pnpm prisma migrate dev
   ```
5. Start the development server:
   ```sh
   pnpm start:dev
   ```
   The API should now be running at `http://localhost:3000`.

## Running with Docker

To start the API using Docker:

```sh
docker-compose up --build
```

## API Endpoints

- **Authentication**
  - `POST /auth/login` – Authenticate and receive a JWT token.
  - `POST /auth/register` – Register a new user.
- **QR Code Generation**
  - `POST /qr/generate` – Create a new customizable QR code.
  - `GET /qr/:id` – Retrieve QR code details.
- **User Management**
  - `GET /user/profile` – Fetch user profile information.

## Contributing

We welcome contributions! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.

---

🚀 Built with love using NestJS and Prisma!
