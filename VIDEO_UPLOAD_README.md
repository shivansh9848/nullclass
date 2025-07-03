# Video Upload Feature for Questions

This feature allows students to upload videos along with their questions, with proper authentication and time restrictions.

## Features

### 1. Video Upload
- Students can upload videos up to 2 minutes duration
- Maximum file size: 50MB
- Supported formats: MP4, MOV, AVI, and other video formats
- Videos are stored on Cloudinary for efficient delivery

### 2. Email OTP Verification
- Before uploading a video, users must verify their email with a 6-digit OTP
- OTP is sent via email and is valid for 10 minutes
- OTP verification is required for each video upload session

### 3. Time Restrictions
- Video uploads are only allowed between 2:00 PM and 7:00 PM daily
- Users will see a warning message outside these hours
- API endpoints enforce these restrictions on the backend

### 4. User Interface
- Drag and drop interface for video uploads
- Video preview before posting
- Progress indicators and loading states
- Responsive design for mobile devices

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the server directory with:
   ```
   # Email Configuration
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-gmail@gmail.com
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Cloudinary Setup**
   - Create a Cloudinary account at https://cloudinary.com
   - Get your cloud name, API key, and API secret
   - Add them to your `.env` file

4. **Gmail Setup for OTP**
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password for the application
   - Use the app password in EMAIL_PASSWORD

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## API Endpoints

### Video Upload
- `POST /questions/Ask/video` - Upload question with video
- Requires authentication token
- Checks time restrictions (2 PM - 7 PM)
- Validates video file size and duration

### OTP Verification
- `POST /api/send-otp` - Send OTP to user's email
- `POST /api/verify-otp` - Verify OTP code

## Usage

1. **Asking a Question with Video**
   - Navigate to Ask Question page
   - Fill in title, body, and tags
   - Upload video file (will trigger OTP verification)
   - Enter OTP sent to email
   - Submit question

2. **Viewing Questions with Videos**
   - Questions with videos show a video indicator
   - Video plays inline in the question details page
   - Video controls allow play/pause, volume, fullscreen

## Time Restrictions

The system enforces video upload restrictions:
- **Allowed Time**: 2:00 PM to 7:00 PM daily
- **Blocked Time**: 7:00 PM to 2:00 PM next day
- Time zones are based on server local time

## Security Features

1. **Authentication Required**: Users must be logged in
2. **OTP Verification**: Email verification for each video upload
3. **File Validation**: Only video files under 50MB and 2 minutes
4. **Time Restrictions**: Server-side enforcement of upload hours
5. **Cloudinary Security**: Videos stored securely on Cloudinary

## Technical Details

### Video Processing
- Videos are uploaded to Cloudinary with automatic optimization
- Uses multer with memory storage (no temporary files on disk)
- Cloudinary handles format conversion and streaming
- Videos are organized in a dedicated folder structure

### Modern Cloudinary Integration
- Uses cloudinary v2.x with upload_stream method
- Memory storage with multer (no disk storage needed)
- Direct buffer streaming to Cloudinary
- No dependency on deprecated multer-storage-cloudinary

### Implementation Details
```javascript
// Upload to Cloudinary using upload_stream
const uploadResult = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: "video",
      folder: "question_videos",
      public_id: `question_${Date.now()}`,
      transformation: [{ quality: "auto" }, { format: "mp4" }],
    },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
  
  // Stream the file buffer to Cloudinary
  uploadStream.end(req.file.buffer);
});
```

### OTP System
- 6-digit numeric OTP codes
- 10-minute expiration time
- In-memory storage (consider Redis for production)
- Email templates with proper styling

### Database Changes
- Question model updated with `videoUrl` and `videoPublicId` fields
- Backward compatible with existing questions

## Troubleshooting

### Common Issues

1. **Video Upload Fails**
   - Check file size (must be under 50MB)
   - Verify video duration (must be under 2 minutes)
   - Ensure time is between 2 PM - 7 PM

2. **OTP Not Received**
   - Check spam folder
   - Verify email configuration
   - Ensure Gmail app password is correct

3. **Time Restriction Issues**
   - Check server time zone
   - Ensure system clock is accurate

### Development Mode
- Email configuration is optional in development
- OTP codes are logged to console when email is not configured
- Video upload still works without email setup

## Browser Support
- Modern browsers with HTML5 video support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported
