export type Role = 'member' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  mockPassword: string;
}

// The user object we keep in the app (never includes the password)
export type AuthUser = Omit<User, 'mockPassword'>;

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number; // timestamp in milliseconds
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastSurface = 'light' | 'dark';
export type ToastDuration = 'short' | 'normal' | 'long' | 'persistent';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: ToastDuration;
  surface?: ToastSurface;
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
  action?: ToastAction;
  duration: ToastDuration;
  surface: ToastSurface;
}

export type ClassCategoryName = 'Yoga' | 'HIIT' | 'Spin' | 'Pilates' | 'Boxing' | 'Zumba';

export interface ScrollTargetState {
  scrollTo?: string; // id of the section to scroll to after navigating
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CategoryFilter = ClassCategoryName | 'All';
export type LevelFilter = ClassLevel | 'All';
export type SortOption = 'soonest' | 'duration' | 'spots' | 'price';

// One record exactly as it is stored in public/data/instructors.json
export interface Instructor {
  id: number;
  name: string;
  years: number;
  specialty: ClassCategoryName;
}

// One record exactly as it is stored in public/data/classes.json
export interface ClassRecord {
  id: number;
  title: string;
  category: ClassCategoryName;
  level: ClassLevel;
  instructor: string;
  instructorYears: number;
  dayOffset: number; // days from today, turned into a real date by classService
  startTime: string; // 24-hour "HH:MM"
  durationMins: number;
  room: string;
  capacity: number;
  spotsLeft: number;
  price: number;
  rating: number;
  reviews: number;
  description: string;
}

export interface FitnessClass extends Omit<ClassRecord, 'dayOffset'> {
  date: string; // ISO date, "YYYY-MM-DD"
}

export interface ClassFilters {
  search: string;
  category: CategoryFilter;
  level: LevelFilter;
  sort: SortOption;
  page: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
export type DialogTone = 'primary' | 'warning' | 'danger';
export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'light' | 'danger' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BookingStatus = 'Confirmed' | 'Cancelled';

export interface Booking {
  id: number;
  userId: number; // the signed-in member who owns this booking
  classId: number;
  memberName: string;
  email: string;
  spots: number;
  bookingDate: string; // ISO timestamp
  status: BookingStatus;
}

export interface BookingRequest {
  userId: number;
  classId: number;
  memberName: string;
  email: string;
  spots: number;
}

// One record exactly as stored in public/data/bookings.json
export interface BookingRecord {
  id: number;
  userId: number;
  classId: number;
  memberName: string;
  email: string;
  spots: number;
  bookedDaysAgo: number; // turned into a real date by bookingService
  status: BookingStatus;
}

export interface BookingWithClass extends Booking {
  fitnessClass: FitnessClass;
}

export type BookingDisplayStatus = 'confirmed' | 'completed' | 'cancelled';
export type BookingTab = 'upcoming' | 'past';

export interface BookingStats {
  upcomingTotal: number;
  upcomingThisWeek: number;
  completedTotal: number;
  completedLast30Days: number;
  streakWeeks: number;
}

export interface ClassInput {
  title: string;
  category: ClassCategoryName;
  level: ClassLevel;
  instructor: string;
  room: string;
  date: string; // ISO date, "YYYY-MM-DD"
  startTime: string; // 24-hour "HH:MM"
  durationMins: number;
  capacity: number;
  price: number;
  description: string;
}