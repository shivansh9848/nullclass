# Twilio WhatsApp Sandbox Setup Guide

This guide will help you set up Twilio WhatsApp Sandbox for **free** password reset functionality in your NullClass application. The WhatsApp Sandbox allows you to test WhatsApp messaging without any cost.

## Why Twilio WhatsApp Sandbox?

- ✅ **Completely FREE** for development and testing
- ✅ No per-message charges
- ✅ Better user experience with WhatsApp messaging
- ✅ Rich message formatting with emojis
- ✅ Higher delivery rates compared to SMS
- ✅ Users don't need to share phone numbers publicly

## Prerequisites

- A Twilio account (free to create)
- A WhatsApp-enabled phone number
- Internet connection for WhatsApp

## Step 1: Create Twilio Account

1. Go to [Twilio Console](https://console.twilio.com)
2. Sign up for a free account
3. Verify your email and phone number
4. Complete the account setup

## Step 2: Access WhatsApp Sandbox

1. In your Twilio Console, navigate to:
   **Develop > Messaging > Try it out > Send a WhatsApp message**
   
   Direct link: [WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)

2. You'll see the sandbox settings with:
   - **Sandbox Number**: `+1 415 523 8886`
   - **Join Code**: A unique code like `join <your-code>`

## Step 3: Join the Sandbox

1. Open WhatsApp on your phone
2. Send a message to `+1 415 523 8886`
3. Send the exact join code shown in your Twilio console (e.g., `join orange-apple`)
4. You'll receive a confirmation message from Twilio

## Step 4: Get Your Credentials

1. In Twilio Console, go to **Account > Keys & Credentials**
2. Copy your:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click the eye icon to reveal)

## Step 5: Configure Environment Variables

1. Open your `server/.env` file
2. Add your Twilio credentials:

```bash
# Twilio WhatsApp Configuration
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your_auth_token_here
```

3. Save the file

## Step 6: Test the Setup

1. Open terminal in the server directory
2. Run the test script:

```bash
node testWhatsApp.js
```

3. Follow the instructions to test sending messages

## Phone Number Format

For WhatsApp messages, use international format:
- ✅ `+919876543210` (India)
- ✅ `+15551234567` (US)
- ✅ `+447911123456` (UK)
- ❌ `9876543210` (will be automatically converted to +91 prefix)

## Testing Messages

### For Testing OTP:
1. Uncomment the OTP test section in `testWhatsApp.js`
2. Replace the phone number with your WhatsApp number (with country code)
3. Run: `node testWhatsApp.js`
4. Check your WhatsApp for the OTP message

### For Testing Password Reset:
1. Use the forgot password feature on your website
2. Enter your phone number (with or without country code)
3. Check WhatsApp for the OTP or new password

## Message Format

Your users will receive formatted WhatsApp messages like:

### OTP Message:
```
🔐 Your OTP for password reset is: *123456*

This OTP is valid for 10 minutes. Do not share this with anyone.

- NullClass Team
```

### New Password Message:
```
🔑 Your new password is: *AbCdEfGhIj*

⚠️ Please change this password after logging in.
This password is valid for 24 hours.

- NullClass Team
```

## Important Notes

### Sandbox Limitations:
- Only pre-registered phone numbers can receive messages
- Each phone number must join the sandbox individually
- Messages have "Sandbox" prefix
- Limited to 5 phone numbers in the sandbox

### For Production:
- Upgrade to a paid Twilio account
- Apply for WhatsApp Business API approval
- No sandbox limitations
- Professional messaging experience

## Troubleshooting

### Common Issues:

1. **"Phone number not registered in sandbox"**
   - Make sure you've sent the join code to the Twilio sandbox number
   - Wait for confirmation message before testing

2. **"Invalid credentials"**
   - Double-check your Account SID and Auth Token
   - Ensure no extra spaces in .env file

3. **"Message failed to send"**
   - Verify the phone number format (include country code)
   - Check if the number is still active in sandbox

4. **"WhatsApp service not configured"**
   - Ensure TWILIO_SID and TWILIO_TOKEN are set in .env
   - Restart your server after adding credentials

### Testing Commands:

```bash
# Test WhatsApp configuration
node testWhatsApp.js

# Test with your phone number (edit the file first)
# Uncomment test sections and add your number
node testWhatsApp.js
```

## Security Best Practices

1. **Keep credentials secure**:
   - Never commit .env files to version control
   - Use different credentials for development/production

2. **Validate phone numbers**:
   - Always validate phone number format
   - Use international format for better reliability

3. **Rate limiting**:
   - Implement rate limiting for password reset requests
   - Prevent spam and abuse

## Additional Features

### Rich Message Formatting:
- Use **bold text** with asterisks: `*bold*`
- Use _italic text_ with underscores: `_italic_`
- Add emojis for better user experience: 🔐 🔑 ⚠️

### Message Templates:
You can customize message templates in `server/utils/smsService.js`:

```javascript
// Custom OTP message
const otpMessage = `🔐 Your OTP: *${otp}*\n\nValid for 10 minutes.\n\n- ${process.env.APP_NAME || 'NullClass'}`;
```

## Upgrading to Production

When ready for production:

1. **Apply for WhatsApp Business API**:
   - Submit business verification
   - Get approved message templates
   - Remove sandbox limitations

2. **Update configuration**:
   - Use production credentials
   - Remove sandbox phone number
   - Implement proper message templates

3. **Monitor usage**:
   - Track message delivery rates
   - Monitor costs and usage
   - Implement proper error handling

## Support Links

- [Twilio Console](https://console.twilio.com)
- [WhatsApp Sandbox Documentation](https://www.twilio.com/docs/whatsapp/sandbox)
- [Twilio WhatsApp API Documentation](https://www.twilio.com/docs/whatsapp/api)
- [Message Templates Guide](https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates)

---

## Quick Start Checklist

- [ ] Create Twilio account
- [ ] Access WhatsApp Sandbox
- [ ] Send join code to sandbox number
- [ ] Get Account SID and Auth Token
- [ ] Add credentials to .env file
- [ ] Test with `node testWhatsApp.js`
- [ ] Test password reset flow
- [ ] Customize message templates (optional)

**Your Twilio WhatsApp Sandbox is now ready for free password reset messaging!** 🎉
