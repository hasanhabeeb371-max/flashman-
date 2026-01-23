
export type OrderStatus = 'Placed' | 'Preparing' | 'Completed' | 'Cancelled';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: {
    foodId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  name?: string;
}

export interface ShopConfig {
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isOpen: boolean;
}
