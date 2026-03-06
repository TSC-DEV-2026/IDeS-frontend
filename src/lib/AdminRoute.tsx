import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchMe } from "@/lib/session";

export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let alive = true;

    (async () => {
      const me = await fetchMe();
      if (!alive) return;

      setIsAdmin(Boolean(me?.pessoa?.adm));
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
