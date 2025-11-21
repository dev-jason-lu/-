
import React from 'react';
import { Heart, Coins, Settings } from 'lucide-react';
import { AppTheme, ViewState } from '../types';

interface HeaderProps {
  points: number;
  coupleName: string;
  theme: AppTheme;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ points, coupleName, theme, onOpenSettings }) => {
  return (
    <header className={`bg-gradient-to-r ${theme.gradient} text-white p-4 sticky top-0 z-40 shadow-md transition-all duration-500`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Heart className="fill-white text-white w-5 h-5 animate-pulse" />
          </div>
          <h1 className="font-bold text-lg tracking-wide truncate max-w-[150px]">{coupleName}</h1>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <Coins size={14} className="text-yellow-300 fill-yellow-300" />
              <span className="font-bold text-sm">{points}</span>
            </div>
            <button 
              onClick={onOpenSettings}
              className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors"
            >
              <Settings size={18} />
            </button>
        </div>
      </div>
    </header>
  );
};
