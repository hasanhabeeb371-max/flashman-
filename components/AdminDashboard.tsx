
import React, { useState, useMemo } from 'react';
import { User, FoodItem, Order, ShopConfig, OrderStatus } from '../types';
import { Settings, BarChart3, ListChecks, Plus, Edit2, LogOut, Trash2, X, ChefHat, AlertTriangle, Package, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: ''
  });

  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const totalRev = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { totalRev, orderCounts };
  }, [orders]);

  const chartData = useMemo(() => {
    const statuses: OrderStatus[] = ['Placed', 'Preparing', 'Completed', 'Cancelled'];
    return statuses.map(status => ({
      name: status,
      value: (stats.orderCounts[status] as number) || 0
    }));
  }, [stats]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setFoodItems(prev => prev.filter(item => item.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const toggleAvailability = (id: string) => {
    setFoodItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleOpenEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
      description: item.description
    });
    setIsAdding(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const dishPrice = parseFloat(formData.price);
    const dishImage = formData.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`;

    if (editingItem) {
      setFoodItems(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        category: formData.category || 'General',
        price: dishPrice,
        image: dishImage,
        description: formData.description
      } : item));
    } else {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category || 'General',
        price: dishPrice,
        description: formData.description,
        image: dishImage,
        isAvailable: true
      };
      setFoodItems(prev => [...prev, newItem]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingItem(null);
    setFormData({ name: '', category: '', price: '', image: '', description: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar - Small Nav size */}
      <aside className="w-full lg:w-64 bg-white text-black p-4 lg:p-8 flex flex-col sticky top-0 lg:h-screen z-40 border-b lg:border-r border-gray-50">
        <div className="flex items-center justify-between lg:mb-12 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center rotate-6 shadow-lg shadow-red-50">
               <span className="text-black text-lg font-black italic">F</span>
            </div>
            <h1 className="text-lg lg:text-xl font-black italic tracking-tighter">FLASH <span className="text-red-600">MAN</span></h1>
          </div>
          <button onClick={onLogout} title="Logout" className="lg:hidden p-1.5 text-gray-300 hover:text-red-600 transition-all">
            <LogOut size={18} />
          </button>
        </div>

        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 py-1 lg:py-0 no-scrollbar">
          {[
            { id: 'orders', label: 'Orders', icon: ListChecks },
            { id: 'menu', label: 'Food List', icon: ChefHat },
            { id: 'analytics', label: 'Sales', icon: BarChart3 },
            { id: 'shop', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 lg:px-6 lg:py-4 rounded-[20px] lg:rounded-[24px] transition-all font-black text-[10px] uppercase tracking-widest flex-shrink-0 lg:w-full ${
                activeTab === tab.id ? 'bg-red-600 text-white shadow-xl shadow-red-50' : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block mt-auto pt-6 border-t border-gray-50">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-black font-black text-[10px] uppercase tracking-widest transition-all rounded-[24px]">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-white flex flex-col min-h-screen">
        <div className="bg-white text-black p-4 lg:p-10 z-10">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-red-600 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Admin Dashboard</p>
                <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter">
                  {activeTab === 'orders' && 'Orders'}
                  {activeTab === 'menu' && 'Food List'}
                  {activeTab === 'analytics' && 'Sales Info'}
                  {activeTab === 'shop' && 'Shop Settings'}
                </h2>
              </div>
              {activeTab === 'menu' && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-black text-white px-6 py-3 lg:px-8 lg:py-4 rounded-[20px] lg:rounded-[24px] font-black text-[10px] uppercase flex items-center gap-2 lg:gap-3 hover:bg-red-600 transition-all shadow-xl shadow-gray-100 italic self-start md:self-auto"
                >
                  <Plus size={18} /> Add Food
                </button>
              )}
           </div>
        </div>

        <div className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {orders.length === 0 ? (
                <div className="col-span-full py-32 lg:py-40 text-center bg-gray-50/50 rounded-[40px] lg:rounded-[60px] border-2 border-dashed border-gray-100">
                  <Package className="mx-auto text-gray-200 mb-4" size={40} lg:size={48} />
                  <p className="text-gray-400 font-black italic uppercase text-xs sm:text-sm tracking-widest">No orders yet</p>
                </div>
              ) : (
                orders.slice().reverse().map(order => (
                  <div key={order.id} className="bg-white p-6 lg:p-10 rounded-[40px] lg:rounded-[60px] shadow-sm border border-gray-100 flex flex-col justify-between hover:border-red-600/20 transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-6 lg:mb-8">
                        <span className="text-black font-black text-xs sm:text-sm italic tracking-tighter">#{order.id}</span>
                        <div className="flex gap-2">
                           <div className={`w-2 h-2 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : order.status === 'Cancelled' ? 'bg-red-600' : 'bg-black animate-pulse'}`}></div>
                           <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400">{order.status}</span>
                        </div>
                      </div>
                      <div className="space-y-2 lg:space-y-3 mb-8 lg:mb-10">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <p className="text-xs sm:text-sm font-black text-black">{item.quantity}x {item.name}</p>
                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 lg:pt-8 border-t border-gray-50 flex justify-between items-end">
                      <div>
                        <p className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Total</p>
                        <span className="text-2xl lg:text-3xl font-black italic text-red-600">₹{order.total.toFixed(2)}</span>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-[9px] sm:text-[10px] font-black uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gray-50 border-none outline-none cursor-pointer hover:bg-black hover:text-white transition-all"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
              {foodItems.length === 0 ? (
                <div className="col-span-full py-32 lg:py-40 text-center bg-gray-50/50 rounded-[40px] lg:rounded-[60px] border-2 border-dashed border-gray-100">
                  <ChefHat className="mx-auto text-gray-200 mb-4" size={40} lg:size={48} />
                  <p className="text-gray-400 font-black italic uppercase text-xs sm:text-sm tracking-widest">No food added</p>
                </div>
              ) : (
                foodItems.map(item => (
                  <div key={item.id} className={`bg-white rounded-[40px] lg:rounded-[60px] overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                    <div className="h-48 lg:h-56 bg-gray-50 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-all duration-700 ${!item.isAvailable ? 'grayscale' : 'grayscale-[0.5] group-hover:grayscale-0'}`} />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute top-4 lg:top-6 right-4 lg:right-6 flex flex-col gap-2 lg:gap-3">
                        <button 
                          onClick={() => toggleAvailability(item.id)} 
                          className={`p-3 lg:p-4 rounded-2xl lg:rounded-3xl shadow-xl transition-all ${item.isAvailable ? 'bg-white text-black hover:bg-gray-100' : 'bg-red-600 text-white hover:bg-black'}`}
                        >
                          {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => handleOpenEdit(item)} className="p-3 lg:p-4 bg-white text-black rounded-2xl lg:rounded-3xl hover:bg-red-600 hover:text-white shadow-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(item.id)} className="p-3 lg:p-4 bg-white text-red-600 rounded-2xl lg:rounded-3xl hover:bg-red-600 hover:text-white shadow-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 flex items-center gap-2">
                        <div className="bg-white px-4 lg:px-5 py-1.5 lg:py-2 rounded-[20px] lg:rounded-3xl shadow-xl">
                          <span className="text-black font-black italic text-xs sm:text-sm tracking-tighter">₹{item.price.toFixed(2)}</span>
                        </div>
                        {!item.isAvailable && (
                          <div className="bg-black text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-[20px] lg:rounded-3xl shadow-xl">
                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Hidden</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 lg:p-10">
                      <div className="flex justify-between items-start mb-3 lg:mb-4">
                        <h3 className={`font-black text-xl lg:text-2xl uppercase italic tracking-tighter text-black ${!item.isAvailable ? 'line-through decoration-red-600/30' : ''}`}>{item.name}</h3>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase text-red-600 border border-red-100 px-2 lg:px-3 py-1 rounded-full">{item.category}</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
               <div className="bg-white p-6 lg:p-12 rounded-[40px] lg:rounded-[80px] border border-gray-100 flex flex-col shadow-sm">
                 <h3 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 lg:mb-12">Sales Graph</h3>
                 <div className="flex-1 min-h-[300px] lg:min-h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#000'}} />
                       <YAxis hide />
                       <Tooltip cursor={{fill: 'rgba(239, 68, 68, 0.02)'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.05)'}} />
                       <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={32}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.name === 'Completed' ? '#10b981' : entry.name === 'Cancelled' ? '#ef4444' : '#000'} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
               <div className="flex flex-col gap-6 lg:gap-8">
                 <div className="bg-gray-50/50 p-8 lg:p-16 rounded-[40px] lg:rounded-[80px] flex-1 flex flex-col justify-center text-center">
                   <p className="text-[10px] lg:text-[11px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4 lg:mb-6">Total Earned</p>
                   <h3 className="text-4xl lg:text-7xl font-black italic text-black tracking-tighter">₹{stats.totalRev.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                 </div>
                 <div className="bg-red-600 p-8 lg:p-16 rounded-[40px] lg:rounded-[80px] text-black flex-1 flex flex-col justify-center text-center shadow-2xl shadow-red-50">
                   <p className="text-[10px] lg:text-[11px] font-black text-white/50 uppercase tracking-[0.5em] mb-4 lg:mb-6">Order Count</p>
                   <h3 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-white">{orders.length}</h3>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'shop' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 lg:p-16 rounded-[60px] lg:rounded-[100px] border border-gray-100 space-y-12 lg:space-y-16">
                <div className="flex items-center justify-between p-8 lg:p-12 bg-gray-50/50 rounded-[40px] lg:rounded-[80px]">
                   <div>
                     <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2 lg:mb-3">Shop Status</p>
                     <h3 className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter text-black">{shopConfig.isOpen ? 'Open' : 'Closed'}</h3>
                   </div>
                   <button 
                     onClick={() => setShopConfig(p => ({...p, isOpen: !p.isOpen}))} 
                     className={`w-20 h-10 lg:w-24 lg:h-12 rounded-full p-1.5 lg:p-2 transition-all shadow-inner ${shopConfig.isOpen ? 'bg-red-600' : 'bg-gray-200'}`}
                   >
                      <div className={`w-7 h-7 lg:w-8 h-8 rounded-full bg-white shadow-xl transition-transform ${shopConfig.isOpen ? 'translate-x-10 lg:translate-x-12' : 'translate-x-0'}`} />
                   </button>
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-400 text-xs sm:text-sm italic leading-relaxed">Status is manually controlled. Customers will see this status instantly.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal - Better scaling */}
      {isAdding && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSaveDish} className="bg-white w-full max-w-xl rounded-[40px] lg:rounded-[80px] p-8 lg:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300 border border-gray-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-4xl font-black italic tracking-tighter text-black uppercase">{editingItem ? 'Edit Food' : 'New Food'}</h2>
              <button type="button" onClick={closeModal} className="p-2 lg:p-4 hover:bg-gray-100 rounded-full text-black transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[11px] font-black uppercase text-gray-300 tracking-[0.3em] px-4 lg:px-8">Food Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 p-4 lg:p-6 rounded-[24px] lg:rounded-[40px] border-none font-black text-black outline-none focus:bg-white focus:ring-8 ring-red-500/5 transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[11px] font-black uppercase text-gray-300 tracking-[0.3em] px-4 lg:px-8">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 p-4 lg:p-6 rounded-[24px] lg:rounded-[40px] border-none font-black text-black outline-none focus:bg-white focus:ring-8 ring-red-500/5 transition-all" />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[11px] font-black uppercase text-gray-300 tracking-[0.3em] px-4 lg:px-8">Price (₹)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 p-4 lg:p-6 rounded-[24px] lg:rounded-[40px] border-none font-black text-black outline-none focus:bg-white focus:ring-8 ring-red-500/5 transition-all" />
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[11px] font-black uppercase text-gray-300 tracking-[0.3em] px-4 lg:px-8">Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-gray-50 p-4 lg:p-6 rounded-[24px] lg:rounded-[40px] border-none font-black text-black outline-none focus:bg-white focus:ring-8 ring-red-500/5 transition-all" />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[11px] font-black uppercase text-gray-300 tracking-[0.3em] px-4 lg:px-8">About this Food</label>
                <textarea rows={2} lg:rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 p-4 lg:p-6 rounded-[24px] lg:rounded-[40px] border-none font-black text-black outline-none resize-none focus:bg-white focus:ring-8 ring-red-500/5 transition-all" />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-5 lg:py-7 rounded-[24px] lg:rounded-[40px] font-black uppercase italic tracking-widest shadow-2xl shadow-red-100 transform active:scale-95 transition-all text-lg lg:text-xl mt-4 lg:mt-6">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation scaling */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div className="bg-white max-w-md w-full p-10 lg:p-20 rounded-[60px] lg:rounded-[100px] text-center shadow-2xl animate-in zoom-in duration-300 border border-gray-100">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-red-50 text-red-600 rounded-[32px] lg:rounded-[48px] flex items-center justify-center mx-auto mb-8 lg:mb-10">
              <AlertTriangle size={36} lg:size={48} />
            </div>
            <h3 className="text-2xl lg:text-4xl font-black italic mb-4 lg:mb-6 text-black tracking-tighter uppercase">Delete?</h3>
            <p className="text-sm lg:text-base text-gray-400 font-medium mb-12 lg:mb-16 leading-relaxed">This will remove the food from the list forever.</p>
            <div className="grid grid-cols-2 gap-4 lg:gap-8">
              <button onClick={() => setDeleteConfirmId(null)} className="py-4 lg:py-6 bg-gray-50 text-gray-400 rounded-[20px] lg:rounded-[40px] font-black uppercase text-[10px] sm:text-[12px] tracking-widest hover:text-black transition-all">Cancel</button>
              <button onClick={confirmDelete} className="py-4 lg:py-6 bg-red-600 text-white rounded-[20px] lg:rounded-[40px] font-black uppercase text-[10px] sm:text-[12px] tracking-widest shadow-2xl shadow-red-100 transform active:scale-95 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
