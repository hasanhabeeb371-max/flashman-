
import React, { useState, useMemo } from 'react';
import { User, FoodItem, Order, ShopConfig, OrderStatus } from '../types';
import { Settings, BarChart3, ListChecks, Plus, Trash2, Edit2, LogOut, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  foodItems: FoodItem[];
  setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  shopConfig: ShopConfig;
  setShopConfig: React.Dispatch<React.SetStateAction<ShopConfig>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, foodItems, setFoodItems, orders, setOrders, shopConfig, setShopConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'shop'>('orders');
  const [isAdding, setIsAdding] = useState(false);

  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => o.status === 'Completed' ? sum + o.total : sum, 0);
    const orderCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostOrdered = orders.flatMap(o => o.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    return { totalRev, orderCounts, mostOrdered };
  }, [orders]);

  const chartData = useMemo(() => {
    return Object.entries(stats.orderCounts).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const toggleAvailability = (id: string) => {
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      setFoodItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="w-full lg:w-72 bg-black text-white p-8 flex flex-col sticky top-0 lg:h-screen z-40">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center rotate-3">
             <span className="text-white text-xl font-black italic -rotate-3">F</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter">FLASH <span className="text-red-600">MAN</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'orders', label: 'Order Queue', icon: ListChecks },
            { id: 'menu', label: 'Menu Editor', icon: Edit2 },
            { id: 'analytics', label: 'Insights', icon: BarChart3 },
            { id: 'shop', label: 'Store Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${
                activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="px-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Admin Session</p>
            <p className="text-sm font-black text-red-500 truncate">{user.email}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-red-500 font-bold text-sm uppercase tracking-widest">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
        {/* Orders Queue Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Order Queue</h2>
                <p className="text-gray-500 font-medium">Real-time order management dashboard</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Live Updates On</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {orders.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-100">
                  <Clock className="mx-auto text-gray-200 mb-4" size={64} />
                  <p className="text-gray-400 font-bold text-xl">Queue is currently empty</p>
                </div>
              ) : (
                orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <div key={order.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow">
                    <div className="p-8 pb-4 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-red-600 font-black italic">#{order.id}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <h3 className="text-lg font-black">{order.userEmail.split('@')[0]}</h3>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border-none outline-none appearance-none cursor-pointer text-center ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="px-8 flex-1">
                      <div className="space-y-4 py-4 border-t border-gray-50">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                              <span className="text-sm font-bold text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Collected</div>
                      <div className="text-2xl font-black text-black">${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Menu Editor Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Kitchen Catalog</h2>
                <p className="text-gray-500 font-medium">Manage your dishes and availability</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-black text-white px-8 py-4 rounded-3xl font-black italic flex items-center gap-3 hover:bg-red-600 transition-colors shadow-lg shadow-gray-200"
              >
                <Plus size={20} />
                New Dish
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
              {foodItems.map(item => (
                <div key={item.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="relative h-48 group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button 
                        onClick={() => deleteItem(item.id)} 
                        className="p-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                        title="Delete Item"
                       >
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{item.category}</span>
                        <h3 className="text-xl font-black leading-tight">{item.name}</h3>
                      </div>
                      <span className="text-lg font-black text-black">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-6">{item.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'} shadow-sm shadow-current`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {item.isAvailable ? 'Available' : 'Disabled'}
                        </span>
                      </div>
                      <button 
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          item.isAvailable ? 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600' : 'bg-red-600 text-white'
                        }`}
                      >
                        {item.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Store Insights</h2>
              <p className="text-gray-500 font-medium">Performance data and customer trends</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
                <h3 className="text-4xl font-black italic text-red-600">${stats.totalRev.toFixed(2)}</h3>
              </div>
              <div className="bg-black p-8 rounded-[40px] shadow-sm text-white">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
                <h3 className="text-4xl font-black italic">{orders.length}</h3>
              </div>
              <div className="bg-red-600 p-8 rounded-[40px] shadow-sm text-white">
                <p className="text-[10px] font-black text-red-200 uppercase tracking-widest mb-2">Completion Rate</p>
                <h3 className="text-4xl font-black italic">
                  {orders.length ? Math.round(((stats.orderCounts['Completed'] as number || 0) / (orders.length as number)) * 100) : 0}%
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-lg font-black uppercase tracking-tight italic mb-8">Status Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '15px' }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Completed' ? '#10b981' : entry.name === 'Cancelled' ? '#ef4444' : '#000'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-lg font-black uppercase tracking-tight italic mb-8">Fan Favorites</h3>
                <div className="space-y-6">
                  {Object.entries(stats.mostOrdered).sort((a,b) => (b[1] as number) - (a[1] as number)).slice(0, 5).map(([name, qty]) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black italic text-red-600 border border-gray-100">
                          {qty as number}
                        </div>
                        <span className="font-bold text-gray-700">{name}</span>
                      </div>
                      <div className="h-2 flex-1 mx-8 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${((qty as number) / Math.max(...(Object.values(stats.mostOrdered) as number[]))) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shop Settings Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-8 max-w-2xl">
            <header>
              <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Store Settings</h2>
              <p className="text-gray-500 font-medium">Control operating hours and global status</p>
            </header>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-10">
              <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
                <div>
                  <h3 className="text-xl font-black italic mb-1">Global Store Switch</h3>
                  <p className="text-sm text-gray-500 font-medium">Instantly open or close the entire shop</p>
                </div>
                <button 
                  onClick={() => setShopConfig(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                  className={`w-20 h-10 rounded-full p-1 transition-all ${shopConfig.isOpen ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                  <div className={`w-8 h-8 rounded-full bg-white shadow-lg transition-transform ${shopConfig.isOpen ? 'translate-x-10' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Opening Bell</label>
                  <input 
                    type="time" 
                    value={shopConfig.openTime}
                    onChange={(e) => setShopConfig(prev => ({ ...prev, openTime: e.target.value }))}
                    className="w-full bg-gray-50 p-6 rounded-[25px] border-2 border-transparent focus:border-red-600 font-black text-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Closing Bell</label>
                  <input 
                    type="time" 
                    value={shopConfig.closeTime}
                    onChange={(e) => setShopConfig(prev => ({ ...prev, closeTime: e.target.value }))}
                    className="w-full bg-gray-50 p-6 rounded-[25px] border-2 border-transparent focus:border-red-600 font-black text-2xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100">
                <AlertCircle className="shrink-0" />
                <p className="text-sm font-bold leading-relaxed">
                  Changing shop times will affect order placement for all customers immediately. Default is <span className="underline">08:00 to 15:00</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Item Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
             <h2 className="text-2xl font-black italic mb-8">Add New Dish</h2>
             <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input id="new-name" type="text" className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none font-bold" placeholder="e.g. Speed Slider" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <input id="new-cat" type="text" className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none font-bold" placeholder="Burgers" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                    <input id="new-price" type="number" step="0.01" className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none font-bold" placeholder="9.99" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input id="new-image" type="text" className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none font-bold" placeholder="https://images.unsplash.com/..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea id="new-desc" className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none font-bold h-24 resize-none" placeholder="Briefly describe this fast dish..." />
                </div>
                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 font-black uppercase text-xs tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const name = (document.getElementById('new-name') as HTMLInputElement).value;
                      const cat = (document.getElementById('new-cat') as HTMLInputElement).value;
                      const price = parseFloat((document.getElementById('new-price') as HTMLInputElement).value);
                      const image = (document.getElementById('new-image') as HTMLInputElement).value;
                      const desc = (document.getElementById('new-desc') as HTMLTextAreaElement).value;
                      
                      if(name && price) {
                        setFoodItems(prev => [...prev, {
                          id: Date.now().toString(),
                          name,
                          category: cat || 'General',
                          price,
                          description: desc || 'Manually added flash special.',
                          isAvailable: true,
                          image: image || `https://picsum.photos/seed/${name}/400/300`
                        }]);
                        setIsAdding(false);
                      } else {
                        alert('Please fill in Name and Price at least.');
                      }
                    }}
                    className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black italic uppercase tracking-tighter shadow-lg shadow-red-200"
                  >
                    Save Dish
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
