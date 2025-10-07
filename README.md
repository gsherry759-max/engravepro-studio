# EngravePro Studio v2.0

Laser-safe SVG converter with authentication and trial management.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
npm run dev
```

## Deploy to Netlify

1. Push this folder to GitHub
2. Connect your GitHub repo to Netlify
3. Set environment variable in Netlify:
   - JWT_SECRET: (generate a long random string)

## Default Admin Account

Email: admin@example.com
Password: You'll need to set this up manually in users.json

## Features

- JWT-based authentication
- Trial-based usage limits
- Admin dashboard for user management
- Laser-safe SVG output (fill-only, no strokes)
