// Theme colors and values
export const themeColors = {
  light: {
    primary: "#0593fe",
    accent: "#c4ff00",
    secondary: "#f6f5f8",
    textDark: "#333333",
    textLight: "#8a8a8a",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    background: "#ffffff",
    card: "#ffffff",
    border: "#e5e7eb"
  },
  dark: {
    primary: "#0593fe",
    accent: "#c4ff00",
    secondary: "#1f2937",
    textDark: "#f3f4f6",
    textLight: "#9ca3af",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    background: "#111827",
    card: "#1f2937",
    border: "#374151"
  }
};

// Status colors
export const statusColors = {
  active: "success",
  suspended: "danger",
  pending: "warning",
  inactive: "gray"
};

// Badge color schemes for groups
export const groupColorSchemes = {
  tennis: {
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-primary dark:text-blue-300"
  },
  weekend: {
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-300"
  },
  pickle: {
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-300"
  }
};

// Default avatar color schemes
export const avatarColorSchemes = [
  "blue",
  "green",
  "yellow",
  "purple",
  "red",
  "pink",
  "indigo",
  "gray"
];

// Get a color scheme for a user based on their id or name
export function getUserColorScheme(userId: number | string): string {
  const id = typeof userId === "string" ? parseInt(userId, 10) : userId;
  return avatarColorSchemes[id % avatarColorSchemes.length];
}

// ThreeJS background color settings
export const threejsColors = {
  light: {
    background: 0xffffff,
    particle: 0x0593fe,
    accent: 0xc4ff00
  },
  dark: {
    background: 0x111827,
    particle: 0x0593fe,
    accent: 0xc4ff00
  }
};
