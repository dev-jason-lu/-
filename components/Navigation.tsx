import React from 'react';
import { Utensils, ListOrdered, Sparkles, BookHeart, User } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  pendingOrdersCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, pendingOrdersCount }) => {
  const navItems = [
    { view: ViewState.MENU, icon: Utensils, label: 'Menu' },
    { view: ViewState.ORDER, icon: ListOrdered, label: 'Orders', badge: pendingOrdersCount },
    { view: ViewState.CHEF_AI, icon: Sparkles, label: 'AI Chef' },
    { view: ViewState.MEMORIES, icon: BookHeart, label: 'Memories' },
    { view: ViewState.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-rose-100 shadow-lg pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.view ? 'text-rose-500' : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <div className="relative">
              <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
