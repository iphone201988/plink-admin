import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import uiReducer from "@/store/slices/uiSlice";
import { apis } from "@/api";

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  [apis.reducerPath]: apis.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;