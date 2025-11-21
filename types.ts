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
  chef: 'Partner A' | 'Partner B'; // Simplified for this demo
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isLoading?: boolean;
}

export enum ViewState {
  MENU = 'MENU',
  ORDER = 'ORDER',
  CHEF_AI = 'CHEF_AI',
  MEMORIES = 'MEMORIES',
  PROFILE = 'PROFILE'
}
