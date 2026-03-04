
import React, { useState, useEffect } from 'react';
import { User, FoodItem, Order, ShopConfig } from './types';
import { INITIAL_FOOD_ITEMS, DEFAULT_SHOP_CONFIG } from './constants';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Lazy initializers to prevent race conditions with localStorage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('flashman_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('flashman_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('flashman_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [shopConfig, setShopConfig] = useState<ShopConfig>(() => {
    const saved = localStorage.getItem('flashman_shop');
    return saved ? JSON.parse(saved) : DEFAULT_SHOP_CONFIG;
  });

  // Handle splash screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sync state to localStorage whenever it changes
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
