# Apex Recovery Backend

Express.js backend for the Apex Recovery MERN stack application.

## Features
- JWT Authentication with bcrypt password hashing
- MongoDB integration via Mongoose
- Cloudinary integration for image uploads
- Groq AI API integration for chat endpoint
- RESTful API endpoints for users, data, chat, and blogs

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env` and fill in your values:

```
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/apex_recovery"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
GROQ_API_KEY="gsk_YOUR_GROQ_API_KEY_HERE"
JWT_SECRET="supersecretjwtkey"
ADMIN_EMAIL="admin@apexrecovery.fit"
ADMIN_PASSWORD="adminpassword123"
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/chat` - Send message to AI advisor
- `POST /api/data/checkin` - Submit check-in data (requires auth)
- `GET /api/data/checkins` - Get user's check-in history (requires auth)
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)
- `DELETE /api/blogs/:id` - Delete blog (admin only)