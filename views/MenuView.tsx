
import React, { useState } from 'react';
import { Dish, DishCategory, AppTheme } from '../types';
import { Plus, Search, Clock, Star, Wand2, Loader2, X } from 'lucide-react';
import { generateDishDetails } from '../services/geminiService';

interface MenuViewProps {
  dishes: Dish[];
  onOrder: (dish: Dish, time: string, note: string) => void;
  onAddDish: (dish: Dish) => void;
  theme: AppTheme;
}

export const MenuView: React.FC<MenuViewProps> = ({ dishes, onOrder, onAddDish, theme }) => {
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Order Modal State
  const [orderTime, setOrderTime] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Add Dish Modal State
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<DishCategory>(DishCategory.DINNER);
  const [newDishDiff, setNewDishDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newDishCalories, setNewDishCalories] = useState<number>(500);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dish.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOrderClick = (dish: Dish) => {
    setSelectedDish(dish);
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    setOrderTime(localISOTime);
    setIsOrderModalOpen(true);
  };

  const confirmOrder = () => {
    if (selectedDish) {
      onOrder(selectedDish, orderTime, orderNote);
      setIsOrderModalOpen(false);
      setOrderNote('');
      setSelectedDish(null);
    }
  };

  const handleAutoFill = async () => {
    if(!newDishName) return;
    setIsAutoFilling(true);
    try {
      const jsonStr = await generateDishDetails(newDishName);
      const data = JSON.parse(jsonStr);
      if(data) {
        if(data.description) setNewDishDesc(data.description);
        if(data.calories) setNewDishCalories(data.calories);
        if(data.difficulty) setNewDishDiff(data.difficulty);
      }
    } catch (e) {
      console.error("Autofill failed", e);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSaveNewDish = () => {
    if (!newDishName) return;
    const newDish: Dish = {
      id: Date.now().toString(),
      name: newDishName,
      description: newDishDesc || 'A delicious homemade dish.',
      category: newDishCategory,
      difficulty: newDishDiff,
      calories: newDishCalories,
      tags: ['Custom', 'Homemade'],
      isFavorite: false,
      imageUrl: `https://source.unsplash.com/400x300/?food,${newDishName.split(' ')[0]}` // Fallback image
    };
    onAddDish(newDish);
    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishCategory(DishCategory.DINNER);
  };

  return (
    <div className="p-4 pb-24 space-y-4 min-h-screen bg-slate-50">
      {/* Search & Filter */}
      <div className="sticky top-16 z-30 bg-slate-50 py-2 space-y-2">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search our menu..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:${theme.border} focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all`}
              style={{ '--tw-ring-color': theme.primary.replace('bg-', '') } as any} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddDishModalOpen(true)}
            className={`bg-white border border-gray-200 ${theme.text} px-3 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50`}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
             onClick={() => setSelectedCategory('All')}
             className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === 'All' ? `${theme.primary} text-white` : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            All
          </button>
          {Object.values(DishCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? `${theme.primary} text-white` : 'bg-white text-gray-600 border border-gray-200'}`}
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
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
              />
              <div className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold ${theme.text} flex items-center gap-1`}>
                <Star size={12} className={`fill-current`} />
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
                    <span key={tag} className={`text-[10px] ${theme.secondary} ${theme.text} px-2 py-0.5 rounded border ${theme.border} bg-opacity-50`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => handleOrderClick(dish)}
                  className={`${theme.primary} text-white p-2 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1 text-sm font-medium pr-3`}
                >
                  <Plus size={16} />
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedDish && (
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
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    style={{ '--tw-ring-color': theme.primary } as any}
                    value={orderTime}
                    onChange={(e) => setOrderTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Request / Love Note</label>
                <textarea
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}
                  style={{ '--tw-ring-color': theme.primary } as any}
                  rows={3}
                  placeholder="Make it extra spicy! ❤️"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOrder}
                  className={`flex-1 py-2.5 ${theme.primary} text-white rounded-xl font-medium shadow-lg ${theme.shadow}`}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-gray-800">Add New Dish</h2>
               <button onClick={() => setIsAddDishModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Mom's Spaghetti"
                  />
                  <button 
                    onClick={handleAutoFill}
                    disabled={!newDishName || isAutoFilling}
                    className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 disabled:opacity-50"
                  >
                    {isAutoFilling ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newDishCategory}
                  onChange={(e) => setNewDishCategory(e.target.value as DishCategory)}
                >
                  {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                   <select 
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={newDishDiff}
                      onChange={(e) => setNewDishDiff(e.target.value as any)}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                   <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newDishCalories}
                    onChange={(e) => setNewDishCalories(Number(e.target.value))}
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveNewDish}
                disabled={!newDishName}
                className={`w-full py-3 ${theme.primary} text-white rounded-xl font-bold mt-2 hover:opacity-90 disabled:bg-gray-300`}
              >
                Save to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
