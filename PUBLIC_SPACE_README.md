# Public Space Feature

## Overview
The Public Space is a social media-like feature that allows users to connect with each other by sharing posts with pictures, videos, comments, likes, and shares. The feature includes a friend system with posting restrictions based on the number of friends.

## Features

### 🎯 Core Features
- **Post Creation**: Users can create posts with text content and upload images/videos
- **Media Support**: Support for multiple images and videos per post (up to 5 files, 50MB each)
- **Social Interactions**: Like, comment, and share posts
- **Friend System**: Add friends, manage friend requests, and view friend suggestions
- **Posting Restrictions**: Smart posting limits based on friend count

### 📊 Posting Rules
- **No Friends**: Cannot post anything
- **1-2 Friends**: Can post 1-2 times per day respectively
- **3-10 Friends**: Can post 1 time per day
- **More than 10 Friends**: Can post multiple times per day (unlimited)

### 🔐 Authentication
- All posting and social features require user authentication
- JWT-based authentication with automatic logout on token expiration

## Technical Implementation

### Backend Structure
```
server/
├── models/
│   ├── Post.js          # Post model with media, likes, comments, shares
│   ├── Friend.js        # Friend relationship model
│   └── auth.js          # User model (existing)
├── controller/
│   ├── Post.js          # Post CRUD operations and interactions
│   └── Friend.js        # Friend management operations
├── routes/
│   ├── post.js          # Post-related API endpoints
│   └── friend.js        # Friend-related API endpoints
└── config/
    └── cloudinary.js    # Cloudinary configuration for file uploads
```

### Frontend Structure
```
client/src/pages/PublicSpace/
├── PublicSpace.jsx      # Main public space component
├── PublicSpace.css      # Main styling
├── CreatePost.jsx       # Post creation form
├── CreatePost.css       # Post creation styling
├── PostList.jsx         # List of posts
├── PostList.css         # Post list styling
├── PostItem.jsx         # Individual post component
├── PostItem.css         # Post item styling
├── FriendsSidebar.jsx   # Friends management sidebar
└── FriendsSidebar.css   # Friends sidebar styling
```

## API Endpoints

### Post Endpoints
- `GET /api/posts` - Get all public posts (paginated)
- `POST /api/posts` - Create a new post (with file upload)
- `GET /api/posts/status` - Get current user's posting status
- `GET /api/posts/user/:userId` - Get posts by specific user
- `POST /api/posts/:postId/like` - Like/unlike a post
- `POST /api/posts/:postId/comment` - Add comment to post
- `POST /api/posts/:postId/share` - Share a post
- `DELETE /api/posts/:postId` - Delete a post

### Friend Endpoints
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept/:requestId` - Accept friend request
- `DELETE /api/friends/reject/:requestId` - Reject friend request
- `GET /api/friends/pending` - Get pending friend requests
- `GET /api/friends` - Get friends list
- `GET /api/friends/count` - Get friends count
- `GET /api/friends/suggestions` - Get friend suggestions
- `DELETE /api/friends/:friendId` - Remove friend

## Usage

### Accessing Public Space
1. Navigate to `/PublicSpace` in the application
2. Users must be logged in to interact with posts
3. The main page shows all public posts in chronological order

### Creating Posts
1. Click on the create post area at the top
2. Write your content (max 1000 characters)
3. Optionally attach images/videos (max 5 files, 50MB each)
4. Click "Post" to publish

### Managing Friends
1. Use the Friends sidebar to:
   - View current friends
   - Accept/reject friend requests
   - Browse friend suggestions
   - Send friend requests

### Posting Restrictions
- The system automatically checks your friend count
- Posting status is displayed in the create post section
- Users without friends cannot post
- Daily limits reset at midnight

## File Upload Configuration
- **Supported formats**: Images (JPEG, PNG, GIF), Videos (MP4, WebM, MOV, AVI)
- **File size limit**: 50MB per file
- **Max files per post**: 5
- **Storage**: Cloudinary cloud storage (with automatic optimization)
- **CDN**: Global content delivery network for fast loading
- **Auto-optimization**: Images automatically optimized for web delivery

## Security Features
- JWT authentication required for all social interactions
- File type validation to prevent malicious uploads
- User authorization checks for post deletion
- SQL injection protection through Mongoose ODM

## Mobile Responsive
- Fully responsive design for mobile and tablet devices
- Touch-friendly interface
- Optimized media display for different screen sizes
- Collapsible sidebar for mobile navigation

## Future Enhancements
- [ ] Real-time notifications for likes, comments, and friend requests
- [ ] Advanced post filtering and search
- [ ] User tagging in posts
- [ ] Post editing functionality
- [ ] Privacy settings for posts
- [ ] Report and moderation system
- [ ] Video thumbnail generation
- [ ] Advanced media transformations

## Dependencies

### Backend
- `multer` - File upload handling
- `multer-storage-cloudinary` - Cloudinary storage for multer
- `cloudinary` - Cloud storage and media optimization
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `express` - Web framework

### Frontend
- `react` - UI framework
- `react-router-dom` - Client-side routing
- `redux` - State management
- `moment` - Date formatting
- `axios` - HTTP client

## Environment Variables
Make sure to set up the following environment variables:
```
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

For detailed Cloudinary setup instructions, see [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md).

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables
3. Start the server: `npm run dev`
4. Start the client: `npm start`
5. Navigate to `/PublicSpace` in your browser
