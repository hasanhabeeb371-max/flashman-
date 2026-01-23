
import React, { useState, useEffect } from 'react';
import { User, FoodItem, Order, ShopConfig } from './types';
import { INITIAL_FOOD_ITEMS, DEFAULT_SHOP_CONFIG } from './constants';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopConfig, setShopConfig] = useState<ShopConfig>(DEFAULT_SHOP_CONFIG);

  // Initialize data from LocalStorage or Defaults
  useEffect(() => {
    const savedItems = localStorage.getItem('flashman_items');
    const savedOrders = localStorage.getItem('flashman_orders');
    const savedShop = localStorage.getItem('flashman_shop');
    const savedUser = localStorage.getItem('flashman_user');

    if (savedItems) setFoodItems(JSON.parse(savedItems));
    else {
      setFoodItems(INITIAL_FOOD_ITEMS);
      localStorage.setItem('flashman_items', JSON.stringify(INITIAL_FOOD_ITEMS));
    }

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedShop) setShopConfig(JSON.parse(savedShop));
    if (savedUser) setUser(JSON.parse(savedUser));

    // Simulate splash screen
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('flashman_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('flashman_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('flashman_shop', JSON.stringify(shopConfig));
  }, [shopConfig]);

  useEffect(() => {
    if (user) localStorage.setItem('flashman_user', JSON.stringify(user));
    else localStorage.removeItem('flashman_user');
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) return <SplashScreen />;

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-white text-black">
      {user.role === 'admin' ? (
        <AdminDashboard 
          user={user} 
          onLogout={handleLogout}
          foodItems={foodItems}
          setFoodItems={setFoodItems}
          orders={orders}
          setOrders={setOrders}
          shopConfig={shopConfig}
          setShopConfig={setShopConfig}
        />
      ) : (
        <UserDashboard 
          user={user} 
          onLogout={handleLogout}
          foodItems={foodItems}
          orders={orders}
          setOrders={setOrders}
          shopConfig={shopConfig}
        />
      )}
    </div>
  );
};

export default App;
