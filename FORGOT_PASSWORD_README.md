# Forgot Password Feature

## Overview
The forgot password feature allows users to request a new password when they forget their current one. This implementation follows strict security guidelines with rate limiting and secure password generation.

## Features

### ✅ User Request Limitations
- Users can only request a password reset **once per day (24 hours)**
- If they try to request again within 24 hours, they receive the message: "You can request password reset only once a day."

### ✅ Secure Password Generation
- New passwords are **10 characters long**
- Uses only **uppercase and lowercase letters** (A-Z, a-z)
- No numbers or special characters
- Each password is randomly generated

### ✅ Email Delivery
- New password is sent directly to the user's email
- Uses **Nodemailer** for email delivery
- Professional HTML email template
- Clear instructions for the user

### ✅ Database Security
- Password reset request timestamp stored in `lastPasswordResetRequest` field
- New password is properly hashed before storage
- Old reset tokens are cleared

## API Endpoints

### POST /api/auth/forgot-password
Request a new password via email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "A new password has been sent to your email address.",
  "success": true
}
```

**Error Response (400) - Rate Limited:**
```json
{
  "message": "You can request password reset only once a day."
}
```

**Error Response (404) - User Not Found:**
```json
{
  "message": "User not found with the provided email address"
}
```

## Environment Variables

Required environment variables for email functionality:

```env
# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=your_sender_email@gmail.com

# Database
CONNECTION_URL=mongodb://localhost:27017/nullclass

# JWT
JWT_SECRET=your_jwt_secret_here

# Client URL
CLIENT_URL=http://localhost:3000
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. **Use the App Password** (not your regular Gmail password) in `EMAIL_PASSWORD`

## Database Schema

The User model includes these fields for password reset functionality:

```javascript
{
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastPasswordResetRequest: { type: Date },  // Tracks when last reset was requested
  resetPasswordToken: { type: String },      // For other reset methods
  resetPasswordExpires: { type: Date },      // For other reset methods
}
```

## Security Features

### Rate Limiting
- Enforces 24-hour cooldown between password reset requests
- Prevents abuse and brute force attacks

### Password Security
- Generates cryptographically secure random passwords
- Uses only letters to avoid special character issues
- Passwords are immediately hashed before storage

### Email Security
- Emails contain clear security instructions
- Users are advised to change the password immediately
- Professional templates prevent phishing concerns

## Usage Flow

1. **User Request:** User enters email on forgot password page
2. **Validation:** System validates input and checks rate limits
3. **User Lookup:** System finds user by email
4. **Rate Check:** System checks if 24 hours have passed since last request
5. **Password Generation:** System generates new 10-character password
6. **Database Update:** New password is hashed and stored, timestamp updated
7. **Email Sent:** New password sent to user's email
8. **User Login:** User uses new password to log in
9. **Password Change:** User should change password in profile settings

## Testing

Run the password generation test:
```bash
cd server
node test-password-generation.js
```

This will verify that:
- Passwords are exactly 10 characters
- Passwords contain only letters (A-Z, a-z)
- Password generation is working correctly

## Error Handling

The implementation includes comprehensive error handling:

- **Input Validation:** Validates email format
- **User Existence:** Checks if user exists in database
- **Rate Limiting:** Enforces 24-hour cooldown period
- **Email Sending:** Handles email delivery failures gracefully
- **Database Errors:** Proper error logging and user feedback

## Development Mode

When email credentials are not configured, the system runs in development mode:
- Passwords are logged to console instead of being emailed
- All functionality works normally for testing
- No actual emails are sent

## Production Considerations

1. **Email Credentials:** Ensure EMAIL_USER and EMAIL_PASSWORD are properly configured
2. **Database Backups:** Regular backups recommended due to password changes
3. **Monitoring:** Monitor failed email deliveries and rate limit violations
4. **Security:** Consider additional security measures for high-traffic applications

## Client-Side Integration

The client-side forgot password component (`ForgotPassword.jsx`) automatically:
- Handles form submission
- Displays appropriate success/error messages
- Redirects to login after successful password reset
- Shows clear instructions to users

## Future Enhancements

Potential improvements for future versions:
- Email verification before password reset
- Admin dashboard for monitoring reset requests
- Custom password complexity requirements
- Multi-language email templates
