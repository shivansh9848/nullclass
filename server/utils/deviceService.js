import {UAParser} from "ua-parser-js";

// Device detection utility
export const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    os: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
    platform: result.cpu.architecture || "Unknown",
    device: result.device.type || "desktop",
    deviceModel: result.device.model || "Unknown",
    deviceVendor: result.device.vendor || "Unknown",
    isMobile: result.device.type === "mobile",
    isTablet: result.device.type === "tablet",
    isDesktop: !result.device.type || result.device.type === "desktop",
  };
};

// Check if current time is within allowed mobile access hours (10 AM to 1 PM)
export const isMobileAccessAllowed = () => {
  const now = new Date();
  const currentHour = now.getHours();

  // Allow access between 10 AM (10) and 1 PM (13) - 13 is exclusive
  return currentHour >= 10 && currentHour < 13;
};

// Check if browser is Chrome (for OTP requirement)
export const isChromeBasedBrowser = (browserName) => {
  const chromeBrowsers = [
    "chrome",
    "chromium",
    "edge",
    "brave",
    "opera",
    "vivaldi",
  ];
  return chromeBrowsers.some((browser) =>
    browserName.toLowerCase().includes(browser)
  );
};

// Check if browser is Microsoft Edge (for no authentication requirement)
export const isMicrosoftEdgeBrowser = (browserName) => {
  return browserName.toLowerCase().includes("edge");
};

// Generate session ID
export const generateSessionId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Get client IP address from request
export const getClientIpAddress = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    req.ip ||
    "127.0.0.1"
  );
};

// Generate numeric OTP for login verification
export const generateLoginOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Validate login timing for mobile devices
export const validateMobileLoginTime = (deviceInfo) => {
  if (!deviceInfo.isMobile) {
    return { allowed: true, message: "Desktop access allowed" };
  }

  const isAllowed = isMobileAccessAllowed();
  if (!isAllowed) {
    return {
      allowed: false,
      message: "Mobile access is only allowed between 10:00 AM and 1:00 PM",
    };
  }

  return { allowed: true, message: "Mobile access within allowed hours" };
};

// Determine authentication requirement based on browser
export const getAuthRequirement = (browserName) => {
  if (isMicrosoftEdgeBrowser(browserName)) {
    return {
      requiresOTP: false,
      requiresAuth: false,
      reason: "Microsoft Edge browser - no additional authentication required",
    };
  }

  if (isChromeBasedBrowser(browserName)) {
    return {
      requiresOTP: true,
      requiresAuth: true,
      reason: "Chrome-based browser - OTP verification required",
    };
  }

  return {
    requiresOTP: false,
    requiresAuth: true,
    reason: "Other browser - standard authentication required",
  };
};

// Clean up old login history (keep last 50 entries)
export const cleanupLoginHistory = (loginHistory) => {
  if (loginHistory.length > 50) {
    return loginHistory.slice(-50);
  }
  return loginHistory;
};

// Check if user has too many failed OTP attempts
export const checkOTPAttempts = (user) => {
  const maxAttempts = 5;
  const timeWindow = 24 * 60 * 60 * 1000; // 24 hours

  if (user.loginOTPAttempts >= maxAttempts) {
    const lastAttempt = user.lastLoginOTPRequest;
    if (lastAttempt && Date.now() - lastAttempt.getTime() < timeWindow) {
      return {
        blocked: true,
        message: "Too many OTP attempts. Please try again after 24 hours.",
        hoursLeft: Math.ceil(
          (timeWindow - (Date.now() - lastAttempt.getTime())) / (60 * 60 * 1000)
        ),
      };
    } else {
      // Reset attempts if 24 hours have passed
      return { blocked: false, reset: true };
    }
  }

  return { blocked: false };
};

// Format device info for display
export const formatDeviceInfo = (deviceInfo) => {
  const device =
    deviceInfo.device === "desktop"
      ? "Desktop"
      : deviceInfo.device === "mobile"
      ? "Mobile"
      : deviceInfo.device === "tablet"
      ? "Tablet"
      : "Unknown";

  return {
    ...deviceInfo,
    displayName: `${deviceInfo.browser} on ${deviceInfo.os} (${device})`,
    shortName: `${deviceInfo.browser} - ${device}`,
  };
};

// Check if IP address is suspicious (basic implementation)
export const checkSuspiciousIP = (ipAddress, user) => {
  // Get last 10 login IPs
  const recentIPs = user.loginHistory
    .slice(-10)
    .map((login) => login.ipAddress)
    .filter((ip) => ip && ip !== "127.0.0.1");

  // If this IP has been used before, it's not suspicious
  if (recentIPs.includes(ipAddress)) {
    return { suspicious: false, reason: "Known IP address" };
  }

  // If user has very few login records, don't flag as suspicious
  if (user.loginHistory.length < 3) {
    return { suspicious: false, reason: "New user account" };
  }

  // If all recent logins are from localhost, don't flag as suspicious
  if (recentIPs.length === 0 || recentIPs.every((ip) => ip === "127.0.0.1")) {
    return { suspicious: false, reason: "Local development environment" };
  }

  return {
    suspicious: true,
    reason: "Login from new IP address",
    recommendation: "Consider additional verification",
  };
};
