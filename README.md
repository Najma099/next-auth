# NextAuth.js Learning Project

This is a small project built to explore and understand **NextAuth.js** end-to-end. It demonstrates various authentication flows, session management strategies, and secure access patterns using **Prisma**, **Tailwind CSS**, and **Resend**.

---

## Overview

The project was created to learn and implement:

- Different types of authentication providers:
  - Credentials (email + password)
  - Google OAuth
  - GitHub OAuth

- JWT callbacks to extend token payload (e.g., adding user role or flags)

- Fetching authenticated sessions:
  - On the client side
  - On the server side (API routes and server components)

- Two-Factor Authentication (2FA) via email

- Forgot password flow with reset link

- Email verification for users signing up via credentials

- API route protection for admin access

- Admin-only server components with role-based restrictions

---

## Tech Stack

| Technology     | Purpose                                |
|----------------|----------------------------------------|
| **Next.js**    | App framework with App Router          |
| **NextAuth.js**| Authentication and session management  |
| **Prisma**     | Database ORM                           |
| **Tailwind CSS**| Styling with utility-first classes    |
| **Resend**     | Email delivery for verification, reset, 2FA |

---

## Key Highlights

### Authentication

- Custom credentials login with hashed passwords
- OAuth login via Google and GitHub
- Email verification required for credentials signup

### Session & JWT

- JWT used for stateless sessions
- Custom fields added via callbacks (e.g., role, isOAuth flag)
- Session accessible in both client and server environments

### 2FA

- Optional 2FA setup using codes sent via email
- Code verification on login after password is entered

### Password Reset

- Forgot password flow with secure token
- Reset link sent via email using Resend

### Admin Access

- Role-based session management
- Protected API routes for admin
- Admin-only server components

---
## Note from the Author

This project was built purely for learning purposes — to get comfortable with setting up authentication in modern full-stack apps using **NextAuth.js**. I wanted to cover everything from multiple providers to advanced use-cases like 2FA, password reset, and admin access.

If you're exploring how authentication works in Next.js, I hope this gives you a good starting point.

