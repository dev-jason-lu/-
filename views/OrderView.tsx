
import React, { useState } from 'react';
import { Order, Dish, AppTheme } from '../types';
import { Clock, MessageSquare, Star } from 'lucide-react';

interface OrderViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  rateOrder: (orderId: string, rating: number, review: string) => void;
  theme: AppTheme;
}

export const OrderView: React.FC<OrderViewProps> = ({ orders, updateOrderStatus, rateOrder, theme }) => {
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Sort: Active orders first
  const sortedOrders = [...orders].sort((a, b) => b.orderDate - a.orderDate);

  const handleStatusChange = (order: Order) => {
    const flow: Order['status'][] = ['Pending', 'Cooking', 'Served', 'Completed'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex < flow.length - 1) {
      updateOrderStatus(order.id, flow[currentIndex + 1]);
    }
  };

  const submitRating = () => {
    if (ratingOrderId) {
      rateOrder(ratingOrderId, ratingValue, reviewText);
      setRatingOrderId(null);
      setReviewText('');
      setRatingValue(5);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'ASAP';
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Kitchen Orders</h2>
      
      <div className="space-y-4">
        {sortedOrders.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <p>No orders yet. Go to the Menu to request a dish!</p>
          </div>
        )}

        {sortedOrders.map(order => (
          <div key={order.id} className={`bg-white rounded-2xl p-4 border-l-4 shadow-sm ${order.status === 'Completed' ? 'border-slate-300 opacity-80' : theme.border.replace('border-200', 'border-400').replace('border', 'border-l')}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{order.dishName}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock size={12} /> {formatTime(order.scheduledTime)}
                  </span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold capitalize ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Cooking' ? 'bg-orange-100 text-orange-700' :
                order.status === 'Served' ? 'bg-green-100 text-green-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {order.status}
              </span>
            </div>

            {order.chefNote && (
              <div className={`${theme.secondary} p-2 rounded-lg text-sm text-slate-700 mb-3 flex items-start gap-2`}>
                <MessageSquare size={14} className={`mt-1 flex-shrink-0 ${theme.text}`} />
                <p>"{order.chefNote}"</p>
              </div>
            )}

            {order.status !== 'Completed' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusChange(order)}
                  className={`flex-1 ${theme.primary} hover:opacity-90 text-white py-2 rounded-xl text-sm font-medium transition-colors`}
                >
                  {order.status === 'Pending' ? 'Start Cooking' :
                   order.status === 'Cooking' ? 'Serve Dish' :
                   order.status === 'Served' ? 'Finish & Rate' : ''}
                </button>
              </div>
            )}

            {order.status === 'Served' && !order.rating && (
               <div className="mt-2">
                  <button 
                    onClick={() => setRatingOrderId(order.id)}
                    className={`w-full border-2 ${theme.border} ${theme.text} py-2 rounded-xl text-sm font-bold hover:bg-slate-50`}
                  >
                    Rate Meal
                  </button>
               </div>
            )}

            {order.status === 'Completed' && order.rating && (
              <div className="mt-3 border-t pt-2">
                 <div className="flex items-center gap-1 mb-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={14} className={i < order.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                   ))}
                 </div>
                 {order.review && <p className="text-sm text-gray-600 italic">"{order.review}"</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      {ratingOrderId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-center mb-4">How was the meal?</h3>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRatingValue(star)} className="transition-transform hover:scale-110">
                  <Star 
                    size={32} 
                    className={star <= ratingValue ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-300"} 
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a sweet thank you note..."
              className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              style={{ '--tw-ring-color': theme.primary } as any}
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex gap-3">
              <button onClick={() => setRatingOrderId(null)} className="flex-1 py-2 text-gray-500">Cancel</button>
              <button onClick={submitRating} className={`flex-1 py-2 ${theme.primary} text-white rounded-xl font-bold shadow-lg`}>Send Love</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
