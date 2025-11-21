import React from 'react';
import { Order, Achievement } from '../types';
import { Trophy, Calendar, Camera, Heart } from 'lucide-react';

interface MemoriesViewProps {
  orders: Order[];
  achievements: Achievement[];
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ orders, achievements }) => {
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalRatings = completedOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const averageRating = completedOrders.length > 0 ? (totalRatings / completedOrders.length).toFixed(1) : '0.0';

  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen">
      {/* Stats Card */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Heart className="fill-white" /> Our Culinary Journey
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{completedOrders.length}</div>
            <div className="text-xs opacity-80">Meals Cooked</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="text-xs opacity-80">Avg Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-xs opacity-80">Achievements</div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Trophy size={18} className="text-yellow-500" /> Achievements
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {achievements.map(ach => (
          <div 
            key={ach.id} 
            className={`p-3 rounded-xl border ${ach.unlocked ? 'bg-white border-yellow-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'}`}
          >
            <div className="text-2xl mb-1">{ach.icon}</div>
            <div className="font-bold text-sm text-slate-800">{ach.title}</div>
            <div className="text-xs text-slate-500 leading-tight">{ach.description}</div>
          </div>
        ))}
      </div>

      {/* Timeline / History */}
      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Calendar size={18} className="text-rose-500" /> Food Diary
      </h3>
      <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
        {completedOrders.map((order) => (
          <div key={order.id} className="relative">
            <div className="absolute -left-[21px] top-0 bg-rose-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{order.dishName}</h4>
                <span className="text-xs text-slate-400">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              
              {/* Simulated Photo Placeholder - in real app, this would be user uploaded */}
              <div className="h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-400">
                <Camera size={24} />
              </div>

              {order.review && (
                <div className="bg-yellow-50 p-3 rounded-xl text-sm text-slate-700 italic relative">
                  <span className="absolute -top-2 left-3 text-2xl leading-none text-yellow-200">"</span>
                  {order.review}
                  <span className="absolute -bottom-4 right-3 text-2xl leading-none text-yellow-200">"</span>
                </div>
              )}
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs font-bold text-rose-500">Chef: {order.chef}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
