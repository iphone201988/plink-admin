import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarCollapsed: boolean;
  notificationModalOpen: boolean;
  toastPosition: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  currentTheme: "light" | "dark" | "system";
}

const initialState: UIState = {
  sidebarCollapsed: false,
  notificationModalOpen: false,
  toastPosition: "topRight",
  currentTheme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleNotificationModal: (state) => {
      state.notificationModalOpen = !state.notificationModalOpen;
    },
    setNotificationModalState: (state, action: PayloadAction<boolean>) => {
      state.notificationModalOpen = action.payload;
    },
    setToastPosition: (state, action: PayloadAction<"topLeft" | "topRight" | "bottomLeft" | "bottomRight">) => {
      state.toastPosition = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.currentTheme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarState,
  toggleNotificationModal,
  setNotificationModalState,
  setToastPosition,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
