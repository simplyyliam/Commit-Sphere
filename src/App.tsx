import { useEffect, useState } from "react";
import { CanvasLayer } from "./components";
import axios from "axios";
import { useCommits } from "./store/useCommits";
import { useAuth } from "./hook/useAuth";
import Callback from "./Callback";
import { Button } from "./components/ui/button";

const getApiBase = () => {
  const base = import.meta.env.VITE_API_BASE as string | undefined;
  return base && base.trim().length > 0 ? base : "http://localhost:3000";
};

export default function App() {
  const { commits, setCommits } = useCommits();
  const { token, isLoading: authLoading, error: authError, login, logout } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCommits = async () => {
      try {
        const res = await axios.get(`${getApiBase()}/commits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API RESPONSE:", res.data);
        setCommits(res.data.totalCommits ?? res.data.totalContributions ?? 0);
      } catch (error) {
        setError(true);
        console.error("Fronted error fetching commits:", error);
      }
    };
    fetchCommits();
  }, [token, setCommits]);

  if (window.location.pathname === "/callback") {
    return <Callback isLoading={authLoading} error={authError} token={token} />;
  }

  const displayText = () => {
    if (authLoading) {
      return "Signing you in...";
    }
    if (authError) {
      return "Auth failed";
    }
    if (!token) {
      return "Connect GitHub to see your commits";
    }
    if (error) {
      return "Error loading stats";
    }
    if (commits === null) {
      return "Counting commits...";
    }
    return commits.toLocaleString();
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <CanvasLayer />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 pointer-events-auto">
        <span className="text-white text-2xl font-mono">{displayText()}</span>
        {!token ? (
          <Button
            type="button"
            onClick={login}
            className="px-4 py-2 text-sm font-mono text-black bg-white rounded cursor-pointer z-10"
          >
            Sign in with GitHub
          </Button>
        ) : (
          <Button
            type="button"
            onClick={logout}
            className="px-4 py-2 text-sm text-white border border-white rounded z-10 cursor-pointer"
          >
            Sign out
          </Button>
        )}
      </div>
    </div>
  );
}