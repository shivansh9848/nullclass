# Stack Overflow Clone

A full-stack Stack Overflow clone built with React.js (frontend) and Node.js (backend). Features include user authentication, question/answer posting, voting, commenting, user profiles, and real-time updates.

## 🚀 Features

- **User Authentication**: Login, signup, JWT-based authentication
- **Question Management**: Ask, edit, delete questions
- **Answer System**: Post answers, mark as accepted
- **Voting System**: Upvote/downvote questions and answers
- **Comments**: Add comments to questions and answers
- **User Profiles**: View and edit user profiles
- **Search**: Search questions and answers
- **Tags**: Categorize questions with tags
- **Responsive Design**: Mobile-friendly interface
- **Internationalization**: Multi-language support
- **Real-time Updates**: Live notifications and updates

## 🛠️ Tech Stack

### Frontend
- React.js 19.1.0
- Redux for state management
- React Router for navigation
- Axios for API calls
- FontAwesome for icons
- i18next for internationalization

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- Nodemailer for email services
- Twilio for SMS services
- Multer for file handling

## 📁 Project Structure

```
nullclass/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── actions/        # Redux actions
│   │   ├── reducers/       # Redux reducers
│   │   └── api/           # API configuration
│   └── public/            # Static files
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── deployment files      # Docker, Vercel, etc.
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nullclass
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `server` and `client` directories:
   
   **Server (.env)**
   ```env
   MONGODB_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```
   
   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the React app for production
- `npm run start` - Start the production server
- `npm run install-all` - Install dependencies for both frontend and backend

### Client Directory
- `npm start` - Start the React development server
- `npm run build` - Build the React app for production
- `npm test` - Run tests

### Server Directory
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## 🚀 Deployment

The application is ready for deployment on various platforms. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options

1. **Vercel** (Recommended)
   ```bash
   vercel --prod
   ```

2. **Netlify**
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `client/build`

3. **Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

4. **Docker**
   ```bash
   docker-compose up --build
   ```

## 🔐 Environment Variables

### Required Server Variables
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary configuration for image uploads
- `EMAIL_*` - Email service configuration
- `TWILIO_*` - SMS service configuration (optional)

### Required Client Variables
- `REACT_APP_API_URL` - Backend API URL

## 🌟 Features in Detail

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- User session management

### Question & Answer System
- CRUD operations for questions and answers
- Rich text support
- Image uploads via Cloudinary
- Voting and rating system

### User Management
- User profiles with statistics
- User reputation system
- Follow/unfollow functionality
- Activity tracking

### Search & Filtering
- Full-text search
- Tag-based filtering
- Sort by date, votes, activity
- Advanced search filters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- See [Issues](https://github.com/your-repo/issues) for current known issues

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ by [Your Name]

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
