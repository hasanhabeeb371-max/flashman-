
import React, { useState, useMemo } from 'react';
import { User, FoodItem, Order, ShopConfig } from '../types';
import { ShoppingCart, Clock, History, LogOut, Package, CheckCircle, Flame, Plus, Zap } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  foodItems: FoodItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  shopConfig: ShopConfig;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, foodItems, orders, setOrders, shopConfig }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'history' | 'tracking'>('menu');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const userOrders = useMemo(() => 
    orders.filter(o => o.userId === user.email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, user.email]
  );

  const activeOrders = useMemo(() => 
    userOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing'),
    [userOrders]
  );

  const isShopOpen = useMemo(() => {
    if (!shopConfig.isOpen) return false;
    const now = new Date();
    const [openH, openM] = shopConfig.openTime.split(':').map(Number);
    const [closeH, closeM] = shopConfig.closeTime.split(':').map(Number);
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;
    return currentTime >= openTime && currentTime <= closeTime;
  }, [shopConfig]);

  const addToCart = (id: string) => {
    if (!isShopOpen) return;
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id]--;
      else delete updated[id];
      return updated;
    });
  };

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = foodItems.find(f => f.id === id);
      return sum + (item?.price || 0) * (qty as number);
    }, 0);
  }, [cart, foodItems]);

  const placeOrder = (customCart?: { [key: string]: number }) => {
    const finalCart = customCart || cart;
    if (Object.keys(finalCart).length === 0) return;
    
    const items = Object.entries(finalCart).map(([id, qty]) => {
      const item = foodItems.find(f => f.id === id)!;
      return { foodId: id, name: item.name, quantity: qty as number, price: item.price };
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.email,
      userEmail: user.email,
      items,
      total,
      status: 'Placed',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [...prev, newOrder]);
    if (!customCart) setCart({});
    setActiveTab('tracking');
  };

  const buyNow = (id: string) => {
    if (!isShopOpen) return;
    // For Buy Now, we place an order for 1 of this item immediately
    placeOrder({ [id]: 1 });
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-white min-h-screen relative shadow-2xl">
      {/* Header */}
      <header className="p-6 bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">FLASH <span className="text-red-600">MAN</span></h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hey, {user.name}!</p>
          </div>
          <button onClick={onLogout} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        
        <div className={`flex items-center gap-3 p-3 rounded-2xl ${isShopOpen ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`p-2 rounded-full ${isShopOpen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            <Clock size={16} />
          </div>
          <div>
            <p className={`text-xs font-black uppercase tracking-widest ${isShopOpen ? 'text-green-700' : 'text-red-700'}`}>
              {isShopOpen ? 'Shop is Open' : 'Shop is Closed'}
            </p>
            <p className="text-[10px] font-medium text-gray-500">
              Operating Hours: {shopConfig.openTime} - {shopConfig.closeTime}
            </p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="p-6">
        {activeTab === 'menu' && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Flame className="text-red-600" size={20} fill="currentColor" />
              <h2 className="text-lg font-black tracking-tight uppercase">Hot Menu</h2>
            </div>
            {!isShopOpen && (
              <div className="bg-red-600 p-6 rounded-3xl text-white shadow-xl shadow-red-200">
                <p className="text-xl font-black mb-1 italic">Order Ahead?</p>
                <p className="text-sm opacity-90 leading-relaxed font-medium">The kitchen is currently resting. We'll be back at <span className="font-black underline">{shopConfig.openTime}</span> sharp!</p>
              </div>
            )}
            <div className="grid gap-8">
              {foodItems.filter(f => f.isAvailable).map(item => (
                <div key={item.id} className="group flex flex-col bg-white rounded-[32px] border border-gray-100 p-2 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="relative h-44 w-full rounded-[24px] overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                       <span className="text-white font-black italic text-xs">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        disabled={!isShopOpen}
                        onClick={() => addToCart(item.id)}
                        className="flex-1 bg-gray-50 hover:bg-black hover:text-white text-black py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50"
                      >
                        <Plus size={14} strokeWidth={3} />
                        Add to Cart
                      </button>
                      <button 
                        disabled={!isShopOpen}
                        onClick={() => buyNow(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-red-200 disabled:opacity-50 italic"
                      >
                        <Zap size={14} fill="white" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black tracking-tight uppercase">Track Orders</h2>
            {activeOrders.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400 font-bold italic">No active orders found</p>
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="bg-black text-white p-6 rounded-3xl shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Order ID: {order.id}</p>
                      <h3 className="text-lg font-black italic">Cooking in progress...</h3>
                    </div>
                    <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic">
                      {order.status}
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs font-medium text-gray-300">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400">TOTAL PAID</span>
                    <span className="text-xl font-black text-red-500">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black tracking-tight uppercase">Order History</h2>
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {order.status === 'Completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900">Order #{order.id}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-600">${order.total.toFixed(2)}</p>
                    <p className={`text-[10px] font-black uppercase ${order.status === 'Completed' ? 'text-green-500' : 'text-gray-400'}`}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer (Sticky Footer) */}
      {Object.keys(cart).length > 0 && activeTab === 'menu' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-30 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-black rounded-3xl p-5 shadow-2xl flex items-center justify-between border-t border-red-600/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-red-900/40 animate-pulse">
                {(Object.values(cart) as number[]).reduce((a, b) => (a as number) + (b as number), 0)}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Price</p>
                <p className="text-lg text-white font-black">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={() => placeOrder()}
              className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-colors uppercase tracking-tight italic transform active:scale-95"
            >
              Order Now
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 flex justify-around items-center p-4 z-40 h-20">
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'menu' ? 'text-red-600' : 'text-gray-400'}`}
        >
          <ShoppingCart size={22} className={`${activeTab === 'menu' ? 'fill-red-600' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'tracking' ? 'text-red-600' : 'text-gray-400'}`}
        >
          <Package size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">Track</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 group transition-colors ${activeTab === 'history' ? 'text-red-600' : 'text-gray-400'}`}
        >
          <History size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">History</span>
        </button>
      </nav>
    </div>
  );
};

export default UserDashboard;
