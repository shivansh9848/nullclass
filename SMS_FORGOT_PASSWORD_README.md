# WhatsApp-Based Forgot Password Feature

## Overview
The WhatsApp-based forgot password feature allows users to reset their password using their mobile phone number via **Twilio WhatsApp Sandbox** service. This provides an alternative to email-based password reset with a modern, free messaging solution.

## Features

### ✅ Two-Step Verification Process
1. **Step 1**: User enters phone number → OTP sent via WhatsApp
2. **Step 2**: User enters OTP → New password sent via WhatsApp

### ✅ Security Features
- **Rate Limiting**: One password reset per day (24 hours)
- **OTP Expiration**: OTP valid for 10 minutes only
- **Secure Password Generation**: 10-character random password (letters only)
- **Phone Number Validation**: Validates Indian phone numbers (10 digits, starts with 6-9)

### ✅ User Experience
- **Dual Options**: Users can choose between Email or SMS reset
- **Modern UI**: Clean, responsive interface with emoji icons
- **Real-time Feedback**: Loading states, success/error messages
- **Cross-Navigation**: Easy switching between email and SMS options

## API Endpoints

### POST /api/auth/forgot-password-sms
Send OTP to user's phone number for password reset.

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your phone number successfully.",
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
  "message": "User not found with the provided phone number"
}
```

### POST /api/auth/verify-otp-reset
Verify OTP and reset password.

**Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Your new password has been sent to your phone number.",
  "success": true
}
```

**Error Response (400) - Invalid OTP:**
```json
{
  "message": "Invalid OTP. Please check and try again."
}
```

**Error Response (400) - Expired OTP:**
```json
{
  "message": "OTP has expired. Please request a new OTP."
}
```

## Frontend Components

### 1. ForgotPassword.jsx
- Main component showing both email and SMS options
- Route: `/forgot-password`
- Provides option selection interface

### 2. ForgotPasswordEmail.jsx
- Email-based password reset (existing functionality)
- Route: `/forgot-password-email`
- Maintains backward compatibility

### 3. ForgotPasswordSMS.jsx
- SMS-based password reset (new feature)
- Route: `/forgot-password-sms`
- Two-step process: Phone input → OTP verification

## Backend Implementation

### Database Schema Updates
```javascript
// Added to user model
{
  lastPasswordResetRequestSMS: { type: Date },
  smsOTP: { type: String },
  smsOTPExpires: { type: Date }
}
```

### New Controller Functions
- `forgotPasswordSMS()`: Validates phone, generates OTP, sends SMS
- `verifyOTPAndResetPassword()`: Verifies OTP, generates new password, sends SMS

### SMS Service (utils/smsService.js)
- `sendOTP()`: Sends OTP via Twilio WhatsApp Sandbox
- `sendNewPasswordSMS()`: Sends new password via SMS
- `validatePhoneNumber()`: Validates Indian phone numbers
- `generateOTP()`: Generates 6-digit OTP

## Environment Configuration

Add to your `.env` file:
```env
```bash
# Twilio WhatsApp Configuration
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
```
```

## Twilio WhatsApp Integration

### WhatsApp Message Templates

**OTP Message:**
```
🔐 Your OTP for password reset is: *123456*

This OTP is valid for 10 minutes. Do not share this with anyone.

- NullClass Team
```

**New Password Message:**
```
🔑 Your new password is: *AbCdEfGhIj*

⚠️ Please change this password after logging in.
This password is valid for 24 hours.

- NullClass Team
```

### API Configuration
- **Service**: Twilio WhatsApp API
- **Sandbox Number**: `+1 415 523 8886`
- **Message Format**: Rich text with emojis and markdown-style formatting
- **Authentication**: Account SID + Auth Token
- **Phone Format**: International E.164 format

## Security Considerations

### ✅ Rate Limiting
- One password reset per day per phone number
- Prevents abuse and spam

### ✅ OTP Security
- 6-digit random OTP
- 10-minute expiration
- Single-use only

### ✅ Password Security
- 10-character random password
- Uppercase and lowercase letters only
- Auto-generated, no user input

### ✅ Data Protection
- OTP cleared after use
- No sensitive data logged
- Phone number validation

## Testing

### Unit Tests
- Phone number validation
- OTP generation and verification
- Rate limiting functionality
- SMS service integration

### Integration Tests
- End-to-end password reset flow
- Error handling scenarios
- Rate limiting enforcement

## Usage Instructions

### For Users
1. Go to login page
2. Click "Forgot Password"
3. Choose "Reset via SMS"
4. Enter your 10-digit phone number
5. Enter the 6-digit OTP received
6. Check SMS for new password
7. Login with new password
8. Change password in profile settings

### For Developers
1. Set up Twilio account (free)
2. Join WhatsApp Sandbox
3. Get Account SID and Auth Token from Twilio Console
4. Add credentials to environment variables
5. Install dependencies: `npm install twilio`
6. Test with `node testWhatsApp.js`
7. Deploy and test

## Error Handling

### Common Errors
- Invalid phone number format
- User not found
- Rate limit exceeded
- OTP expired/invalid
- SMS service unavailable

### Error Messages
- User-friendly messages
- Clear action instructions
- Consistent error formatting

## Monitoring

### Metrics to Track
- SMS success/failure rates
- OTP verification success rates
- Password reset completion rates
- API response times

### Logging
- SMS API calls
- OTP generation events
- Password reset attempts
- Error occurrences

## Future Enhancements

### Potential Features
- Multi-language SMS support
- Custom OTP length configuration
- SMS template customization
- Analytics dashboard
- Bulk SMS notifications

### Security Improvements
- Two-factor authentication
- Biometric verification
- Advanced fraud detection
- IP-based restrictions

## Troubleshooting

### Common Issues
1. **SMS not received**: Check phone number format, network coverage
2. **OTP expired**: Request new OTP within 10 minutes
3. **Rate limit**: Wait 24 hours before next request
4. **Invalid credentials**: Verify Twilio configuration

### Debug Steps
1. Check server logs for SMS API responses
2. Verify phone number format
3. Test with different phone numbers
4. Check Twilio account status and sandbox setup
5. Validate environment variables

## Support

For issues or questions:
1. Check server logs
2. Verify Twilio account and sandbox status
3. Test API connectivity
4. Review error messages
5. Contact development team

---

**Note**: This feature requires a valid FAST2SMS account and API key. Make sure to test thoroughly in development before deploying to production.
