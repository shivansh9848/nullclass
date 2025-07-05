# NullClass - Stack Overflow Clone

A full-stack Q&A platform inspired by Stack Overflow, built with React, Node.js, Express, and MongoDB.

## Features

### 🔐 User Authentication
- Email/password registration and login
- JWT-based authentication
- OTP verification for secure operations
- Login history and session management
- Password reset functionality

### 💬 Q&A System
- Ask and answer questions
- Upvote/downvote questions and answers
- Tag-based categorization
- Video upload support for questions
- Real-time search functionality

### 🌐 Public Space
- Social media-like feed
- Create posts with images and videos
- Like, comment, and share posts
- Friend system with posting restrictions
- Media upload with Cloudinary integration

### 👥 User Management
- User profiles with statistics
- Points and reputation system
- Leaderboard functionality
- Friend connections

### 🌍 Internationalization
- Multi-language support (English, Spanish, French, Hindi, Portuguese, Chinese)
- Dynamic language switching
- Localized content and UI

### 📱 Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Modern UI with smooth animations

## Tech Stack

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Navigation
- **React i18next** - Internationalization
- **CSS3** - Styling with responsive design
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Media storage
- **Multer** - File upload handling
- **Nodemailer** - Email service

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account for media uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nullclass.git
   cd nullclass
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URL=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # SMS Configuration (optional)
   FAST2SMS_API_KEY=your_fast2sms_api_key
   TWILIO_SID=your_twilio_sid
   TWILIO_TOKEN=your_twilio_token
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the development servers**
   
   Backend:
   ```bash
   cd server
   npm start
   ```
   
   Frontend:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
nullclass/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── reducers/      # Redux reducers
│   │   ├── actions/       # Redux actions
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controller/       # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/login-history` - Get login history

### Questions
- `GET /questions` - Get all questions
- `POST /questions/ask` - Create new question
- `PATCH /questions/vote/:id` - Vote on question
- `DELETE /questions/delete/:id` - Delete question

### Answers
- `POST /answer/post/:id` - Post answer
- `PATCH /answer/vote/:id` - Vote on answer
- `DELETE /answer/delete/:id` - Delete answer

### Posts (Public Space)
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Users
- `GET /user/getallusers` - Get all users
- `PATCH /user/update/:id` - Update user profile

## Deployment

### Frontend (Vercel)
The client is configured for Vercel deployment with:
- Build output directory: `build`
- Redirects configuration in `vercel.json`

### Backend (Vercel)
The server is configured for Vercel deployment with:
- Serverless functions
- Environment variables configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help getting started, please open an issue or contact the maintainers.

## Acknowledgments

- Inspired by Stack Overflow's user experience
- Built with modern web technologies
- Community-driven development approach
