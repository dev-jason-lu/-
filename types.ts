
export enum DishCategory {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  DESSERT = 'Dessert',
  DRINK = 'Drink',
  SNACK = 'Snack'
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: DishCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  imageUrl?: string; // URL or base64
  tags: string[];
  isFavorite: boolean;
}

export interface Order {
  id: string;
  dishId: string;
  dishName: string;
  orderDate: number; // Timestamp
  scheduledTime?: string; // ISO string or formatted time
  status: 'Pending' | 'Cooking' | 'Served' | 'Completed';
  rating?: number; // 1-5
  review?: string;
  chefNote?: string; // Note from the partner cooking
  chef: string; // Name of the partner
  rewardEarned?: number;
}

export interface Memory {
  id: string;
  orderId: string;
  imageUrl?: string;
  note: string;
  date: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  description: string;
  redeemedCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isLoading?: boolean;
}

export type ThemeColor = 'rose' | 'blue' | 'emerald' | 'violet';

export interface AppTheme {
  id: ThemeColor;
  name: string;
  primary: string; // bg-rose-500
  secondary: string; // bg-rose-100
  text: string; // text-rose-600
  gradient: string; // from-rose-400 to-pink-500
  border: string; // border-rose-200
  shadow: string; // shadow-rose-200
}

export interface UserProfile {
  name: string;
  partnerName: string;
  avatar?: string;
  startDate: number; // Relationship start date
}

export enum ViewState {
  MENU = 'MENU',
  ORDER = 'ORDER',
  CHEF_AI = 'CHEF_AI',
  MEMORIES = 'MEMORIES',
  STORE = 'STORE',
  SETTINGS = 'SETTINGS'
}
