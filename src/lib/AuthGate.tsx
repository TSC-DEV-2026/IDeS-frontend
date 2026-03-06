import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchMe } from "@/lib/session";

export default function AuthGate() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const me = await fetchMe();
        if (!mounted) return;
        setOk(!!me);
      } catch {
        if (!mounted) return;
        setOk(false);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!ok) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}