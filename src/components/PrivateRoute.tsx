import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) return null;

  return <>{children}</>;
}