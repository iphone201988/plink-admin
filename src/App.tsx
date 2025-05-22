import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationModal } from "@/components/notifications/NotificationModal";

function App() {
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
