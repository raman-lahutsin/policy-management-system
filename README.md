# Policy Management System

A Ruby on Rails API for insurance policy management — helps insurance companies organize and handle all of their policies in one place.

## Tech Stack

- Ruby 3.4 / Rails 8.1 (API-only)
- PostgreSQL
- JWT Authentication
- RSpec for testing

## Setup

```bash
# Install dependencies
bundle install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create and migrate database
rails db:create db:migrate db:seed

# Run the server
rails s
```

## API Endpoints

All endpoints are under `/api/v1/` and require a JWT token in the `Authorization: Bearer <token>` header (except auth endpoints).

### Authentication
- `POST /api/v1/auth/register` — Create user account
- `POST /api/v1/auth/login` — Get JWT token
- `GET /api/v1/auth/me` — Current user profile

### Accounts
- `GET /api/v1/accounts` — List accounts
- `POST /api/v1/accounts` — Create account
- `GET /api/v1/accounts/:id` — Show account (includes associated policies)
- `PATCH /api/v1/accounts/:id` — Update account
- `DELETE /api/v1/accounts/:id` — Delete account
- `GET /api/v1/accounts/:id/policies` — Account's policies

Address fields are nested under an `address` object in both requests and responses:

```json
{
  "account": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "address": {
      "address_line1": "123 Main St",
      "address_line2": null,
      "city": "Springfield",
      "state": "IL",
      "zip_code": "62701"
    }
  }
}
```

### Policies
- `GET /api/v1/policies` — List policies
- `POST /api/v1/policies` — Create policy
- `GET /api/v1/policies/:id` — Show policy
- `PATCH /api/v1/policies/:id` — Update policy
- `DELETE /api/v1/policies/:id` — Delete policy

Policy `insurance_type` values: `general_liability`, `professional_liability`, `commercial_property`, `business_owners`

`premium` and `coverage` are integers (whole dollar amounts).

### Endorsements
- `GET /api/v1/policies/:policy_id/endorsements` — List endorsements for policy
- `POST /api/v1/policies/:policy_id/endorsements` — Create endorsement
- `GET /api/v1/endorsements/:id` — Show endorsement
- `PATCH /api/v1/endorsements/:id` — Update endorsement

Endorsement `endorsement_type` values: `policy_change`, `cancellation`, `reinstatement`

`premium` is an integer (whole dollar amount, can be negative for cancellations).

## Frontend

The frontend is a React SPA in the `frontend/` directory, built with:

- React 19 + Vite
- Material UI (MUI)
- React Router v6
- Axios (JWT auth via interceptors)
- Vention brand colors (`#FF6A47` primary orange)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev    # starts dev server on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:3000` (Rails backend), so start both servers during development.

### Frontend Tests

```bash
cd frontend
npm test           # single run (Vitest)
npm run test:watch # watch mode
```

## Backend Testing

```bash
bundle exec rspec
```

## License

See [LICENSE](LICENSE) for details.
