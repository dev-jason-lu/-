import React, { useState } from 'react';
import { Dish, DishCategory } from '../types';
import { Plus, Search, Clock, Flame, Star } from 'lucide-react';

interface MenuViewProps {
  dishes: Dish[];
  onOrder: (dish: Dish, time: string, note: string) => void;
  onAddDish: (dish: Dish) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ dishes, onOrder, onAddDish }) => {
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Order Modal State
  const [orderTime, setOrderTime] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dish.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOrderClick = (dish: Dish) => {
    setSelectedDish(dish);
    // Default to now + 1 hour, formatted for datetime-local
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    setOrderTime(localISOTime);
    setIsModalOpen(true);
  };

  const confirmOrder = () => {
    if (selectedDish) {
      onOrder(selectedDish, orderTime, orderNote);
      setIsModalOpen(false);
      setOrderNote('');
      setSelectedDish(null);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4 min-h-screen bg-slate-50">
      {/* Search & Filter */}
      <div className="sticky top-16 z-30 bg-slate-50 py-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search our menu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
             onClick={() => setSelectedCategory('All')}
             className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            All
          </button>
          {Object.values(DishCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredDishes.map(dish => (
          <div key={dish.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 w-full bg-gray-100 relative">
              <img 
                src={dish.imageUrl} 
                alt={dish.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-rose-600 flex items-center gap-1">
                <Star size={12} className="fill-rose-600" />
                {dish.difficulty}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{dish.calories} kcal</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{dish.description}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1 flex-wrap">
                  {dish.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => handleOrderClick(dish)}
                  className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-1 text-sm font-medium pr-3"
                >
                  <Plus size={16} />
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p>No dishes found. Try generating one with the AI Chef!</p>
        </div>
      )}

      {/* Order Modal */}
      {isModalOpen && selectedDish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order {selectedDish.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When do you want it?</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    value={orderTime}
                    onChange={(e) => setOrderTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Request / Love Note</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                  rows={3}
                  placeholder="Make it extra spicy! ❤️"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOrder}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 shadow-lg shadow-rose-200"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
