# Eventra Server

Eventra Server is a TypeScript + Express backend for an event management platform.
It provides authentication, event management, invitations, participation workflows,
payments via Stripe, reviews, reporting, and admin moderation endpoints.

## Live URLs

- Frontend (Vercel): https://eventra-client.vercel.app/
- Backend API: https://eventraserver.vercel.app
- Local Frontend: http://localhost:3000
- Local Backend: http://localhost:5000/api/v1

## Features

- JWT-based authentication and role-aware access control
- Event creation, update, listing, and status handling
- Participation request and invitation workflows
- Stripe payment intent flow and webhook processing
- Event review and rating support
- Report system for events/reviews and admin moderation tools
- Activity log support for admin actions
- Global error handling and not-found middleware

## Technologies Used

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Stripe
- JWT (jsonwebtoken)
- bcryptjs
- Vercel (serverless deployment target)

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone <your-repository-url>
cd eventra_server
npm install
```

### 2. Create environment variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 3. Generate Prisma client and run migrations

```bash
npm run generate
npm run migrate
```

### 4. Run the development server

```bash
npm run dev
```

The app will run at: http://localhost:5000

### 5. Build and run production bundle (optional)

```bash
npm run build
npm start
```

## Authentication (Passport.js: Email + Facebook)

### Backend endpoints

- `POST /api/v1/auth/social/facebook`

### Request payloads

Facebook:

```json
{
  "accessToken": "FACEBOOK_USER_ACCESS_TOKEN"
}
```

### Response

Both login endpoints return:

- JWT token (also set in cookie as `token`)
- Logged in / newly created user

- Local email/password login is handled by Passport Local strategy.
- Facebook login is handled by Passport Facebook Token strategy.
