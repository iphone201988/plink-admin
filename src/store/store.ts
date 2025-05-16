import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import uiReducer from "@/store/slices/uiSlice";
import { apis } from "@/api";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    [apis.reducerPath]: apis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apis.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
