# Server

### Prerequisites

- Bun runtime (v1.1.29 or later)
- Supabase account (or PostgreSQL database)
- Bun runtime (v1.1.29 or later)
- Supabase account (or PostgreSQL database)

## Installation

First, ensure you have [Bun](https://bun.sh) installed (v1.1.29 or higher).

Then install the dependencies:

```bash
bun install
```

## Running the Server

Start the development server:

```bash
bun run index.js
```

For production:

```bash
bun run start
```

## API Documentation

### Endpoints

- `GET /api/users` - Fetch all users
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
## Tech Stack

- Node.js
- Express
- PostgreSQL with Supabase
- JSON Web Tokens (JWT) for authentication
- Bun for fast runtime execution

## License

MIT
