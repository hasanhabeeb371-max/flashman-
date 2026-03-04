
import React, { useState, useMemo } from 'react';
import { User, FoodItem, Order, ShopConfig } from '../types';
import { ShoppingCart, History, LogOut, Package, CheckCircle, Flame, XCircle, AlertCircle } from 'lucide-react';

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
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const userOrders = useMemo(() => 
    orders.filter(o => o.userId === user.email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, user.email]
  );

  const activeOrders = useMemo(() => 
    userOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing'),
    [userOrders]
  );

  const isShopOpen = shopConfig.isOpen;

  const addToCart = (id: string) => {
    if (!isShopOpen) return;
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum: number, [id, qty]) => {
      const item = foodItems.find(f => f.id === id);
      return sum + (item?.price || 0) * (qty as number);
    }, 0);
  }, [cart, foodItems]);

  const placeOrder = () => {
    if (Object.keys(cart).length === 0) return;
    const items = Object.entries(cart).map(([id, qty]) => {
      const item = foodItems.find(f => f.id === id)!;
      return { foodId: id, name: item.name, quantity: qty as number, price: item.price };
    });
    const total = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user.email,
      userEmail: user.email,
      items,
      total,
      status: 'Placed',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    setCart({});
    setActiveTab('tracking');
  };

  const confirmCancel = () => {
    if (cancelConfirmId) {
      setOrders(prev => prev.map(o => o.id === cancelConfirmId ? { ...o, status: 'Cancelled' } : o));
      setCancelConfirmId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white relative w-full overflow-x-hidden">
      {/* Small Vertical Sidebar on the Left */}
      <nav className="fixed left-0 top-0 h-full w-14 sm:w-20 bg-white border-r border-gray-50 flex flex-col items-center py-6 sm:py-10 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-10 sm:mb-16">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-xl flex items-center justify-center rotate-6 shadow-lg shadow-red-50">
            <span className="text-black text-lg sm:text-xl font-black italic -rotate-6">F</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-10 flex-1">
          {[
            { id: 'menu', icon: ShoppingCart, label: 'Menu' },
            { id: 'tracking', icon: Package, label: 'Orders' },
            { id: 'history', icon: History, label: 'History' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === item.id ? 'text-red-600 scale-110' : 'text-gray-200 hover:text-black'}`}
              title={item.label}
            >
              <item.icon size={18} sm:size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
              <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[0.1em] leading-none ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button onClick={onLogout} title="Logout" className="mt-auto p-2 text-gray-200 hover:text-red-600 transition-colors">
          <LogOut size={18} sm:size={20} />
        </button>
      </nav>

      {/* Main Content Area - Shifted Right */}
      <div className="flex-1 ml-14 sm:ml-20 flex flex-col min-h-screen">
        <header className="px-4 py-3 sm:px-10 sm:py-5 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-50 flex justify-between items-center w-full">
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl font-black italic tracking-tighter leading-none">FLASH <span className="text-red-600">MAN</span></h1>
            <p className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hi, {user.name}!</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${isShopOpen ? 'text-green-500 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              {isShopOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-10 sm:py-12 space-y-8 lg:space-y-12 pb-32">
          {activeTab === 'menu' && (
            <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="text-red-600" size={16} sm:size={20} fill="currentColor" />
                <h2 className="text-[10px] sm:text-[12px] font-black uppercase italic tracking-[0.3em] text-gray-300">Available Now</h2>
              </div>
              
              {foodItems.filter(f => f.isAvailable).length === 0 ? (
                <div className="text-center py-24 sm:py-40 bg-gray-50/50 rounded-[40px] sm:rounded-[80px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-300 font-black italic text-lg tracking-widest uppercase">The menu is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {foodItems.filter(f => f.isAvailable).map(item => (
                    <div key={item.id} className="bg-white rounded-[40px] border border-gray-50 p-3 shadow-sm transition-all hover:border-red-600/10 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group">
                      <div className="relative h-44 sm:h-52 w-full rounded-[32px] overflow-hidden bg-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-2xl shadow-xl">
                           <span className="text-black font-black italic text-xs sm:text-sm tracking-tighter">₹{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="p-5 sm:p-7 flex flex-col gap-5 sm:gap-7 flex-1">
                        <div className="text-center">
                          <h3 className="text-xl sm:text-2xl font-black text-black leading-tight mb-2 uppercase italic tracking-tighter">{item.name}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-medium leading-relaxed line-clamp-2 px-2">{item.description}</p>
                        </div>
                        <button 
                          disabled={!isShopOpen}
                          onClick={() => addToCart(item.id)}
                          className="mt-auto w-full bg-red-600 text-white py-4 sm:py-5 rounded-[24px] sm:rounded-[28px] font-black uppercase text-[10px] sm:text-[11px] tracking-widest transition-all shadow-xl shadow-red-50 active:scale-95 disabled:opacity-20 hover:bg-black"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] mb-6 text-gray-300">Tracking Orders</h2>
              {activeOrders.length === 0 ? (
                <div className="text-center py-24 sm:py-40 bg-gray-50/50 rounded-[40px] sm:rounded-[80px] border-2 border-dashed border-gray-100">
                  <Package className="mx-auto text-gray-200 mb-6" size={40} sm:size={50} />
                  <p className="text-gray-300 font-black italic text-sm uppercase tracking-[0.2em]">No active orders</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeOrders.map(order => (
                    <div key={order.id} className="bg-white p-8 sm:p-12 rounded-[50px] sm:rounded-[70px] shadow-sm border border-gray-100 flex flex-col ring-1 ring-gray-50">
                      <div className="flex justify-between items-start mb-8 sm:mb-10">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black/40">ID: #{order.id}</span>
                        <div className="bg-red-600 text-white px-4 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase italic animate-pulse shadow-xl shadow-red-50">{order.status}</div>
                      </div>
                      <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12 pl-6 sm:pl-8 border-l-4 border-red-600/10 flex-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <p className="text-sm sm:text-base font-black text-black">{item.quantity}x {item.name}</p>
                            <span className="text-[10px] sm:text-[12px] font-black text-gray-300 uppercase">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-end justify-between pt-8 sm:pt-10 border-t border-gray-50">
                        <div>
                          <p className="text-[9px] sm:text-[11px] text-gray-300 font-black uppercase tracking-widest mb-2 sm:mb-3">Total Amount</p>
                          <p className="text-4xl sm:text-5xl font-black text-black italic tracking-tighter leading-none">₹{order.total.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => setCancelConfirmId(order.id)}
                          className="bg-gray-50 hover:bg-black hover:text-white text-gray-400 py-3 px-8 sm:py-4 sm:px-10 rounded-[24px] sm:rounded-[30px] text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-all italic border border-transparent shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-in slide-in-from-left-4 duration-300">
              <h2 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] mb-6 text-gray-300">Past Orders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-50 p-6 sm:p-8 rounded-[40px] sm:rounded-[50px] flex items-center justify-between hover:border-black transition-all group">
                    <div className="flex items-center gap-5 sm:gap-7">
                      <div className={`p-4 sm:p-5 rounded-3xl ${order.status === 'Completed' ? 'bg-green-50 text-green-600' : order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-300'}`}>
                        {order.status === 'Completed' ? <CheckCircle size={22} /> : order.status === 'Cancelled' ? <XCircle size={22} /> : <AlertCircle size={22} />}
                      </div>
                      <div>
                        <p className="text-[11px] sm:text-[13px] font-black italic text-black uppercase tracking-tighter group-hover:text-red-600 transition-colors">ORDER-{order.id}</p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-black text-black tracking-tighter">₹{order.total.toFixed(2)}</p>
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'text-green-500' : 'text-red-600'}`}>{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Responsive Floating Checkout Panel */}
      {Object.keys(cart).length > 0 && activeTab === 'menu' && (
        <div className="fixed bottom-6 right-6 left-20 sm:left-auto sm:right-10 sm:bottom-10 z-[60] animate-in slide-in-from-right-10 duration-500">
          <div className="bg-black text-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/5">
            <div className="flex items-center gap-5 sm:gap-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 rounded-[24px] sm:rounded-[28px] flex items-center justify-center text-black font-black text-xl sm:text-2xl shadow-xl shadow-red-900/40">
                {Object.values(cart).reduce((a: number, b: number) => a + b, 0)}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-[11px] text-white/40 font-black uppercase tracking-[0.3em] mb-1">Estimated Total</p>
                <p className="text-3xl sm:text-4xl text-white font-black italic tracking-tighter leading-none">₹{cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={placeOrder}
              className="w-full sm:w-auto bg-white text-black px-10 py-5 sm:px-14 sm:py-6 rounded-[24px] sm:rounded-[32px] font-black text-[12px] sm:text-[14px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 italic shadow-2xl"
            >
              Finish Order
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal Responsive */}
      {cancelConfirmId && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white max-w-sm w-full p-12 sm:p-16 rounded-[60px] sm:rounded-[80px] text-center shadow-[0_50px_100px_rgba(0,0,0,0.08)] animate-in zoom-in duration-300 border border-gray-50">
            <div className="w-20 h-20 sm:w-24 h-24 bg-red-50 text-red-600 rounded-[32px] sm:rounded-[48px] flex items-center justify-center mx-auto mb-10 sm:mb-12">
              <XCircle size={44} sm:size={52} />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black italic mb-4 text-black uppercase tracking-tighter">Wait!</h3>
            <p className="text-sm sm:text-base text-gray-400 font-medium mb-12 sm:mb-16 leading-relaxed px-6">Are you sure you want to cancel this order?</p>
            <div className="grid grid-cols-2 gap-5 sm:gap-7">
              <button onClick={() => setCancelConfirmId(null)} className="py-5 sm:py-6 bg-gray-50 text-gray-400 rounded-[24px] sm:rounded-[32px] font-black uppercase text-[11px] sm:text-[12px] tracking-widest hover:text-black transition-all">No, keep it</button>
              <button onClick={confirmCancel} className="py-5 sm:py-6 bg-red-600 text-white rounded-[24px] sm:rounded-[32px] font-black uppercase text-[11px] sm:text-[12px] tracking-widest shadow-2xl shadow-red-50 transform active:scale-95 transition-all">Yes, cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
