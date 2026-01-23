
import { FoodItem, ShopConfig } from './types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Flash Burger',
    description: 'Double patty with secret spicy sauce and caramelized onions.',
    price: 8.99,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/burger/400/300',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Nitro Wings',
    description: 'Extra spicy chicken wings with blue cheese dip.',
    price: 12.50,
    category: 'Sides',
    image: 'https://picsum.photos/seed/wings/400/300',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Velocity Salad',
    description: 'Fresh greens, avocado, nuts and balsamic glaze.',
    price: 7.25,
    category: 'Healthy',
    image: 'https://picsum.photos/seed/salad/400/300',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Turbo Taco',
    description: 'Soft shell tacos with marinated beef and pico de gallo.',
    price: 5.99,
    category: 'Mains',
    image: 'https://picsum.photos/seed/taco/400/300',
    isAvailable: false,
  }
];

export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  openTime: '08:00',
  closeTime: '15:00',
  isOpen: true
};

export const COLORS = {
  primary: '#EF4444', // Red-500
  secondary: '#000000',
  bg: '#FFFFFF'
};
