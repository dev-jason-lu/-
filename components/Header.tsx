import React from 'react';
import { Heart } from 'lucide-react';

interface HeaderProps {
  points: number;
  coupleName: string;
}

export const Header: React.FC<HeaderProps> = ({ points, coupleName }) => {
  return (
    <header className="bg-gradient-to-r from-rose-400 to-pink-500 text-white p-4 sticky top-0 z-40 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Heart className="fill-white text-white w-5 h-5 animate-pulse" />
          </div>
          <h1 className="font-bold text-lg tracking-wide">{coupleName}</h1>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="font-bold text-sm">Love Level: {Math.floor(points / 100)}</span>
          <span className="text-xs opacity-80 ml-1">({points} XP)</span>
        </div>
      </div>
    </header>
  );
};
