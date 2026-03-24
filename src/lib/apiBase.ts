export const getApiBase = (): string => {
  // 1. Check if we are running on localhost
  const isLocal = 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";

  if (!isLocal && import.meta.env.VITE_BACKEND_API_BASE) {
    return import.meta.env.VITE_BACKEND_API_BASE;
  }

  return import.meta.env.VITE_API_BASE || "http://localhost:3000";
};