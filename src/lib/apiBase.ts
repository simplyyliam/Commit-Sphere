export const getApiBase = (): string => {
  const base =
    import.meta.env.VITE_API_BASE ??
    import.meta.env.VITE_BACKEND_API_BASE;
  return base?.trim()
    ? base
    : "http://localhost:3000";
};
