import { useEffect } from "react";
import { CanvasLayer, Button, Navbar, Toolbar } from "./components";
import axios from "axios";
import { useCommits } from "./store";
import { useAuth } from "./hooks";
import Callback from "./Callback";
import { getApiBase } from "./lib";

export default function App() {
  const { setCommits, setDays } = useCommits();
  const {
    token,
    isLoading: authLoading,
    error: authError,
    login,
    logout,
  } = useAuth();
  // const [error, setError] = useState(false);

  const { year } = useCommits()

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCommits = async () => {
      try {
        const res = await axios.get(`${getApiBase()}/commits?year=${year}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const total =
          res.data.totalCommits ??
          res.data.totalContributions ??
          res.data.total ??
          0;
        setCommits(total);
        setDays(res.data.days ?? null);
      } catch (error) {
        // setError(true);
        console.error("Fronted error fetching commits:", error);
      }
    };
    fetchCommits();
  }, [token, setCommits, setDays, year]);

  if (window.location.pathname === "/callback") {
    return <Callback isLoading={authLoading} error={authError} token={token} />;
  }

  // const displayText = () => {
  //   if (authLoading) {
  //     return "Signing you in...";
  //   }
  //   if (authError) {
  //     return "Auth failed";
  //   }
  //   if (!token) {
  //     return "Connect GitHub to see your commits";
  //   }
  //   if (error) {
  //     return "Error loading stats";
  //   }
  //   if (commits === null) {
  //     return "Counting commits...";
  //   }
  //   return commits.toLocaleString();
  // };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 pointer-events-auto">
        {!token ? (
          <Button
            type="button"
            onClick={login}
            className="px-4 py-2 text-sm font-mono text-black bg-white rounded cursor-pointer z-10"
          >
            Sign in with GitHub
          </Button>
        ) : (
          <div className="flex flex-col items-center w-full h-full ">
            {/* <span className="text-white text-lg font-mono">
              {displayText()}
            </span> */}
            <Navbar Logout={logout} />
            <div className="absolute inset-0 pointer-events-none">
              <CanvasLayer />
            </div>
            <Toolbar />
          </div>
        )}
      </div>
    </div>
  );
}
