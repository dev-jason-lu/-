
import React from 'react';
import { Utensils, ListOrdered, Sparkles, BookHeart, Gift } from 'lucide-react';
import { ViewState, AppTheme } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  pendingOrdersCount: number;
  theme: AppTheme;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, pendingOrdersCount, theme }) => {
  const navItems = [
    { view: ViewState.MENU, icon: Utensils, label: 'Menu' },
    { view: ViewState.ORDER, icon: ListOrdered, label: 'Orders', badge: pendingOrdersCount },
    { view: ViewState.CHEF_AI, icon: Sparkles, label: 'AI Chef' },
    { view: ViewState.STORE, icon: Gift, label: 'Store' },
    { view: ViewState.MEMORIES, icon: BookHeart, label: 'Memories' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t ${theme.border} shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe z-50`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? theme.text : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className="relative">
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className={`absolute -top-2 -right-2 ${theme.primary} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce`}>
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
