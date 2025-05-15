import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationModal } from "@/components/notifications/NotificationModal";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.user);

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      // For now, we'll skip redirection for demo purposes
      // navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Outlet />
        </Layout>
        <NotificationModal />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
