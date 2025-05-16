import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ToastPosition } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  console.log("toasts con", toasts);

  const [position, setPosition] = useState<ToastPosition>("topRight");

  useEffect(() => {
    const customPositionToast: any = toasts.find((toast: any) => toast.position !== undefined);
    if (customPositionToast?.position) {
      setPosition(customPositionToast.position);
    }
  }, [toasts]);

  const getPositionClasses = (): string => {
    switch (position) {
      case "topLeft":
        return "top-4 left-4";
      case "topRight":
        return "top-4 right-4";
      case "bottomLeft":
        return "bottom-4 left-4";
      case "bottomRight":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const getIconByVariant = (variant: string) => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-danger" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className={`toast-container fixed flex flex-col gap-2 z-50 pointer-events-none ${getPositionClasses()}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="toast-notification bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-start space-x-3 w-72 transform transition-transform duration-300 pointer-events-auto"
          >
            <div className={`flex-shrink-0 bg-${toast.variant === "destructive" ? "danger" : toast.variant === "success" ? "success" : "primary"}-100 dark:bg-${toast.variant === "destructive" ? "danger" : toast.variant === "success" ? "success" : "primary"}-900/30 p-2 rounded-full`}>
              {getIconByVariant(toast.variant || "default")}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-textDark dark:text-white">{toast.title}</h4>
              <p className="text-xs text-textLight dark:text-gray-400">{toast.description}</p>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-textLight hover:text-textDark dark:text-gray-400 dark:hover:text-white"
              tabIndex={0}
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
