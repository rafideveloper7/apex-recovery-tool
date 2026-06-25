# Apex Recovery Frontend

Next.js frontend with Tailwind CSS for the Apex Recovery MERN stack application.

## Features
- Responsive design matching original index.html
- AI Chat interface powered by Groq API
- Daily check-in with burnout score calculation
- Charts for data visualization (react-chartjs-2)
- JWT Authentication
- Admin panel for blog management

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000/api"
NEXT_PUBLIC_ADMIN_EMAIL="admin@apexrecovery.fit"
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Pages

- `/` - Dashboard with hero, metrics, charts
- `/checkin` - Daily burnout check-in
- `/advisor` - AI Recovery Advisor chat
- `/insights` - Pattern analysis and trends
- `/blog` - Burnout recovery articles
- `/admin` - Admin panel for blog management (admin only)