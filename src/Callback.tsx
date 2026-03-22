import { useEffect } from "react";

type CallbackProps = {
  isLoading: boolean;
  error: string | null;
  token: string | null;
};

export default function Callback({ isLoading, error, token }: CallbackProps) {
  useEffect(() => {
    if (token) {
      window.location.replace("/");
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
        Finishing sign in...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
        Auth failed. Try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
      Redirecting...
    </div>
  );
}