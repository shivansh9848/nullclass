// API configuration utility
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function to create full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function for fetch requests with auth
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("Profile")
    ? JSON.parse(localStorage.getItem("Profile")).token
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
