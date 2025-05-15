// Toast Types
export type ToastPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  position?: ToastPosition;
  duration?: number;
}

// User Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  memberSince: string;
  colorScheme: string;
  groups?: UserGroup[];
}

export interface UserGroup {
  name: string;
  color: string;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  colorScheme: string;
  createdAt: string;
}

// Event Types
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description?: string;
  attendees?: number;
}

// Court Types
export interface Court {
  id: number;
  name: string;
  location: string;
  courtType: string;
  status: string;
  capacity: number;
  amenities: string[];
}

// Availability Types
export interface Availability {
  id: number;
  courtName: string;
  day: string;
  startTime: string;
  endTime: string;
  assignedTo: string;
  status: string;
}

// Static Page Types
export interface StaticPage {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  lastUpdated: string;
  author: string;
  content?: string;
}

// Rating Types
export interface Rating {
  id: number;
  entityName: string;
  entityType: string;
  rating: number;
  reviewCount: number;
  lastRated: string;
  categories: Record<string, number>;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  recipients: string;
  sentAt: string;
  status: string;
  readCount: number;
  totalRecipients: number;
}

// Theme Types
export interface ThemeSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  reduceMotion: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeCourts: number;
  eventsToday: number;
  averageRating: number;
  userGrowth: number;
  courtUtilization: number;
  eventChange: number;
  ratingChange: number;
}
