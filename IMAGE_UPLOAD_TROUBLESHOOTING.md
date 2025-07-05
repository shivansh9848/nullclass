# Image Upload Issues in Public Space - Troubleshooting Guide

## Common Issues and Solutions

### 1. Images Not Displaying After Upload

**Symptoms:**
- Posts are created successfully but images don't appear
- Console shows "Image failed to load" errors
- Media URLs are generated but not accessible

**Possible Causes & Solutions:**

#### A. Cloudinary Configuration Issues
- **Check:** Ensure Cloudinary credentials are properly set in server/.env
- **Verify:** CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- **Test:** Use the diagnostic panel to verify Cloudinary connection

#### B. File Upload Processing Issues
- **Check:** Multer middleware is properly configured
- **Verify:** Files are being received by the server
- **Check:** Console logs during upload process

#### C. Image URL Issues
- **Check:** URLs are properly formatted (https://res.cloudinary.com/...)
- **Verify:** Cloudinary folder permissions
- **Test:** Try accessing URLs directly in browser

### 2. File Upload Fails Silently

**Symptoms:**
- No error messages shown
- Files selected but not uploaded
- Posts created without media

**Solutions:**

#### A. Check File Validation
- **File types:** Only JPEG, PNG, GIF, MP4, WebM allowed
- **File size:** Maximum 50MB per file
- **File count:** Maximum 5 files per post

#### B. Check Network Issues
- **CORS:** Ensure server allows file uploads
- **Network:** Check for network connectivity issues
- **Timeout:** Large files may timeout

#### C. Check Authentication
- **Token:** Ensure valid JWT token is present
- **Permissions:** User must have posting permissions

### 3. Server-Side Upload Errors

**Symptoms:**
- Server returns 500 errors
- Cloudinary upload fails
- Console shows upload errors

**Solutions:**

#### A. Environment Variables
```bash
# Check server/.env file
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### B. Cloudinary Account Issues
- **Quota:** Check if Cloudinary quota is exceeded
- **Permissions:** Verify upload permissions in Cloudinary console
- **Plan:** Ensure account plan supports required features

#### C. Server Configuration
- **Memory:** Ensure sufficient memory for file processing
- **Timeout:** Configure appropriate timeout values
- **Dependencies:** Verify all required packages are installed

## Diagnostic Steps

1. **Use Diagnostic Panel:**
   - Go to Public Space
   - Click "Show Diagnostic"
   - Review all diagnostic information

2. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check network requests

3. **Check Server Logs:**
   - Look for file upload logs
   - Check Cloudinary upload status
   - Review error messages

4. **Test Direct Upload:**
   - Use diagnostic panel to test Cloudinary connection
   - Try uploading a small test image
   - Verify URL accessibility

## Quick Fixes

### For Users:
1. **Refresh the page** after uploading
2. **Try smaller file sizes** (under 10MB)
3. **Use common image formats** (JPEG, PNG)
4. **Check internet connection** stability

### For Developers:
1. **Restart the server** after config changes
2. **Clear browser cache** and cookies
3. **Check .env file** for missing variables
4. **Verify Cloudinary credentials** in console

## Prevention Tips

1. **Regular Monitoring:**
   - Monitor Cloudinary usage and quotas
   - Check server logs regularly
   - Test image uploads periodically

2. **User Guidance:**
   - Provide clear file size limits
   - Show upload progress indicators
   - Display helpful error messages

3. **Error Handling:**
   - Implement proper error boundaries
   - Add retry mechanisms for failed uploads
   - Log all upload attempts for debugging

## When to Contact Support

- Cloudinary account issues
- Persistent server errors
- Network connectivity problems
- Quota or billing issues

Remember to always test in a development environment before deploying fixes to production.
