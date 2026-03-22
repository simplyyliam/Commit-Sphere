import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const TOKEN_KEY = "github_access_token";
const STATE_KEY = "github_oauth_state";

const getApiBase = () => {
  const base = import.meta.env.VITE_API_BASE as string | undefined;
  return base && base.trim().length > 0 ? base : "http://localhost:3000";
};

const getRedirectUri = () => {
  const envRedirect = import.meta.env.VITE_GITHUB_REDIRECT_URI as string | undefined;
  if (envRedirect && envRedirect.trim().length > 0) {
    return envRedirect;
  }
  return `${window.location.origin}/callback`;
};

const generateState = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
};

type UseAuth = {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
};

export const useAuth = (): UseAuth => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRun = useRef(false);
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
  const apiBase = useMemo(() => getApiBase(), []);

  // LOGIN
  const login = useCallback(() => {
    if (!clientId) {
      setError("Missing VITE_GITHUB_CLIENT_ID");
      return;
    }

    const state = generateState();
    sessionStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: getRedirectUri(),
      scope: "read:user repo", // add scopes if needed
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  }, [clientId]);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setError(null);
  }, []);

  // OAUTH CALLBACK HANDLER
  useEffect(() => {
    if (hasRun.current) return; // prevent double execution in Strict Mode
    hasRun.current = true;

    const search = new URLSearchParams(window.location.search);
    const code = search.get("code");
    const returnedState = search.get("state");

    if (!code) return;

    const expectedState = sessionStorage.getItem(STATE_KEY);
    if (!expectedState) {
      // weird edge case: sessionStorage missing state → do nothing
      return;
    }
    if (returnedState !== expectedState) {
      setError("OAuth state mismatch");
      return;
    }

    const exchange = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.post(`${apiBase}/github/token`, { code });
        const accessToken = res.data?.access_token as string | undefined;

        if (!accessToken) {
          setError("No access token returned");
          setIsLoading(false);
          return;
        }

        // ✅ Save token and clear state
        localStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.removeItem(STATE_KEY);

        setToken(accessToken);
        setError(null); // clear any previous authError

        // clean URL
        const cleanedUrl = new URL(window.location.href);
        cleanedUrl.searchParams.delete("code");
        cleanedUrl.searchParams.delete("state");
        window.history.replaceState({}, document.title, cleanedUrl.toString());
      } catch (err) {
        console.error("OAuth exchange failed", err);
        setError("OAuth exchange failed");
      } finally {
        setIsLoading(false);
      }
    };

    exchange();
  }, [apiBase]);

  return useMemo(
    () => ({ token, isLoading, error, login, logout }),
    [token, isLoading, error, login, logout]
  );
};