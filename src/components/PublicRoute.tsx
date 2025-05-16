import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && location.pathname !== "/admin/dashboard") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [token, navigate, location.pathname]);

  return <>{!token ? children : null}</>;
}