import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ToastPosition } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
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
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getGradientByVariant = (variant: string) => {
    switch (variant) {
      case "destructive":
        return "from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50";
      case "success":
        return "from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50";
      default:
        return "from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50";
    }
  };

  return (
    <div className={`toast-container fixed flex flex-col gap-3 z-50 pointer-events-none ${getPositionClasses()}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              toast-notification
              bg-gradient-to-r ${getGradientByVariant(toast.variant || "default")}
              backdrop-blur-md
              border ${toast.variant === "destructive" ? "border-red-200 dark:border-red-700" : toast.variant === "success" ? "border-green-200 dark:border-green-700" : "border-blue-200 dark:border-blue-700"}
              shadow-xl rounded-xl p-4 flex items-start space-x-3 w-80
              transform transition-all duration-300 pointer-events-auto
              hover:shadow-2xl
  `}
>
  <motion.div
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 0.5 }}
    className={`flex-shrink-0 p-2 rounded-full bg-opacity-20 ${toast.variant === "destructive" ? "bg-red-500" : toast.variant === "success" ? "bg-green-500" : "bg-blue-500"}`}
  >
    {getIconByVariant(toast.variant || "default")}
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white drop-shadow-sm">
                {toast.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
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