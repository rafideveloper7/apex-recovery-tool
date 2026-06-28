# Apex Recovery Backend

Express.js backend for the Apex Recovery MERN stack application.

## Features
- JWT Authentication with bcrypt password hashing
- MongoDB integration via Mongoose
- Cloudinary integration for profile image uploads
- OpenRouter AI API integration for chat endpoint
- 5-question onboarding flow for new users
- Admin panel for user/blog management
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
OPENROUTER_API_KEY="sk-or-v1-YOUR_API_KEY"
JWT_SECRET="supersecretjwtkey"
ADMIN_EMAIL="admin@apexrecovery.com"
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

### Auth
- `POST /api/auth/register` - Register new user (with profile image and onboarding answers)
- `POST /api/auth/login` - Login user
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user (requires auth)

### Chat
- `POST /api/chat` - Send message to AI advisor
- `GET /api/chat/history` - Get user's chat history (requires auth)

### Data
- `POST /api/data/checkin` - Submit check-in data (requires auth)
- `GET /api/data/checkins` - Get user's check-in history (requires auth)

### Blogs
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)
- `DELETE /api/blogs/:id` - Delete blog (admin only)

### Admin (requires admin authentication)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user (toggle admin status)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics