export const getApiBase = (): string => {
  const base = import.meta.env.VITE_API_BASE as string | undefined;
  return base && base.trim().length > 0 ? base : "http://localhost:3000";
};
