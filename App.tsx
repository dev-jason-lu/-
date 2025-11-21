
import React, { useState, useEffect } from 'react';
import { Dish, DishCategory, Order, ViewState, Achievement, Reward, AppTheme, ThemeColor, UserProfile } from './types';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { MenuView } from './views/MenuView';
import { OrderView } from './views/OrderView';
import { ChefAIView } from './views/ChefAIView';
import { MemoriesView } from './views/MemoriesView';
import { StoreView } from './views/StoreView';
import { SettingsView } from './views/SettingsView';
import { TutorialOverlay } from './components/TutorialOverlay';

// Theme Configuration
const THEMES: Record<ThemeColor, AppTheme> = {
  rose: {
    id: 'rose', name: 'Love',
    primary: 'bg-rose-500', secondary: 'bg-rose-100', text: 'text-rose-500',
    gradient: 'from-rose-400 to-pink-500', border: 'border-rose-200', shadow: 'shadow-rose-200'
  },
  blue: {
    id: 'blue', name: 'Ocean',
    primary: 'bg-blue-500', secondary: 'bg-blue-100', text: 'text-blue-500',
    gradient: 'from-blue-400 to-cyan-500', border: 'border-blue-200', shadow: 'shadow-blue-200'
  },
  emerald: {
    id: 'emerald', name: 'Nature',
    primary: 'bg-emerald-500', secondary: 'bg-emerald-100', text: 'text-emerald-500',
    gradient: 'from-emerald-400 to-teal-500', border: 'border-emerald-200', shadow: 'shadow-emerald-200'
  },
  violet: {
    id: 'violet', name: 'Night',
    primary: 'bg-violet-500', secondary: 'bg-violet-100', text: 'text-violet-500',
    gradient: 'from-violet-600 to-purple-800', border: 'border-violet-200', shadow: 'shadow-violet-200'
  }
};

// Mock Data Initialization (Keep existing data but extended)
const INITIAL_DISHES: Dish[] = [
  { id: '1', name: 'Heart-shaped Pancakes', description: 'Fluffy pancakes made with love and strawberries.', category: DishCategory.BREAKFAST, difficulty: 'Easy', calories: 450, tags: ['Sweet', 'Quick'], isFavorite: true, imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400' },
  { id: '2', name: 'Spicy Carbonara', description: 'Classic Italian pasta with a spicy twist for date night.', category: DishCategory.DINNER, difficulty: 'Medium', calories: 800, tags: ['Pasta', 'Spicy'], isFavorite: false, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  { id: '3', name: 'Midnight Tacos', description: 'Quick beef tacos for late night cravings.', category: DishCategory.SNACK, difficulty: 'Easy', calories: 300, tags: ['Mexican', 'Savory'], isFavorite: true, imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400' },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Date', description: 'Complete your first order', icon: '🥂', unlocked: false },
  { id: '2', title: 'Master Chef', description: 'Cook 5 meals rated 5 stars', icon: '👨‍🍳', unlocked: false },
  { id: '3', title: 'Spicy Love', description: 'Order a spicy dish', icon: '🌶️', unlocked: false },
  { id: '4', title: 'Generous Soul', description: 'Redeem a coupon for your partner', icon: '🎁', unlocked: false },
];

const INITIAL_REWARDS: Reward[] = [
  { id: '1', title: 'Dishwashing Pass', cost: 100, icon: '🧼', description: 'One free pass from doing dishes.', redeemedCount: 0 },
  { id: '2', title: 'Movie Choice', cost: 150, icon: '🎬', description: 'I get to pick the movie tonight.', redeemedCount: 0 },
  { id: '3', title: '10m Massage', cost: 300, icon: '💆', description: 'A relaxing shoulder or foot massage.', redeemedCount: 0 },
  { id: '4', title: 'Breakfast in Bed', cost: 500, icon: '🥐', description: 'Served with coffee and a smile.', redeemedCount: 0 },
];

const App: React.FC = () => {
  // App State
  const [view, setView] = useState<ViewState>(ViewState.MENU);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(THEMES.rose);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  
  // User Data State
  const [profile, setProfile] = useState<UserProfile>({ 
    name: 'Alex', 
    partnerName: 'Sam', 
    startDate: Date.now() 
  });
  
  // Content State
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coins, setCoins] = useState(120);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleThemeChange = (color: ThemeColor) => {
    setCurrentTheme(THEMES[color]);
  };

  const handleAddDish = (dish: Dish) => {
    setDishes([dish, ...dishes]);
    showNotification("Added new dish to menu!");
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
      chef: profile.partnerName // Assume ordering from partner
    };
    setOrders([newOrder, ...orders]);
    showNotification(`Ordered ${dish.name}!`);
    
    if (dish.tags.some(t => t.toLowerCase().includes('spicy'))) {
      unlockAchievement('3');
    }
  };

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    if (status === 'Completed') {
      const coinsEarned = 50;
      setCoins(prev => prev + coinsEarned);
      showNotification(`Cooking Done! +${coinsEarned} Coins`);
      unlockAchievement('1');
    }
  };

  const handleRateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, rating, review, status: 'Completed' } : o));
    setCoins(prev => prev + 10);
    showNotification("Rating submitted! +10 Coins");
  };

  const handleRedeem = (reward: Reward) => {
    if (coins >= reward.cost) {
        setCoins(prev => prev - reward.cost);
        setRewards(prev => prev.map(r => r.id === reward.id ? {...r, redeemedCount: r.redeemedCount + 1} : r));
        showNotification(`Redeemed: ${reward.title}!`);
        unlockAchievement('4');
    }
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
        return <MenuView dishes={dishes} onOrder={handleOrder} onAddDish={handleAddDish} theme={currentTheme} />;
      case ViewState.ORDER:
        return <OrderView orders={orders} updateOrderStatus={handleUpdateStatus} rateOrder={handleRateOrder} theme={currentTheme} />;
      case ViewState.CHEF_AI:
        return <ChefAIView theme={currentTheme} />;
      case ViewState.STORE:
        return <StoreView rewards={rewards} coins={coins} onRedeem={handleRedeem} theme={currentTheme} />;
      case ViewState.MEMORIES:
        return <MemoriesView orders={orders} achievements={achievements} theme={currentTheme} />;
      case ViewState.SETTINGS:
        return (
          <SettingsView 
            theme={currentTheme} 
            setTheme={handleThemeChange} 
            profile={profile}
            setProfile={setProfile}
            onResetTutorial={() => setHasSeenTutorial(false)}
          />
        );
      default:
        return <MenuView dishes={dishes} onOrder={handleOrder} onAddDish={handleAddDish} theme={currentTheme} />;
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      {!hasSeenTutorial && (
        <TutorialOverlay onComplete={() => setHasSeenTutorial(true)} theme={currentTheme} />
      )}

      <Header 
        points={coins} 
        coupleName={`${profile.name} & ${profile.partnerName}`} 
        theme={currentTheme}
        onOpenSettings={() => setView(ViewState.SETTINGS)}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        {renderView()}
      </main>

      <Navigation 
        currentView={view} 
        setView={setView} 
        pendingOrdersCount={orders.filter(o => o.status === 'Pending' || o.status === 'Cooking').length}
        theme={currentTheme}
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
