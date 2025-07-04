# Deployment Guide

This guide explains how to deploy the Stack Overflow clone application to various platforms.

## Prerequisites

- Node.js (v18+)
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account (for image uploads)
- Email service (Gmail recommended)

## Environment Variables

### Server (.env)
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-jwt-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
NODE_ENV=production
```

### Client (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

## Deployment Options

### 1. Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### 2. Netlify

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `client/build`
4. Set environment variables in Netlify dashboard

### 3. Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

### 4. Railway

1. Connect your Git repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### 5. DigitalOcean App Platform

1. Connect your Git repository
2. Set environment variables
3. Configure build and run commands

### 6. Docker

1. Build: `docker-compose build`
2. Run: `docker-compose up`
3. Deploy to any Docker-compatible platform

## Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Cloudinary configuration verified
- [ ] Email service configured
- [ ] Frontend API URL updated
- [ ] Build process tested locally
- [ ] CORS configured for production domain
- [ ] Security headers added
- [ ] SSL certificate configured

## Local Development

1. Install dependencies: `npm run install-all`
2. Start development: `npm run dev`
3. Build for production: `npm run build`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Check connection string and IP whitelist
2. **CORS Error**: Update CORS configuration for production domain
3. **Build Failures**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required variables are set

### Logs

- Check application logs in your deployment platform
- Monitor MongoDB Atlas logs
- Check Cloudinary upload logs

## Production Optimization

- Enable compression
- Use CDN for static assets
- Implement caching strategies
- Monitor performance metrics
- Set up error tracking (Sentry)
- Configure analytics

## Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use secure JWT secrets
- Regular security updates
- Monitor for vulnerabilities
