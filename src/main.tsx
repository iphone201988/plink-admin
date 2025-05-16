import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastContainer } from "@/components/ui/toast-container";
import { store } from "@/store/store";
import "./index.css";
import router from "./router";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  </Provider>
);
