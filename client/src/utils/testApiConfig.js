// Test script to verify API configuration
import { getApiUrl, API_BASE_URL } from "./apiConfig";

console.log("API Configuration Test");
console.log("======================");
console.log(
  "Environment Variable (REACT_APP_API_URL):",
  process.env.REACT_APP_API_URL
);
console.log("API Base URL:", API_BASE_URL);
console.log("");
console.log("Sample API URLs:");
console.log("- Users API:", getApiUrl("user/getallusers"));
console.log("- Questions API:", getApiUrl("questions/get"));
console.log("- Auth API:", getApiUrl("api/auth/login"));
console.log("- Posts API:", getApiUrl("api/posts"));

// Test function to verify API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(getApiUrl("user/getallusers"));
    if (response.ok) {
      console.log("✅ API connection successful");
      return true;
    } else {
      console.log(
        "❌ API connection failed:",
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.log("❌ API connection error:", error.message);
    return false;
  }
};
