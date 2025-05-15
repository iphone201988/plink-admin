import { nanoid } from "nanoid";
import { ToastProps, ToastPosition } from "@/types";

interface Toast extends ToastProps {
  id: string;
  position?: ToastPosition;
}

interface ToastManagerState {
  toasts: Toast[];
}

type ToastManagerAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast> & { id: string } };

const TOAST_LIMIT = 5;
let subscribers: Array<(state: ToastManagerState) => void> = [];
let state: ToastManagerState = { toasts: [] };

export const toastManager = {
  subscribe(callback: (state: ToastManagerState) => void) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((sub) => sub !== callback);
    };
  },
  
  dispatch(action: ToastManagerAction) {
    switch (action.type) {
      case "ADD_TOAST":
        state = {
          toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
        };
        break;
      
      case "DISMISS_TOAST":
        state = {
          toasts: state.toasts.filter((t) => t.id !== action.id),
        };
        break;
      
      case "UPDATE_TOAST":
        state = {
          toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          ),
        };
        break;
    }
    
    subscribers.forEach((sub) => sub(state));
  },
  
  getState() {
    return state;
  },
};

interface ShowToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  position?: ToastPosition;
  duration?: number;
}

export function showToast(options: ShowToastOptions) {
  const { title, description = "", variant = "default", position, duration = 5000 } = options;
  
  const id = nanoid();
  const newToast: Toast = { id, title, description, variant, position };
  
  toastManager.dispatch({ type: "ADD_TOAST", toast: newToast });
  
  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      toastManager.dispatch({ type: "DISMISS_TOAST", id });
    }, duration);
  }
  
  return id;
}

export function dismissToast(id: string) {
  toastManager.dispatch({ type: "DISMISS_TOAST", id });
}

export function updateToast(id: string, options: Partial<Omit<Toast, "id">>) {
  toastManager.dispatch({
    type: "UPDATE_TOAST",
    toast: { id, ...options },
  });
}
