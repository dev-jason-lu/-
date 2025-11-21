import React, { useState, useEffect } from 'react';
import { Dish, DishCategory, Order, ViewState, Achievement } from './types';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { MenuView } from './views/MenuView';
import { OrderView } from './views/OrderView';
import { ChefAIView } from './views/ChefAIView';
import { MemoriesView } from './views/MemoriesView';
import { User } from 'lucide-react';

// Mock Data Initialization
const INITIAL_DISHES: Dish[] = [
  { id: '1', name: 'Heart-shaped Pancakes', description: 'Fluffy pancakes made with love and strawberries.', category: DishCategory.BREAKFAST, difficulty: 'Easy', calories: 450, tags: ['Sweet', 'Quick'], isFavorite: true, imageUrl: 'https://picsum.photos/400/300?random=1' },
  { id: '2', name: 'Spicy Carbonara', description: 'Classic Italian pasta with a spicy twist for date night.', category: DishCategory.DINNER, difficulty: 'Medium', calories: 800, tags: ['Pasta', 'Spicy'], isFavorite: false, imageUrl: 'https://picsum.photos/400/300?random=2' },
  { id: '3', name: 'Midnight Tacos', description: 'Quick beef tacos for late night cravings.', category: DishCategory.SNACK, difficulty: 'Easy', calories: 300, tags: ['Mexican', 'Savory'], isFavorite: true, imageUrl: 'https://picsum.photos/400/300?random=3' },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Date', description: 'Complete your first order', icon: '🥂', unlocked: false },
  { id: '2', title: 'Master Chef', description: 'Cook 5 meals rated 5 stars', icon: '👨‍🍳', unlocked: false },
  { id: '3', title: 'Spicy Love', description: 'Order a spicy dish', icon: '🌶️', unlocked: false },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MENU);
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState(120);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOrder = (dish: Dish, time: string, note: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      dishId: dish.id,
      dishName: dish.name,
      orderDate: Date.now(),
      scheduledTime: time,
      status: 'Pending',
      chefNote: note,
      chef: 'Partner A' // Simplified logic
    };
    setOrders([newOrder, ...orders]);
    showNotification(`Ordered ${dish.name}!`);
    
    // Check "Spicy Love" achievement
    if (dish.tags.includes('Spicy')) {
      unlockAchievement('3');
    }
  };

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    if (status === 'Completed') {
      setPoints(prev => prev + 50);
      unlockAchievement('1'); // Unlock first date
    }
  };

  const handleRateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, rating, review, status: 'Completed' } : o));
    setPoints(prev => prev + (rating * 10));
    showNotification("Rating submitted! +XP");
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        showNotification(`🏆 Unlocked: ${a.title}`);
        return { ...a, unlocked: true };
      }
      return a;
    }));
  };

  const renderView = () => {
    switch (view) {
      case ViewState.MENU:
        return <MenuView dishes={dishes} onOrder={handleOrder} onAddDish={() => {}} />;
      case ViewState.ORDER:
        return <OrderView orders={orders} updateOrderStatus={handleUpdateStatus} rateOrder={handleRateOrder} />;
      case ViewState.CHEF_AI:
        return <ChefAIView />;
      case ViewState.MEMORIES:
        return <MemoriesView orders={orders} achievements={achievements} />;
      case ViewState.PROFILE:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center">
            <div className="w-24 h-24 bg-rose-200 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Alex & Sam</h2>
            <p className="text-slate-500 mb-6">Cooking together since 2023</p>
            <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-sm">
              <div className="flex justify-between mb-2">
                 <span>Total XP</span>
                 <span className="font-bold text-rose-500">{points}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${Math.min(points/10, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right">Next level at 1000 XP</p>
            </div>
          </div>
        );
      default:
        return <MenuView dishes={dishes} onOrder={handleOrder} onAddDish={() => {}} />;
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      <Header points={points} coupleName="Alex & Sam" />
      
      <main className="flex-1 overflow-y-auto relative">
        {renderView()}
      </main>

      <Navigation 
        currentView={view} 
        setView={setView} 
        pendingOrdersCount={orders.filter(o => o.status === 'Pending' || o.status === 'Cooking').length} 
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
          {notification}
        </div>
      )}
    </div>
  );
};

export default App;
