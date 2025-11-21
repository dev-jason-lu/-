
import React from 'react';
import { Reward, AppTheme } from '../types';
import { Coins, Ticket } from 'lucide-react';

interface StoreViewProps {
  rewards: Reward[];
  coins: number;
  onRedeem: (reward: Reward) => void;
  theme: AppTheme;
}

export const StoreView: React.FC<StoreViewProps> = ({ rewards, coins, onRedeem, theme }) => {
  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Love Store</h2>
            <p className="text-yellow-100 text-sm">Spend coins on special treats!</p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
            <Coins className="text-yellow-100 fill-yellow-100" />
            <span className="text-xl font-bold">{coins}</span>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Ticket className={theme.text} /> Available Coupons
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const canAfford = coins >= reward.cost;
          return (
            <div key={reward.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative ${!canAfford ? 'opacity-70' : ''}`}>
              <div className="text-4xl mb-2 text-center">{reward.icon}</div>
              <h4 className="font-bold text-center text-slate-800 mb-1">{reward.title}</h4>
              <p className="text-xs text-center text-slate-500 mb-3 h-8">{reward.description}</p>
              
              <button 
                onClick={() => canAfford && onRedeem(reward)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-all ${
                  canAfford 
                    ? `${theme.primary} text-white shadow-md hover:scale-105` 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Redeem' : 'Need Coins'}
                <span className="bg-black/10 px-1.5 rounded text-xs ml-1">{reward.cost}</span>
              </button>

              {reward.redeemedCount > 0 && (
                 <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                   Used x{reward.redeemedCount}
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
